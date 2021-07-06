---
title: Generate Safe Text Colors with Sass
description: Learn how to dynamically generate a safe text color based on the background color with Sass.
tags: [sass, css]
published: true
publishDate: 2014-01-21
lastUpdatedDate: 2014-01-21
---

# Generate Safe Text Colors with Sass

One of my tasks at a previous job was to abstract out the process of theme creation for the company's product.

> **The Goal:** Give our users the most power _without_ dropping the kitchen sink in front of them.

Currently, there are 10 different colors that can be defined by a user (background/text/button/progress/etc). My
assertion is that the time it takes an average user to create a palette of ten colors that looks even passable, far
outweighs the benefit of such granular control. (Lord knows, you shouldn't have 10 completely different colors on one page)

> **The Idea:** Cut back user input to 3 colors and programmatically create logical ancillary colors.

_Colors defined by the user:_

```scss
$primary: #333;
$secondary: #fafafa;
$accent: blue;
```

<small>
**Note:** I will be using Sass throughout this article.
</small>

The first case I decided to tackle was our buttons. I needed to make sure that the button text was always easily
readable over the button's background color.

The first method that came to mind was to make use of the powerful [color functions within sass][colorfunctions].
Using the `darken()` function I could create a text color that is, say, 40 % darker than the original color quite easily:

```scss
$color: lightblue;

button {
  background-color: $color;
  color: darken($color, 60%);
}
```

Not too shabby. We've got a light blue background, and a nice dark text that still has a hint of blue.

### Wwwwomp.

I immediately ran into an issue. Because we have no restrictions on the original color (`lightblue` in our case) a
user could potentially set the base color to a dark color like black. Of course darkening our text color won't help
us at all in this instance.

This time we can make use of the Sass `lightness()` function. This will return the lightness value of the color (a
numerical value between 0-100). The function below tests for the lightness of the initial color and will lighten or
darken our text color depending on that value.

```scss
$lightness-bound: 70 !global;

@function checkLightness($color) {
  @if (lightness($color) > $lightness-bound) {
    @return darken($color, 60);
  } @else {
    @return lighten($color, 60);
  }
}
```

<small>**Note:** the `!global` declaration is new as of Sass 3.3. Simply remove this declaration if you are on an 
earlier version of Sass.</small>

### Wwwwomp #2.

What if the user sets the initial color to yellow? While true yellow is below our threshold for lightness (yellow 
comes in at 50% lightness), a lighter text will still be incredibly hard to read. Yes, we all hope they don't use 
bright yellow...but, we both know _someone_ will.

After trying color after color I came up with what I call [The Danger Zone][dangerzone] of the HSL color space.

![The danger zone of the HSL color space][hsl]

Lightness is defined on a vertical scale from 0 to 100 while Hue is defined on a horizontal scale from 0<sup>o</sup> 
to 360<sup>o</sup>.

We need to know when a color lands in this 'danger zone' and when it doesn't. When the initial color is within the 
danger zone we will darken the text color, and when the initial color is not in the danger zone we will lighten the 
text color.

```scss
$lightness-bound: 70 !global;
$hue-bound-bottom: 40 !global;
$hue-bound-top: 200 !global;

@function checkDangerZone($color) {
  @if (
    (lightness($color) > $lightness-bound) or
      (hue($color) > $hue-bound-bottom and hue($color) < $hue-bound-top)
  ) {
    @return darken(desaturate($color, 70), 60);
  } @else {
    @return lighten(desaturate($color, 50), 60);
  }
}
```

You will notice that I have also added the `desaturate()` function to this solution. This tones down the actual
color (yellow/red/etc) and allows our `darken()` and `lighten()` functions to move our text color closer to white or black. (I rarely see a use case for light red text on a dark red background.)

Play around with the final function in another [SassMeister Gist][finaltry].

---

There it is. A sass function that will return a safe text color for any background color.

For further learning check out [SassMe][sassme] to see the Sass functions I use in action.

[gist]: https://gist.github.com/benjamincharity/8531621.js
[colorfunctions]: https://sass-lang.com/documentation/Sass/Script/Functions.html
[firsttry]: https://sassmeister.com/gist/benjamincharity/8546697
[secondtry]: https://sassmeister.com/gist/benjamincharity/8531621
[finaltry]: https://sassmeister.com/gist/benjamincharity/8548185
[dangerzone]: https://youtu.be/RRU3I_o1vLc
[sassme]: https://sassme.arc90.com/
[hsl]: assets/blog/hsl.jpg
