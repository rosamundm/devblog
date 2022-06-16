---
title: 'random.choice() vs random.choices()'
excerpt: 'The difference between the two methods for Python''s in-built random module.'
date: '2021-06-27T00:00:00.322Z'
---
Here's a little something I caught a while ago. I was expanding a [Flask app](https://github.com/rosamundm/german-vocab-generator) that returned objects — vocabulary pairs — from the database and would display them in the template at random:

```python
def get_random_pair():
    vocab = VocabItem.query.all() 
    random_record = random.choice(vocab) 
    random_german_word = random_record.de_word 
    english_translation = random_record.en_transl 
    number_of_records = len(vocab) 
    return render_template(
        "index.html", 
        random_german_word=random_german_word, 
        english_translation=english_translation, number_of_records=number_of_records
    )
```

In line 3, the queryset fetches all instances of `VocabItem` (via the SQLAlchemy ORM, by the way). In line 4, `random_record` represents one randomly-selected item from this queryset. By importing Python's in-built `random` module and calling the `.choice()` method, one non-iterable object — a string or an integer, say — will be returned in its original form.

But what if you type it wrong, like I did at first, and you don't get the result you expected? Unthinkingly, at first I used `.choices()` instead of `.choice()` in the code above. Since my method was expecting to get a non-iterable object and was instead presented with a list, it could not return the attributes that I asked for.

So what *does* it do?

Let's say we have a list called `vegan_protein_sources`:

```python
vegan_protein_sources = ["tempeh", "tofu", "cashews", "kidney beans", "chickpeas", "oats"]

# The list serves as the 'sequence' parameter for .choices(): 
random.choices(vegan_protein_sources) 

# Output is a single, random element returned in list format: 
['tofu'] 

# Now again, but with optional parameters 'weights' and 'k': 
random.choices(
    vegan_protein_sources, 
    weights=[2, 53, 23, 12, 53, 22], 
    k=2
) 

# Output is 2 random list elements, as was specified in the 'k' parameter: 
['cashews', 'tofu']
```

What do you notice about the statement on line 13 in relation to the output? And what's `weights`, anyway?

`weights` is used to orchestrate the probability that these elements will be chosen. There is a list of six elements contained in the `weights` keyword argument — the same number of elements in `vegan_protein_sources`. So this means each element will be given that weight in the order that the integers are given in the `weights` parameter.

Off the top of my head, I can't really think of an exact use case in software development for `.choices()`, but I can imagine it comes in very handy for more scientific disciplines.

So, to summarise: `.choice()` for one selected element from a list, `.choices()` for a list of elements randomly selected from the list under certain parameters.
