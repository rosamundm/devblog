---
title: 'Assorted thoughts on Django migrations'
excerpt: 'Making sense of a few common patterns in Django migration files.'
date: '2021-09-20T00:00:00.322Z'
---

I meant to make this post a while ago, after constantly coming across an error that contained a surprisingly ungoogleable term. As I got more experience working with Django migrations, though, I learnt some more bits and pieces that would come in handy, so I've decided to put a bunch of them in one post.

## `_ptr`
You'll probably have seen a version of the error message below if you've ever set an existing model field from `null=False` to `null=True`, then tried to migrate. Suddenly, now that the field cannot be empty, the rows that already exist need to be populated with a value.

```python
You are trying to add a non-nullable field 'page_ptr' to 
<custompagemodel> without a default; we can't 
do that (the database needs something to populate existing rows). 
Please select a fix: 
1) Provide a one-off default now (will be set on all existing 
   rows with a null value for this column) 
2) Quit, and let me add a default in models.py
```
In a development environment, where it generally doesn't matter too much what is actually in the database, you can just choose option 1 and then type any old number once you are prompted with the Django shell. (If you do go for option 2 and the field in question is a `CharField`, you could add `default=''` in the model definition.)

But there's something else curious about this message. Just what *is* `page_ptr`? Well, it turns out that `_ptr` means "pointer", i.e. it points to the parent model, which in this case is `Page`. I got this error when I changed `StreamBlogPage`, a child of `Page`, back to simply `Page`. My reason for doing this was that I wanted to customise the regular `Page` model by adding streamfields so that it would have these by default.

## Editing Django migrations

My mind was blown when I realised you can edit Django migrations, which I learnt in my previous job. It felt like... I don't know, altering the pH of the soil or something!

In my current job, where I'm building a backend from the ground up, things are a lot more open to interpretation as we are still working on the model architecture.

Here's an example: I had erroneously assigned a parent-child relationship to a pair of models and then migrated it. When I rectified it, chaos inevitably ensued, as the fields of the base class and the inheriting class clashed.

The solution: remove the base class `ptr` from the migration featuring the inheriting class. In the example below, I have commented out the attributes that need to be removed from the migration so that the formerly inheriting class can stand alone:

```python
migrations.CreateModel(
    name="ExampleModelChildClass", 
    fields=[
        ( 
            # "examplemodelbaseclass_ptr", 
            "id", 
                # new, added by me: 
            models.OneToOneField(
                auto_created=True, 
                on_delete=django.db.models.deletion.CASCADE, 
                    # here I removed:
                    # parent_link=True, 
                primary_key=True, 
                serialize=False, 
                to="app.examplemodelbaseclass", 
            ), 
        ), 
        ("name", models.CharField(max_length=30)), 
        ("value", models.FloatField()), 
    ], 
        # here I removed:
        # bases=("app.examplemodelbaseclass",), 
),

```
Depending on the complexity of your project, you may have to think about when you made which change to the model. But if the project happens to be small and you created all your models at once, it should be in `0001_initial.py`.

## Renaming and consolidating migrations

The case above is an ideal example of where renaming migrations starts to make sense. When you make a new migration, it will generate a name that's vague and not very readable, like `0002_auto_20210901_1436.py`. Sure, this might be initially useful when you want to revert changes that you know you made at around 10:30am, but as the project scales and more developers become involved, that won't work anymore.

Here's what to do if you have a bunch of auto-migrations with vague names (e.g. with numbers `0120`, `0121`, `0122`, `0123`) and want to go back to `0120` (hint: you don't need to add the full migration name, just the number).

```python
./manage.py migrate <app_name> 0120
    # Then re-add the new migrations: 
./manage.py makemigrations <app_name> 
    # Rename this new migration to something more descriptive: 
mv <automigration_name_with_relative_path> <new_name_with_relative_path> 
    # Migrate: 
./manage.py migrate <app_name>
```
Depending on the complexity of your project, you may have to think about when you made which change to the model. But if the project happens to be small and you created all your models at once, it should be in `0001_initial.py`.

## Squashing migrations

At my old job, the rule of thumb was one migration per merge request. I don't know whether that's widely considered a best practice, but it makes perfect sense to me.

If you make a bunch of model changes and haven't migrated them yet, it can be good to run `showmigrations`, which will show a checklist of which ones have been applied, and then `squashmigrations`, so that your multiple changes are in one migration file.

Here is how to squash your migrations — again, you don't need the entire file name, just the migration number:

```python
./manage.py squashmigrations <app_name> <migration_to_squash_from> <migration_to_squash_to>
```

After you have confirmed you want to squash these migrations, the following message will come up:

```python
You should commit this migration but leave the old ones in place; 
the new migration will be used for new installs. 
Once you are sure all instances of the codebase have applied the 
migrations you squashed, you can delete them.
```

I recommend saving the old migrations in a separate folder outside your project until you are certain you don't need them anymore.

Django will produce a new migration named something like `0001_initial_squashed_auto.py` and once again, this is your chance to think of a short and catchy name that summarises the changes you have made before you commit the migration!

