---
title: 'Getting to grips with Django REST Framework and React, pt. 1'
excerpt: 'Part 1 of my tutorial on how to glue together your Django and React apps, passing data to a frontend.'
date: '2022-01-14T00:00:00.322Z'
---

Python libraries used (it's also assumed you've already set up a basic Django application with a superuser): [Django](https://www.djangoproject.com/) | [Django REST Framework](https://www.django-rest-framework.org/) | [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/) | [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)

JavaScript package manager and libraries used: [npm](https://www.npmjs.com/) | [React](https://reactjs.org/) | [React Router DOM](https://v5.reactrouter.com/web/guides/quick-start)

Are you a Django backend developer curious about what exactly the frontend devs do with your work? Do you want to dip a toe into the mysterious world of React? Even though it's usual for software engineers to be specialised in one area of the stack, I believe it's highly beneficial to strive for a holistic outlook! That doesn't mean you need to know every little thing about "the other side", but you have nothing to lose by learning more.

For many newbie devs, "API" is one of the most nebulous concepts out there, as it can mean just about anything depending on the context. I actually don't find the common definition, "how two applications talk to each other", very helpful.

For the purposes of this post, an API is the way in which the frontend gets its data from the backend. These are two separate applications: backend could be a Django application and frontend could be a React application, for example.

There are a great many tutorials out there, but none of them covered exactly what I needed: creating a bare-bones React app and displaying some information from my database on it, just so I knew it could. Which is why I made my own. In the post, we will save some JSONified data into a Django model and then display it on a separate React application. First things first, though:

## What is a REST API?

Django REST Framework (aka DRF) is a very well-regarded tool for building REST APIs in a Django project. But what is that, exactly?
REST stands for "representational state transfer". What's important for you to know, though, is that HTTP requests are sent to an application's interface to exchange information. You get a piece of information (resource) or an HTTP method (action) associated with a specific URL (often called an "endpoint"). To learn more about REST, [this](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/) is a good intro and [this](https://restfulapi.net/) goes a bit more in-depth.

## What is JSON?

Think of JSON as a common "language" between the frontend and backend. It stands for JavaScript Object Notation and is usually pronounced just like the name "Jason". In this scenario, a Django-based API would converts database data into JSON format, making it available for other applications. The React app then consumes it, ideally also rendering it in the browser.

Here's some data from my [Mapstr](https://mapstr.com/) account which I exported in CSV format, then converted into JSON:

```json
[ 
    { 
        "name":"SOFI",
        "address":"Sophienstraße 21, 10178 Berlin, Deutschland", 
        "icon":"generic", 
        "user_comment":"None", 
        "tags":"Ausprobieren#Coffee and cake" 
    }, 
    
    { 
        "name":"Sakura", 
        "address":"Tieckstraße 8, 10115 Berlin, Deutschland", 
        "icon":"generic", 
        "user_comment":"None", 
        "tags":"Coffee and cake#100% vegan#Ausprobieren" 
    }, 
    
    { 
        "name":"Kanaan", 
        "address":"SchliemannStraße 15 Prenzlauer Berg, 10437 Berlin Germany", 
        "icon":"restaurant", 
        "user_comment":"None", 
        "tags":"100% vegan#Ausprobieren" 
    } 
]
```
Do you notice anything? Yes, this is a list of objects with different attributes. Let's pretend we just grabbed this data from a database, rather than mocking it up. In a Django model, it could well be represented like this, for example:

```python
class Restaurant(Model): 
    name = CharField(...) 
    address = CharField(...) 
    icon = CharField(...) 
    user_comment = TextField(...) 
    tags = ArrayField(...)
```

## Serializers

Serialization is when this model information is transformed into JSON in order to become usable outside the backend. This process uses... a serializer! In order to start using one, we need to install DRF. After you've done that, create your own `serializers.py` file within the app directory, so it lives alongside `models.py`. And in its simplest form, a serializer can be pretty 1:1 with the model itself:

```python
from rest_framework import serializers 
from .models import Restaurant 


class RestaurantSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Restaurant 
        fields = ["name", "address", "icon", "user_comment", "tags",]
```

## Views

The next step is `views.py`, which you may already be familiar with in Django. Remember, a view controls how data is sent to the client (whether it's to a Django template or via an API to the frontend).

DRF has an extension of classic Django views, called viewsets. In DRF, a viewset is a class that covers the basic CRUD functions (Create, Retrieve, Update, Delete) so that we don't have to explicitly define them.

It could be as plain as this:

```python
from rest_framework import permissions, viewsets 
from rest_framework_simplejwt.authentication import JWTAuthentication 
from .models import Restaurant 
from .serializers import RestaurantSerializer 


class RestaurantViewSet(viewsets.ModelViewSet): 
    queryset = Restaurant.objects.all().order_by("name") 
    serializer_class = RestaurantSerializer 
    authentication_class = JWTAuthentication 
    permission_classes = permissions.IsAuthenticated 
    pagination_class = None
```

Let's go through the viewset line by line:
-- `queryset`: the view will return all `Restaurant` objects in alphabetical order
-- `serializer_class`: our serializer!
-- `authentication_class`: the type of authentication we'll be using
-- `permission_classes`: who's permitted to access these views; in this case, only authenticated users. Options will be stored in the `DEFAULT_PERMISSION_CLASSES` setting
-- `pagination_class`: set to `None` to avoid potential display problems for now. This will override whatever is in the `DEFAULT_PAGINATION_CLASS` setting

## URLs

Lastly, it's time to set up the URLs. First of all, make sure you have SimpleJWT installed, as this is how we are going to create our first API endpoints. Then go to `urls.py` in the root of your project and add the following to the top of the file:

```python
from django.contrib import admin 
from django.urls import include, path 
from rest_framework import routers 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView 
from restaurants.views import RestaurantViewSet
```

Here, we have not only imported the views from our `restaurants` app directory, but also a few that will help us with authentication tokens. We can then configure our URL patterns as follows:

```python
from django.contrib import admin 
from django.urls import include, path 
from rest_framework import routers 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView 
from restaurants.views import RestaurantViewSet 


urlpatterns = [
    path("admin/", admin.site.urls), 
    # telling Django to take note of the built-in DRF URLs: 
    path("api-auth/", include("rest_framework.urls")), 
    # include any URLs specified within the app: 
    path("", include("restaurants.urls")), 
    # the "landing page" for the API: 
    path("api/v1/", include(router.urls)), 
    # SimpleJWT: 
    path("api/v1/token-auth/", TokenObtainPairView.as_view(), name="token_obtain_pair"), 
    path("api/v1/token-refresh/", TokenRefreshView.as_view(), name="token_refresh"), 
    path("api/v1/token-verify/", TokenVerifyView.as_view(), name="token_verify"), 
    # one view for now: a list with the GET method: 
    path("restaurants/", RestaurantViewSet.as_view({"get": "list"}), name="restaurants"),
]
```

If you now run your Django server and visit `localhost:8000/api/v1/token-auth/`, then you should see the browsable API page with a form for you to log in as an authenticated user. Leave it for now; we'll come back to this!

## Authentication & permissions

Pretty straightforward so far? This is where it gets a bit trickier.
You might be wondering what JWT stands for, anyway. JSON Web Token, baby! The purpose of this token (which is just a long string, really) is to make sure that nobody accesses the API who shouldn't be doing so. When decoded, the string contains a lot of information (check out the anatomy of a [JWT](https://jwt.io/introduction) here). There's a bit of Django-specific stuff that you need to watch out for here so it will all work.

First, you need to sort out your CORS (Cross-Origin Resource Sharing) to help with the aforementioned security. You can get the quick gist of what CORS is about here. Luckily, Django CORS Headers is a package that handles the so-called header for us — that is, the "metadata" of the request, which holds information including the token and the request type.

First, we need to go to our Django settings file. If you've already set up DRF, there should already be a dictionary in the file called `REST_FRAMEWORK`. Now make sure it has the following:

```python
REST_FRAMEWORK = { 
    "DEFAULT_AUTHENTICATION_CLASSES": 
        [ 
            "rest_framework_simplejwt.authentication.JWTAuthentication", 
            ... 
        ], 
}
```

Other types of authentication, such as `SessionAuthentication` and `BasicAuthentication`, are beyond the scope of this post, but you can get more info on them in the DRF docs. The most important thing to focus on here is `JWTAuthentication`!

You can also add the following bits and pieces to your settings file to make sure everything works correctly:

```python
SIMPLE_JWT = { 
    # don't forget: from datetime import timedelta
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),  
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14), 
    "ROTATE_REFRESH_TOKENS": True, 
    "BLACKLIST_AFTER_ROTATION": False, 
    "ALGORITHM": "HS256", 
    "SIGNING_KEY": SECRET_KEY, 
    "VERIFYING_KEY": None, 
    "AUTH_HEADER_TYPES": ("JWT",), 
    "USER_ID_FIELD": "id", 
    "USER_ID_CLAIM": "user_id", 
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",), 
    "TOKEN_TYPE_CLAIM": "token_type"
} 

# These settings are just for development; 
# on a live site, we wouldn't want these to be True! 
CORS_ORIGIN_ALLOW_ALL = True 
CORS_ALLOW_CREDENTIALS = True 
CORS_ORIGIN_WHITELIST = ("http://localhost:3000",) 
CSRF_TRUSTED_ORIGINS = ("http://localhost:3000",)
```

The API should now behave the way we want it to! Go back to `localhost:8000/api/v1/token-auth/` and log in with your Django superuser details. Now, you should have the following come up:

```json
{"refresh": "ey123456verylongstring", "access": "ey654321anotherverylongstring"}
```

Copy the value of the access key, as this is what will serve as our JWT proper. We can now test our API with some requests using [curl](https://curl.se/), a command-line tool that comes with Mac (not sure about other OS). There is a lot to learn about it, but we can keep it relatively simple by performing a request straight from our terminal:

```json
curl -H "Authentication: JWT <add-token-here>" localhost:8000/api/v1/restaurants/
```

Your terminal will hopefully give back our restaurant JSON data with a HTTP 200 response. Woohoo! Since the restaurants list page is a protected view, we're only receiving the data because we are authenticated. If we weren't, we'd get a 401 (unauthorised) or 405 (method not allowed). The JWT is essentially a proxy for our login details so we don't have to type them out every time we want to make a request.

## Calling the API with React

Now it's time to excitingly step outside of the backend world and into the frontend world! Frontend isn't just about the visual interface; it's also heavily about consuming the API in order to obtain the information it needs.
First, make a directory called `frontend` in the project root and navigate to it. You can then find all the info you need about setting up React here. After you've done that, delete the stuff from the `App.js` file and replace it with the following:

```javascript
import React, { Component } from "react"; 
import RestaurantList from "./components/Restaurants.js"; 

class App extends Component {
    render() {
        return (
              <div className="App"> 
                <RestaurantList/> 
              </div> 
        ) 
    } 
}; 

export default App;
```

As you can see, the `RestaurantList` component itself will be built in another file. Navigate to `frontend/src`. I'd suggest first creating a file to create the constants you'll need; `constants.js`, perhaps. In it, you can add the following:

```javascript
export const JWT_TOKEN = "<token>"; 
export const LOCAL_API_URL = "http://localhost:8000/api/v1/";
```

Don't forget to add this file to `.gitignore`!

After that, create a new directory called `components`, and from there, create a `Restaurants.js` file. This is how it should look:

```javascript
import React, { Component } from "react"; 
import { Link } from "react-router-dom"; 
import { JWT_TOKEN, LOCAL_API_URL } from "../constants"; 


function RestaurantList() {
    const [restaurantList, setRestaurants] = useState([]); 
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); 
    useEffect(() => {
        (async () => {
            const response = await fetch(`${LOCAL_API_URL}restaurants/`, { 
                method: "GET", 
                headers: {
                    "Authorization": `JWT ${JWT_TOKEN}`, 
                    "Accept" : "application/json", 
                    "Content-Type": "application/json" 
                }
            }); 
            const data = await response.json(); 
            setRestaurants(data); 
            })(); 
        }, []); 
        
        return (
            <div> 
                <h2>Restaurant:</h2> 
                
                {restaurantList.map((restaurant) => (
                    <div key={restaurant.name} onClick={() => setSelectedRestaurant(restaurant)}> 
                        <Link to={`/restaurant/${restaurant.id}`}> 
                            {restaurant.name} 
                        </Link> 
                    </div> 
                ))} 
            </div> 
        ) 
} 

export default RestaurantList;

```

## Let's go through it bit by bit:

**Lines 1-3:**

Importing what we'll need from the React and React Router libraries, as well as the constants we've defined.

**Lines 5-8:**

Constructing `RestaurantList` as a functional component (in a previous version of the tutorial I did it as a class component, but this is now [disadvised](https://www.robinwieruch.de/react-class-component-deprecated/)).

In Line 7, we invoke the `useState()` hook for the list of resources, setting a [dependency array](https://dennyscott.io/use-effect-dependency-array/) equal to it. In Line 8 we do the same, but for the single resource. The hook replaces the traditional `this.state` object that's used in class-based components.

`state` will be a new concept for React beginners — to summarise, this is where an object's properties, aka `props`, are stored. (It will probably take a bit of practice for you to get the hang of these, but you can read up a bit on it [here](https://www.robinwieruch.de/react-pass-props-to-component/).)

**Lines 10-24:**

We call another hook, `useEffect()`, as an arrow function, to perform what's called a "side effect". This is basically a task; in this case, fetching data from the API. Then we use [JavaScript's in-built async / await keywords](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) to start a task, and then finish it once a certain condition has been completed. Asynchronous programming may sound daunting, but let's strip the logic down:

* -- we can't get our *response* until the endpoint has been *fetched* (Line 13)
* -- and we can't get our *data* until we have received a *response* (see Line 21).

And you remember the headers from before, right? This is where we add our token, as well as a couple of other details. Once this has run through, in Line 22 we "save" the data from the response with the `setRestaurants()` method.

Bonus info: you might be wondering what's with the extra `()` in Line 23. This means that the function is called as soon as it is defined; in other words, an [Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). And the seemingly random `[]` (empty array) in Line 24 makes sure that `useEffect()` will be executed just once per render.

**Lines 26-43:**

So, we have our `restaurantList`. But what are we going to do with it now? Just like any other function, this one has a return statement. We're going to use JSX, a [JavaScript/HTML hybrid script](https://reactjs.org/docs/introducing-jsx.html) that helps describe how we want to render the component.

Using the JavaScript `map()` method — which follows pretty much the same concept as its Python equivalent — we loop through the `restaurantList` array, name each item `restaurant`, and for each one:

* -- the item's key prop will be `restaurant.name`
* -- when we click on the link, the `restaurant` will be saved to `state`
* -- it will link to a page that takes the `restaurant.id` as a slug
* -- the restaurant will be represented on the page as `restaurant.name`

All in all, we're going to get a list of restaurants that are linked to a unique page per restaurant.

**Line 45:**

Each component has to be exported in order for the React app to acknowledge it, and so that it can be potentially imported into other files.
 
## Good to go
Now make sure your Django server is running and you have the most up-to-date JWT. Run `npm start` in the terminal and open `localhost:3000` in your browser. Don't forget to have your Django server running at the same time. Your data should be there on the page! Woohoo! 🍄
 
## Next up: detail view page
We've managed to display a list of resources and linked to some hypothetical pages for each one! But what if we want to customise how the detail page for a single resource looks? Stay tuned!
