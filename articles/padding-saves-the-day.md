---
title: Padding Saves the Day
description: Small design tweaks can positively affect how users feel on your site.
tags: [css]
published: true
publishDate: 2014-01-21
previousUrl: https://blog.benjamincharity.com/padding-saves-the-day/
---

# Padding Saves the Day

The idea behind this post is so small that I almost didn't write the article. But, after seeing this slight design
overlook for the umpteenth time, I decided, what the hell.

## Breathing Room

As an application's UI is designed and built out, we are often in our own special little silo. Whether that silo is
designing an app within the forgiving boundaries of a design document or developing within a fixed container
centered gently within the viewport.

Thought and effort go into designing the UI and then that beautiful UI gets jammed inside a frame with no room to
breathe inside smaller viewports.

![A website without padding](assets/blog/padding.jpg)

Simply adding padding to the primary container does the trick. In small websites I may use the `<body>` element, but
in applications I usually have an application 'container' element.

```css
.window {
  padding: 8px;
}
```

An incredibly easy fix to get your design looking [streets ahead][1] in smaller viewports.

![A website with padding](assets/blog/padding02.jpg)

[1]: https://youtu.be/rf1GSjo4zSY 'Streets ahead as defined by Pierce Hawthorne.'
