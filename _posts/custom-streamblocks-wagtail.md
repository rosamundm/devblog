---
title: 'Adding custom StreamBlocks to your Wagtail site'
excerpt: 'Part of the fun of using Wagtail is its native StreamFields feature, allowing you to tailor the CMS to the user''s needs. This posts shows how to make your first ones.'
date: '2020-11-26T00:00:00.322Z'
---

Part of the fun of [Wagtail](https://wagtail.io/), a hot Django-based CMS, is its [StreamFields](https://docs.wagtail.io/en/v2.11.2/topics/streamfield.html) feature: developers have the ability to write individualised StreamBlocks tailored to the editors' needs, which can then be mixed and matched as you need them. For example, this very post is a combination of several text blocks and code blocks.

I spent months of trial and error trying to figure out how to make an image block, and finally found a solution of sorts to this problem. Here is a quick guide on how to add a couple of different types.

## Rich text block

This may sound obvious at first, but it's likely you'll want to use one to add paragraphs of text between your other blocks.

The following assumes you already know a little bit about [StreamFields](https://learnwagtail.com/tutorials/how-add-basic-streamfield-your-wagtail-cms-page/) and have created a page that can accommodate them. If not, I can recommend this tutorial; do that first. In your app's `blocks.py`, add a rich text block. I named mine `ParaBlock` so as not to get muddled up.

Block model: 
```python
class ParaBlock(blocks.RichTextBlock): 
    paragraph = RichTextBlock( form_classname="post_text", required=False, ) 
    editor = "default" 
    
    class Meta: 
        icon = "edit" 
        template = "blog/streams/para_block.html" 
        
```
Block template:
```html
{% load wagtailcore_tags %} 
<section> 
  <div class="para-block"> 
    {{ self.paragraph }} 
  </div> 
</section>

```

## Code block

The good news is this is also fairly straightforward, because somebody already [made it for you](https://github.com/FlipperPA/wagtailcodeblock)! First off, run `pip install wagtailcodeblock` and then add `wagtailcodeblock` to your `INSTALLED_APPS`. As before, add a code block to `blocks.py` — I recommend calling it `CodingBlock` for easy differentiation from `CodeBlock`.

```python
class CodingBlock(blocks.StructBlock): 
    code = CodeBlock(classname = "post_code", required=False) 
    language = blocks.ChoiceBlock(default="python") 
    text = blocks.TextBlock() 
    
    class Meta: 
        icon = "code" 
        template = "blog/streams/code_block.html"
```

On your page template itself, you don't need to add anything special. For the block template, however, I put the following. This means that in the editor interface, you can select the language of the code you're writing. In case you were wondering, [PrismJS](https://prismjs.com/) is a syntax highlighter, so it will format your code depending on the language:

```html
{% load static wagtailcore_tags wagtailcodeblock_tags %} 

<!-- for PrismJS: --> 
<script src="{% static 'js/prism.js' %}" type="text/javascript"></script> 

<link rel="stylesheet" href="{% static 'css/prism-synthwave84.css' %}" type="text/css"> 
  <section> 
    <pre>
      <code class="language-{{ self.language }}"> 
        {{ self.text }} 
      </code> 
    </pre> 
  </section>
```

The `<pre>` tag is used here (as opposed to, say, `<p>`), because it lends itself well to monospaced fonts, i.e. pre-formatted text.

Now, what about those links in the template? Those are the JavaScript and CSS files that make up the styling of the code block. You can find them in the repo — copy the contents from the relevant files and paste them into the correct file of your project's static folder. Don't forget to run `./manage.py collectstatic` afterwards.

## Image block (a work in progress...)

Next, I wanted to be able to insert images between my paragraphs of text whenever I wanted. I tried a few different approaches to rendering my `PicBlock` in the template, but no matter what, I kept getting the error below:

```python
ValueError: 
    image tag expected an Image object, 
    got StructValue([('image', None), ('caption', '')])
```

There's `Image` and `AbstractImage` in the Wagtail source code, which you'd think would be the first port of call in creating an instance, but it wasn't super self-explanatory, I was just exasperated at this point, and Google was not very much help. Neither were the hours spent trawling GitHub for similar repositories and looking at other people's identical code.

Then I had an idea: what about adding images via markdown? Sure, I dislike messing around with markdown and the whole idea behind me moving my blog from Jekyll to Wagtail was so I didn't have to do that anymore (I far prefer a WYSIWYG editor), but at least I'd easily be able to insert and style an image in the middle of a post.

I followed a bit of this [AccordBox tutorial](https://www.accordbox.com/blog/wagtail-tutorials-8-add-markdown-support/), which I found otherwise very useful (even if I'd recommend looking at the repo for the most up-to-date code, which deviates from the tutorial), as this is where I encountered about template tags and hooks for the first time. However, these were for pure markdown pages, which I didn't want. I also experimented with [`wagtailmarkdownblock`](https://github.com/FlipperPA/wagtailmarkdownblock), but that was a pain to set up too. It just all seemed like a lot of work for someone was only maybe going to sometimes use images in their posts.

So, at the brink of despair, I settled for a solution that is a bit dirty, but nonetheless, it works: raw HTML.

## HTML block

The cool thing is you don't need a template for this block as you do with others. Yes, really. This is what I added to my `blocks.py`:

```python
class HTMLBlock(blocks.RawHTMLBlock): 
    html = RawHTMLBlock() 
    
    class Meta: 
        icon = "wagtail-inverse" 
        verbose_name = "HTML"
```

Icon choice is completely optional, of course. You can choose from a list of them [here](https://thegrouchy.dev/general/2015/12/06/wagtail-streamfield-icons.html).

‌Even though it's an easy fix, there are several caveats to this raw HTML method:

* -- You have to remember to style it the exact same way every time you upload an image, e.g. padding, so it's not a hair's breadth away from the text.

* -- If, like me, your site is running on a remote server our image needs to be hosted. My site is running on a remote server so as far as I can tell, I can't really just make a relative import from an assets folder. Fellow millennials, do you remember Photobucket? (It's [still around](https://app.photobucket.com/explore), by the way.) I've been using [Cloudinary](https://cloudinary.com/), which also boasts services that go way beyond traditional image hosting.

* -- Security. Since this is a blog purely for myself — I'm the sole admin and editor — I can do what I want with it. But if someone with editor permissions has malicious intent, they could inject raw HTML, so this method may be less advisable.

## Rendering your blocks in the template

We've only done half the work so far — now we need to tell Django how to render it.

I created a couple of custom `Page` models to suit my needs: `StreamBlogPage` and `StreamTextPage`. These follow essentially the same templates as `BlogPage` and `TextPage`; the only difference is the addition of a for-loop for each block type with an approximation of how it should be rendered on the frontend.

```html
{% with blocks=self.contents %} 

  {% for block in blocks %} 

    <!-- ParaBlock --> 
    {% if block.block_type == "paragraph" %} 
      <div class="para-block"> 
        {{ block.value }} 
      </div> 

    <!-- PicBlock --> 
    {% elif block.block_type == "image" %} 
      {% image block.value width-900 class="img-responsive" %} 
    
    <!-- theoretically for any other block, 
    but in this case, for HTMLBlock --> 
    {% else %}
      <div class="block-{{ block.block_type }}"> 
        {{ block }} 
      </div> 
    {% endif %} 
    
  {% endfor %} 
  
{% endwith %}
```

## Conclusion

For now, this works for me. I intend to improve my `PicBlock` someday, but frankly, my priorities lie elsewhere right now. In practice, I barely use images in my blog posts anyway, and I really have other things I want to learn that are more pertinent to being better at my day job. That being said, I do wish that creating actual different types of `StreamBlock` was better documented by Wagtail so that `StreamFields` could reach more people, especially those just starting out with programming.
