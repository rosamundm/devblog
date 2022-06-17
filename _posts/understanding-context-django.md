---
title: 'Understanding context in Django'
excerpt: 'Context is such a vague word... it could mean anything. So what does it mean in Django?'
date: '2020-12-05T00:00:00.322Z'
---

## Context is everything!

The more time you spend with Django, the more you'll see `context` everywhere.

At first, it seemed way too abstract for me to really get my head around, but it's actually crucial for passing data to the frontend of an application. The concept of "context" is not actually unique to Django — or even to backend programming as a whole — but here I'm just going to address what it means in Django.

Think of it like this: you need the frontend to show your backend data to users. But since they are separate entities and the frontend can't just receive the data as it is, the frontend is like, "Er, what are you talking about? I'm gonna need some *context*...?"

Let's jump right in with an example from the source of the original version of [this](https://rosederwelt.com/blog/) blog. The following model is for a blog index page, i.e. something like this, where all the blog posts are displayed.

N.B.: Regular Django applications will separate models and views. In Wagtail, however, which is where this snippet comes from, views in their own right are pretty much done away with. Instead, there tends to be a section of the model class that essentially stands in for a function-based view (commonly abbreviated as FBV). What they have in common: at the heart of each one is a queryset.

```python
class BlogIndexPage(Page): 
    body = RichTextField(blank=True) 
    
    def get_context(self, request, *args, **kwargs): 
        context = super().get_context(request, *args, **kwargs) 
        blogpages = BlogPage.objects.live().public().order_by("-date") 
        
        if request.GET.get("tag", None): 
            tags = request.GET.get("tag") 
            blogpages = blogpages.filter(tags__slug__in=[tags]) 
            context["blogpages"] = blogpages 
            return context 
```
* -- Let's first skip to line 12 for a second. If we take `context` by its roughest explanation, which is that it is a dictionary — a set of key-value pairs — with a variable name as the key and its value as the value, then this case, the value of the key `"blogpages"` is `blogpages`.

* -- We first encounter `blogpages` in the `get_context()` method starting on line 4. (Not especially relevant to this topic, but `get_context()` is from `BlogPageIndexPage`'s parent class, `Page`, which is why `super()` is then applied so that method can be used here.)

* -- Line 6 introduces `blogpages`, a queryset for fetching all `BlogPage` objects that are live & public, and returning them in descending order.

* -- In line 8, a condition is specified: is there a request being made for a tag. Let's say there is — so in line 9, we define the `tags` variable.

* -- In line 10, the `blogpages` object is overwritten and redefined as a filtered queryset that returns all tags by unique tag (with the `django-taggit` package). By the way, the reason the variables are separated by underscores are because these are the lookups in our queryset. In `tags` we are searching for the `slug` attribute in the value of `tags`.

* -- In line 12, we give our context a name: `blogpages`. As you can see, we will be wanting the context from the value of a key called `"blogpages"`. The value is assigned to the `blogpages` object defined above. Here we are actually initiating an empty dictionary variable called `context` and then adding the key-value pair to it, just as you would with any other Python dictionary.

* -- In line 13 we return the context, thus concluding the logic and making the object ready to be dynamically displayed to the frontend user!

Note that Python's `get()` method returns a value for the given key — this is the syntax of the method: `dict.get(key[value])`

So, what happens when we look at the template for `BlogIndexPage`?

```python
{% block content %} 
  {% for post in blogpages %} 
    {% with post=post.specific %} 
      <h2>
        <a href="{% pageurl post %}">{{ post.title|richtext }}</a>
      </h2> {{ post.date }} 
    {% endwith %} 
   {% endfor %} 
{% endblock %}
```

Django templates are actually HTML files, but you can use its built-in templating language and do cool stuff like for-loops just as you would in Python. So, bearing in mind that the `blogpages` context variable is a Python object, we can say that for each post in it, we want this and this to happen. In line 5, our context is already in action — `blogpages` is fetched. Additionally, we use Wagtail's own database method, `specific()` (note that in the template, the method call is rendered without the brackets), so that for each `post` instance [the most specific data possible is retrieved](https://github.com/wagtail/wagtail/blob/master/docs/releases/1.1.rst). We then proceed to tell Django how we want various `post` attributes to be displayed — `post.title`, `post.date`, etc.

## Context processors

The [Django docs](https://docs.djangoproject.com/en/3.1/ref/templates/api/) say:

*`context_processors` is a list of dotted Python paths to callables that are used to populate the context when a template is rendered with a request. These callables take a request object as their argument and return a [dict](https://docs.python.org/3/library/stdtypes.html#dict) of items to be merged into the context. It defaults to an empty list.*

In other words, a context processor is a method that takes a an argument (often `request`) and returns a dictionary.

Take a look at the `TEMPLATES` list in the `settings.py` file of your project. The following list of default Django context processors are there:

```python
"context_processors": 
  [
      "django.template.context_processors.debug", 
      "django.template.context_processors.request", 
      "django.contrib.auth.context_processors.auth", 
      "django.contrib.messages.context_processors.messages", 
  ],
```
Any other custom context processors you make for your application will then have to be added here so that Django can find them when rendering a template. [Here's](https://medium.com/better-programming/django-quick-tips-context-processors-da74f887f1fc) a well-explained tutorial for making your own.

## Context on the client side

Lately, I've taken a dip into the frontend and been trying to develop a separate, rudimentary UI for my Django application. As we've seen here already, context is important when it comes to communication between the backend and frontend. This merits its own post, though.
