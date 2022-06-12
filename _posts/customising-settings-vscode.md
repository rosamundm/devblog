---
title: 'Customising settings in VSCode'
excerpt: 'VSCode is a popular IDE, largely because it''s user-friendly and highly customisable. Here''s how to make it work for you.'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2021-12-17T00:00:00.322Z'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

I'm cooking up quite a few lengthier drafts at the moment, but today here's a quick post. If you're a VSCode user, did you know you can customise your settings in the `settings.json` file? Here's mine:

```json
{
    "workbench.colorTheme": "Shades of Purple",
    "window.zoomLevel": 2,
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.defaultProfile.osx": "bash",
    "workbench.editor.enablePreview": false,
    "workbench.editor.enablePreviewFromQuickOpen": false
}
```

## Here's a run-through:

* -- Shades of Purple is a gorgeous theme and this is an easy way to set it!
* -- My personal preference for window zoom level
* -- My personal preference for terminal font size
* -- Bash > zsh 🤷🏼‍♀️
* -- Make sure that when I open a new file, it doesn't replace one that was already open, which is so annoying. I recently learnt that many times in VSCode, a file is not actually open; it's just its preview. More on that <a href="https://www.nicoespeon.com/en/2020/01/change-vscode-preview-files/">here</a>
* -- See above.

On my work computer, I'm still using a combo of PyCharm and VSCode. The latter doesn't yet save branch workspaces, so if I'm switching between a lot of branches, I rely on PyCharm so I don't lose open files. If VSCode implemented that feature though... *swoon*. I'd ditch PyCharm in an instant.
