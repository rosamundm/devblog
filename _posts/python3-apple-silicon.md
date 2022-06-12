---
title: 'Setting up Python3 on Apple Silicon'
excerpt: 'New technology is supposed to make our lives easier... but sometimes, you wish it wouldn''t bother. Don''t let Apple Silicon get in the way of you using Python!'
date: '2022-02-25T00:00:00.322Z'
---

I've started using an Apple Silicon computer at work. What does this mean? Well, basically that it's really fast; the M1 chip replaces the Intel processor, containing 16 processor cores in its own right, which are designed, among other things, to [handle the speed required for AI tasks](https://uk.pcmag.com/laptops/129888/what-is-the-apple-m1-chip).

However, there's a caveat to this advancement. Each computational instruction must now go through an additional compatibility layer, meaning it needs to be "translated" — the term is *emulated* — so the new architecture can read it. Apple has its own emulator called Rosetta, which emulates programs designed for Intel processors so they can be used on machines with Apple processors. As a result, some apps may not work anymore because they now need to interact with the emulator, not the processor itself.

When I tried creating a virtual environment for a small Python project with the native [venv](https://docs.python.org/3/library/venv.html) module, I got the error `Killed: 9` which is a bit alarming, no? I searched online and it seems this is actually a common problem for these new Macs. It can be solved with relatively little hassle, though.

Assuming you already have [Homebrew](https://brew.sh/) installed, if you run `brew install python@3.9`, you may get the following:

```python
Warning: python@3.9 3.9.10 is already installed, it's just not linked. 
To link this version, run: 
  brew link python@3.9
```

By running both `which python` and `which python3` in the terminal, you can see the location paths where your respective Python versions are installed. Reminder: Python2 (aka simply Python) is long deprecated by now, so you shouldn't be using it. Python3, however, should work perfectly well on these new Macs.

So, I ran `brew link python@3.9`, and got this:

```python
Error: Could not symlink bin/2to3 Target /usr/local/bin/2to3 already exists. 
You may want to remove it: rm '/usr/local/bin/2to3' 
To force the link and overwrite all conflicting files: 
  brew link --overwrite python@3.9 
To list all files that would be deleted: 
  brew link --overwrite --dry-run python@3.9
```

(A symlink, by the way, is literally a *symbolic link* — that is, a file pointing towards another file, serving as a shortcut.)

So I went ahead and ran `brew link --overwrite python@3.9` which created the symlinks. Run `which python3` again to confirm that the location has changed. You can then go ahead and create your virtual environment inside your directory with `python3 -m venv venv`

😎
