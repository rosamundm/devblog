---
title: 'Setting up pre-commit hooks'
excerpt: 'Keep a clean, standardised codebase and save time by setting up pre-commit hooks for your project.'
date: '2021-10-05T00:00:00.322Z'
---

Although I'd come across pre-commit hooks in my previous job, I never really thought I'd be dealing with them myself. My own side projects are too small, I figured, to really necessitate it, plus I always assumed I'd join a company where someone else had already taken care of that.

Well, at my current organisation I am now doing everything from the ground up and making some key decisions. This means I'm suddenly learning a lot about infrastructure, tooling, and defining developer standards.
You can think of the remote repository as the nightclub, your code as the clubber, and the pre-commit hooks as the bouncer. Code that is not stylistically up to scratch should not make it to the remote.

Git actually comes with a few out-of-the-box hooks of its own. Go into the `.git` folder inside your project's root directory. (It's a hidden file, so you may need to use `Shift + Cmd + .` to see it if you're using the Mac Finder.) There should be a folder called `hooks`, which contains all the hooks that Git comes with. You can read more about each of those here, but for now, we are interested in getting our custom hooks running.

The cool thing about using Python's `pre-commit package` is we don't actually need to faff around writing any special scripts. After installing the [package](https://github.com/pre-commit), create a new file in your project's root directory called `.pre-commit-config.yaml` and fill it with information about the various hooks you want to use. A lot of these tools can be found on the [Python Code Quality Authority](https://github.com/PyCQA) (PCQA) page.

This is what I'm starting off with:

```yaml
repos: 
  - repo: https://github.com/ambv/black 
    rev: 21.9b0 
    hooks: 
      - id: black 
        language_version: python3.6 
  - repo: https://github.com/pre-commit/pre-commit-hooks 
    rev: v4.0.1 
    hooks: 
      - id: check-merge-conflict 
      - id: end-of-file-fixer 
      - id: trailing-whitespace
```

But how do we actually get the hooks working?

Run `pre-commit install` and you should get a confirmation that they have been installed. You can always run `pre-commit autoupdate` to make sure the packages are at their latest version.

Now run `pre-commit run --all-files` to actually test out your new hooks! A pedant's dream! Now next time you commit something, you should be able to see the hooks in action.
