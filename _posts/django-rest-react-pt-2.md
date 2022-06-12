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