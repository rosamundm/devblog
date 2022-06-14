---
title: 'Deploying a Django app to Heroku in 2021'
excerpt: 'The quirks of Heroku shouldn''t stop you from deploying your Django app there!'
date: '2021-07-29T00:00:00.322Z'
---

Deploying an app is arguably one of the trickiest part of being a developer. Sure, it's all fun and games making things work on your local machine, but once it's ready to go out into the world, there's a lot that can potentially go wrong and if you're not using the right tools and processes, you're going to get frustrated really quickly.

When deploying apps before, [Heroku](https://www.heroku.com/) was something I'd tried to figure out and ultimately ditched in annoyance. Documentation and tutorials around it are inconsistent, confusing, and often outdated. (One day, this post will no doubt be considered all of those things! The circle of life.)

While going through several job interviews recently, one of the test tasks was making a Django REST endpoint — so, a very rudimentary CRUD application. I wanted to send a working example as well as my actual source code, so I decided to see how it went with Heroku. This was a bit of a risky decision, as I was on a deadline. But it actually worked out pretty well, and I want to show you how I did it.

## Environment setup

So, you've got your Django project up and running on your local machine. Now run the following to install these packages into your project's virtual environment. The purpose of each package will become clear as we go on:

```python
pip install dj-database-url django-environ whitenoise gunicorn psycopg2-binary
```

And you haven't already, you should do these three things:

* -- [Sign up](https://signup.heroku.com/) for a free Heroku account.

* -- [Install the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) (so you can program directly from the console rather than on the website interface).

* -- Duplicate your project's `settings.py` file. Rename the new one to `local_settings.py` and add the file to `.gitignore`.

* -- Make a dotfile called `.env` in the same directory as the settings files. If you don't already know how to use environment variables to keep secret info out of version control, [here](https://github.com/joke2k/django-environ) is a good primer.

## Local database setup

When you migrate a local Django project for the first time, Django automatically provides you with a SQLite3 database. I have bad news: this is not supported by Heroku and you will have to create a PostgreSQL one instead. It is best to sort this out before you start trying to deploy to Heroku, which is why I'm including this step now.

Use cases will vary, but if you're anything like me, you probably won't have really important information in the SQLite3 database anyway. On a local database, I usually only input dummy data to make sure the schema is working as expected. For this reason, when I'm ready, I just delete the SQLite3 database and make a new PostgreSQL one to replace it.

Information on how to set up PostgreSQL itself, depending on what machine you're using, is well-explained [here](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database).

After doing this, you will need to go into both `settings.py` and `local_settings.py`. Replace the `DATABASE` dictionary (the one containing `'ENGINE': 'django.db.backends.sqlite3'` and so on) in each one with the following:

```python
DATABASE = { 
    "default": { 
        # note the engine is now psycopg2 (a Python-PostgreSQL adapter): 
        "ENGINE": "django.db.backends.postgresql_psycopg2", 
        "NAME": os.environ.get("DB_NAME"), 
        "USER": os.environ.get("DB_USER"), 
        "PASSWORD": os.environ.get("DB_PASSWORD"), 
        "HOST": os.environ.get("DB_HOST"), 
        "PORT": "5432", 
    } 
}
```

You'll notice that some of the values have been concealed in environment variables starting with `DB_` — this is where the `.env` file comes in. In this hidden file, I defined `DB_NAME`, `DB_USER` etc. so that when the environment is activated, those values will be called. It's now time to define a `DATABASE_URL`, too.

Using the various database credentials already defined in `.env`, and the URL schema for various databases [here](https://github.com/jacobian/dj-database-url#url-schema), you can put yours together. It should end up looking something like this: `postgres://username:p455w0rd@000.000.000.00:5432`

Now, only in `settings.py` — i.e. the production settings file — add the following line underneath the definition of `DATABASE` (it may be helpful to include the comment in yours, too):

```python
# for Heroku in production: 
DATABASE['default'] = dj_database_url.config()
```

This will override the `default` key from before so that the database config will now come from your `DATABASE_URL`.

Once you've done all this, setting up your production database should be relatively seamless. Doing all the controlling of a remote database from the command line takes some getting used to, but all in all, I like it.

## Creating a Heroku app

Now we are going to effectively put a copy of our Django application onto the Heroku production server. By now, you have probably already been prompted to log into your Heroku account on the CLI. If not, just type `heroku login`. Now it's time to think of a name for your app and then run `heroku create <app_name> --buildpack heroku/python`. What exactly is happening here?

* -- We're giving our app a name! This is how it will be referred to around Heroku and will also be the first part of your app's URL once it is live.

* -- We're creating the app with a *buildpack* already built in. (A buildpack is a bunch of scripts that will take the code in your main language — in this case, Python — and make it run on Heroku.)

Before you go any further, you should read up on the requirements for a Heroku Python app; if these are not present, Heroku will not recognise it. Create the following files:

* -- `requirements.txt`: a list of packages installed.

* -- `runtime.txt`: declares the app's Python version at runtime, e.g. `python-3.9.5`. Heroku only supports specific Python versions, so you may need to consult the docs and make sure the right version is installed.

* -- `Pipfile.lock`: dependencies for the project. Usually generated automatically from `Pipfile` if you are working with `pipenv`, but I wasn't, and I was in a hurry, so I just made it manually 😉

* -- `Procfile`: a Heroku-specific file declaring the production HTTP server (Gunicorn). You will need to consult your project's `wsgi.py` when creating this file. Necessary for configuring dynos, which you can think of as your Heroku project's energy drinks.

## Production database setup

Now it's time to make sure your app has a database.

The next steps for setting up your Heroku database are actually detailed pretty well [here](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1). After that, if you then want to see what your production `DATABASE_URL` is in the CLI, run `heroku config`. You can also get further information about your database by running `heroku pg`, as shown in the [Heroku docs](https://devcenter.heroku.com/articles/getting-started-with-python#provision-a-database).

## Static files

Static files are your images, CSS, and JS, including those that come with Django for styling the admin interface, etc. Django does not natively host them in production, so we are using the `whitenoise` package.

Add the following to the middleware in `settings.py` (the production one):

```python
MIDDLEWARE = [ 
    "django.middleware.security.SecurityMiddleware", 
    "django.contrib.sessions.middleware.SessionMiddleware", 
    "django.middleware.common.CommonMiddleware", 
    "django.middleware.csrf.CsrfViewMiddleware", 
    "django.contrib.auth.middleware.AuthenticationMiddleware", 
    "django.contrib.messages.middleware.MessageMiddleware", 
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
     # add this line! 
    "whitenoise.middleware.WhiteNoiseMiddleware", 
]
```

You will also need to declare a `STATIC_ROOT` constant in order for it to work:
```python
# ideally add this above/below the STATIC_URL already provided: 
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
```

## Push your app to Heroku

Now that your app has been baking for a bit, it's time to take it out of the oven! 🥧

When you created your app, a Git remote was set for Heroku (this will look something like `https://git.heroku.com/<app-name>.git`). This is randomly generated, so it will be a bit nonsensical.

Because we're using Git, and you added `local_settings.py` to `.gitignore`, only the `settings.py` file will end up on the production server. Now all you need to do is run `git push heroku main` in the CLI and your code will be on Heroku! Visit your app at `<app-name>.herokuapp.com` and you should be good to go!
