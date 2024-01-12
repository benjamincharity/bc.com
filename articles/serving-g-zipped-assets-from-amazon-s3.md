---
title: Serving gZipped Assets from Amazon S3
description: A tutorial on how to correctly set up Amazon S3 to serve gZipped, static assets.
tags: [s3, hosting]
published: true
publishDate: 2014-01-21
previousUrl: https://blog.benjamincharity.com/serving-gzipped-assets-from-amazon-s3/
---

# Serving gZipped Assets From Amazon S3

Back in 2011 I decided to try hosting my personal website on [Amazon S3][aws]. The thought of never dealing with
shared hosting (my personal site doesn't have enough going on to warrant spinning up a server) again while serving
all my files from a giant <abbr title="Content Delivery Network">CDN</abbr> was extremely attractive.

The process of moving a static website from a shared host (I believe I was on JustHost at the time) to a CDN is not
even worth writing about. As long as your website is not reliant on a server, the switch is simple. However, as I
was looking into fine-tuning the performance of my site I quickly ran into a wall.

## The gzip mystery

![Fred Jones ready to unmask a villain](assets/blog/unmasking.jpg)

This was before many of the new tools like [Yeoman][yeoman] or [GruntJS][grunt] ever crossed my path, so my method
was to gzip from the command line and FTP the files to my S3 bucket. However, no matter what I tried I simply saw
this _super useful_ error:

```bash
Uncaught SyntaxError: Unexpected token ILLEGAL
```

After much Googling I still had no answers. No matter, I thought, I'll head over to one of my favorite
error-resolving resources, [StackOverflow][so].

Fail.

No questions or answers seemed to be addressing my issue. No one else? Really? Alright, I thought, I'll just post a
question!

{crickets}

Over a year my question sat there, all alone, unanswered and frightened. Apparently, back then there was not one
other person deploying their entire site to S3. Or maybe just no one that cared about optimization. <sup>[1]</sup>

## The gzip answer

![Fred Jones solves the case](assets/blog/unmasked.jpg)

Come to find out, it was all about the content-encoding. The tricky part is that **while Amazon offers handy dropdowns
with values for both `content-type` and `content-encoding`, the options we need are not in the lists by default.** So
it comes across as though those options are not valid. But, we are rebels and don't care. (Honestly I am amazed that
these options have not been added after all this time.)

Head to your bucket and highlight your gzipped file and click on the 'Properties' tab. Then expand the metadata section.

![Open the metadata section](assets/blog/metadata.jpg)

If you don't see these three options, just click the 'Add more metadata' button and select the missing ones. Now,
for the value of `content-type` input `text/css`, `text/js` or `text/html` to match the type of gzipped file you
have. Next we need the `content-encoding` key. Add the value `gzip`.

That's it! Your files should now load correctly and happiness will flow over the earth.

##### References

[1]: Yeah, I know this is probably not true. But I was frustrated, so let me be dramatic. [Original StackOverflow
Question][so-question]

[aws]: https://aws.amazon.com/s3/
[grunt]: https://gruntjs.com/
[yeoman]: https://yeoman.io/
[so]: https://stackoverflow.com
[so-question]: https://stackoverflow.com/questions/8080824/how-to-serve-gzipped-assets-from-amazon-s3/15117310#15117310
