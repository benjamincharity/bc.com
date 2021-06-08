---
title: Git Commits Year In Review
description: Create a visual timeline of your year with automatic pictures taken after each commit.
tags: [git]
published: true
publishDate: 2014-12-30
previousUrl: https://blog.benjamincharity.com/git-commits-year-in-review/
---

# Git Commits: Year In Review

A few years ago I saw a post by someone where they created a video by capturing a picture from their webcam each day 
and then combined them together into a movie. I was struck by how interesting it was to watch small changes in a 
person over time. So I thought I would try to do something similar.

Unfortunately, I knew there was no way I could remember to take a picture every day. Even if I could, it would 
quickly become one more task to complete in my already packed days. I needed a way to automate the process.

A bit later I learned about [Git Hooks][6] and saw someone who used git hooks to take a webcam picture. (I 
unfortunately cannot remember where I first saw this, or I would credit them...)

## A git commits timeline

I created a post-commit git hook that would take a picture with the built-in webcam immediately after each commit. 
It's as simple as creating a file inside your project's `.git/hooks` directory named `post-commit`. Chances are, 
there are some samples already in that directory.

Inside the `post-commit` file paste this snippet:

```bash
#!/usr/bin/env ruby
file="~/Dropbox/gitshots/#{Time.now.to_i}.jpg"
puts "Taking capture into #{file}!"
system "imagesnap -q -w 3 #{file}"
exit 0
```

Lines 2, 3 and 4 are the ones we need to focus on.

Line #2 defines where the new image will be saved. I use a [Dropbox][1] folder for this which allows me to work from 
multiple machines and have all git shots saved together. The `#{Time.now.to_i}` bit creates a file name based on the 
current time. This makes sure that each file has a unique name and is easily kept in the correct order.

Line #3 prints a message to the console with the file name each time the script runs.

Line #4 takes the actual picture and saves it to the path and filename that was defined in line #2.

## Creating a movie or Gif.

If you want to create a movie or gif from your `gitshots`, you will need to install [ImageMagick][2]. ImageMagick is a 
powerful image editing and transformation tool that offers us some command line functionality.

If you are a [homebrew][3] user, simply brew install:

```bash
brew install imagemagick
```

Once the ImageMagick installation completes, navigate into your `gitshots` directory and run this command:

```bash
convert -quality 100 -delay 30 *.jpg _myGifName.gif
```

Or for a movie:

```bash
convert -quality 100 -delay 30 *.jpg _myMovieName.mp4
```

This will run a [conversion][4] with the quality set to 100 with a [delay of 30 ticks per second][5] between each 
image. Every JPG in the current directory will be used and the output file will be saved in the same directory with 
the name `_movie.mp4`.

**Note:** In my own tests the video always seems to have a render error about 4/5 of the way through. I've tried 
using fewer images or lowering the quality with no luck. If any of you know the reason, I'd love to know why!

## Automate the post-commit creation.

Copying our new `post-commit` file into every new repo will become tiresome very quickly. Luckily Git allows us to 
create templates that all new git repos will be initialized with.

Templates for git hooks live in `~/.git_template/hooks/`. Simply drop in your `post-commit` file and the next time 
`git init` is run in a directory, the git repo will include this post commit function.

## The finished product

Since the video creation wouldn't work, here is a sample Gif:

![Short example from my gitshot year in review](assets/blog/2014_gitshots.gif)


[1]: https://dropbox.com
[2]: https://www.imagemagick.org
[3]: https://brew.sh/
[4]: https://www.imagemagick.org/script/convert.php
[5]: https://www.imagemagick.org/script/command-line-options.php#delay
[6]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
