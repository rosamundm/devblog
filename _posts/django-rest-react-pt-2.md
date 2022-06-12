---
title: 'Getting to grips with Django REST Framework and React, pt. 2'
excerpt: 'Part 2 of my tutorial on how to glue together your Django and React apps, passing data to a frontend.'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2022-05-06T00:00:00.322Z'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

In the [first post](/django-rest-react-pt-1/) in this series, I showed you how to send a Django list view to React. In this one, I am going to talk about routing and presenting a detail view — that is, coupling one REST resource to a specific page.

So, first off, it turns out that you can't go very far in React without learning about state and props, which I mentioned briefly in the other post. These require an almost philosophical mindset to understand, but like everything in programming, it is doable. There are [much better resources](https://www.freecodecamp.org/news/react-js-for-beginners-props-state-explained/) than this out there for mastering these concepts, but for the superficial purposes of this tutorial, I'll just say this:

* -- props can be thought of as properties (e.g. item ID)
* -- the state of an object holds the props

In this post I'm not only going to talk about how we fetch and display data for a single resource, but also how to set up the routing for each page in our app.

First, please look at the code for the list view from the previous post. Here's the one for the detail view, a component that I named `RestaurantInstance`.


```javascript
// components/Restaurant.js 
import React, { useEffect, useState } from "react"; 
import { JWT_TOKEN, LOCAL_API_URL } from "../constants"; 
import { Link, useParams } from "react-router-dom"; 

function RestaurantInstance() { 
    let params = useParams(); 
    const restaurantID = params.id; 
    const [restaurantInstance, setRestaurantInstance] = useState(null); 

    useEffect(() => {

        if (!restaurantID) { 
            return; 
        } 
        
        (async () => {
            const response = await fetch(`${LOCAL_API_URL}restaurants/${restaurantID}`, {
                method: "GET", 
                headers: { 
                    "Authorization": `JWT ${JWT_TOKEN}`, 
                    "Accept" : "application/json", 
                    "Content-Type": "application/json" 
                } 
            }); 
            const restaurantInstance = await response.json(); 
            setRestaurantInstance(restaurantInstance); 
    })(); 
}, [restaurantID]); 

if (!restaurantInstance) {
     return <div>Loading...</div>; 
} 

return (

    <div> 
        <h2>Restaurant: {restaurantInstance.name}</h2> 
        <div> 
            Slug: {restaurantInstance.slug} 
        </div> 
        <div> 
            <Link to={"/restaurants/"}> Back to list </Link> 
        </div> 
    </div> 
); 
} 

export default RestaurantInstance;

```

## Let's go through this again:

# **Lines 10-11:**
We're invoking a new hook called `useParams()`. This is for grabbing the dynamic value passed to the frontend via the API endpoint; in this case, that would be the ID of the restaurant object. We're going to use `restaurantID` as the parameter (see line 22) when making the API call.

# **Lines 15-37:**
Just like with the `RestaurantList` component, we make the `useEffect()` call to start the async task. If there is no `restaurantID` available, nothing will be returned. As before, we go through the process and set a `restaurantInstance`, if there is one.

# **Lines 39-54:**
Since we're not dealing with an array of objects here, but a single `restaurantInstance`, there's no need to apply `map()` to each object, as we did with `RestaurantList`. Now we can choose which attributes of the `restaurantInstance` we want to show on the frontend and express this with JSX accordingly.

# **Line 56:**
Don't forget to export `RestaurantInstance`! Notice how when we're talking about the component itself, it's in Pascal case (first letter of each word is uppercase) whereas when we name functions and variables, it's in camel case (the first letter of the first word is lowercase, the rest of the first letters are uppercase).
 
## Routing
In the last post, we touched on the React Router DOM package, because we inherited from its `Link` component. But we haven't yet defined routes for our app.

If you look at the code below, you can see that I have assigned routes to a corresponding component; for example, `/about` will lead to the `AboutPage` component. Which makes sense, right? As for our restaurants, we can see that for the `RestaurantList` component we have a route to our list of restaurants, and for the `RestaurantInstance`, there's a detail view that will render data according to the object ID that gets passed in.

```javascript
// App.js 
import React, { Component } from "react"; 
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import AboutPage from "./components/About.js"; 
import RestaurantInstance from "./components/Restaurant.js"; 
import RestaurantList from "./components/Restaurants.js"; 
import HomePage from "./components/Home.js"; 

class App extends Component { 
    render() { 
        return ( 
            <div> 
                <Router> 
                    <Routes> 
                        <Route path="/" element={<HomePage/>}/> 
                        <Route path="/about" element={<AboutPage/>}/> 
                        <Route path="/restaurants" element={<RestaurantList/>}/> 
                        <Route path="/restaurants/:id" element={<RestaurantInstance/>}/> 
                    </Routes> 
                </Router> 
            </div> 
        ) 
    } 
}; 

export default App;
```

## Up next
I'm currently figuring out how to represent nested data on the frontend. The next post in this series will be about that!
