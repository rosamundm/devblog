---
title: 'Review: PyCharm'
excerpt: 'How does PyCharm fare as an integrated development environment? Here''s my hot take.'
date: '2021-02-12T00:00:00.322Z'
---

I've used a few different code editors, but when I started working as a developer, I was curious about trying out an IDE for efficiency. I had heard a few things about PyCharm but for one reason or another, had never got around to checking it out. Okay, to be honest, two specific things initially put me off it:

* -- Its unattractive interface.

* -- The name of its manufacturer, JetBrains, grosses me out. Still, according to their Twitter bio, they are the world's leading vendor of professional development tools, so more fool me.

My employer was paying for the licence, though, so I decided to give it a go. I know I haven't discovered the full gamut of PyCharm's features just yet, but here are some things I like about it so far:

## Easy navigation with keyboard shortcuts (subject to German Mac keyboard)

If you press <code>Cmd+L</code>, you can type in the line number you're looking for into the prompt so you don't have to go scrolling up and down for it. If you hold down <code>Cmd</code> while hovering over a class instance and then click on it, it will take you back to the declaration of that class. And if you're looking for the declaration of a class called <code>CoolModelIWrote</code>, for example, you can type in "cmiw"; (i.e. the first initials) and it will come up. All very useful features for OOP, and just a fraction of the PyCharm shortcuts available!

## Integrated Django support

Note that this comes only with the paid PyCharm licence. You can configure the Django support feature to do quite a few things, including conversion of function-based views to class-based files, automatically generating template files, and running standard <code>manage.py</code> tasks in a separate console.

## Integrated Git support

You can manage branches via the UI rather than typing Git commands into the terminal, which is handy for when you're switching between a lot of tickets. I've recently realised that local branches that have since been merged can form a backlog very quickly, so it is nice to be able to just right-click the branch name and get rid of it right away. Not only that, but switching branches via the UI also means you're switching workspaces, so you don't lose all your open files.

## Extensions

PyCharm offers a plethora of extra plugins and features. One of the latest of these is <a href="https://www.jetbrains.com/help/idea/code-with-me.html">Code With Me</a>, which is excellent for pair programming; I've used it a couple of times at work. PyCharm also seems to be a popular choice for people working with the Python data science stack, as it supports visualisation and analysis and can manage Conda environments.

One disadvantage of PyCharm that struck me almost immediately was its slow speed and resource-heaviness. Yes, it is powerful, but it lags, and drains the machine very quickly. At work, I use a high-end laptop and I really don't get why it is so noisy. Sometimes it takes a few seconds for code changes to update in the editor, or even for it to show the current Git branch after checking out, which could be potentially disastrous, but luckily I now always double-check before proceeding.

Despite these shortcomings, I plan to continue using PyCharm at my job. I've since customised a layout that I find acceptable, and the features listed above are a good incentive to keep using it. I work with two displays, the left one being the external monitor, which shows PyCharm, and the right one being my laptop itself for "everything else". Pretty often, I have VS Code open on my laptop for certain use cases. For example, I just find the global search on there a lot friendlier. As my main tool at home, I'm still using VS Code with a Python extension and it's great. I find it a lot more intuitive and attractive, and my personal laptop also has less memory so I'm not gonna burden it with a bulky program like PyCharm.

If you're a beginner, frankly, I believe that PyCharm would be overkill, and it might be more beneficial to use more language-agnostic software (such as VS Code). The thing to remember is that while a lot of people in this industry are weirdly opinionated about their tools, you only have to use what's right for you. By all means, try stuff out, but don't feel pressured into sticking with something you hate!
