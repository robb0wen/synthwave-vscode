# SynthWave '84 - VS Code theme
![Synthwave '84 logo over a cityscape](./banner.png)

Do you remember that endless summer back in '84? Cruising down the ocean-highway with the top down, the wind in our hair and heads buzzing with neon dreams? 

No, I don't remember it either, but with this experimental theme we can go there. 

__As of v0.1.0, no external extensions are needed to activate the glow effect!__ 

![Neon glowing text](./theme.jpg)

This colour scheme is influenced by the music and the cover artwork of modern Synthwave bands like FM-84, Timecop 1983 and The Midnight. By association, that means I've also taken heavy influence from the excellent [retro-tinged artwork of James White](https://signalnoise.com/) (check out his work, it's awesome).

## But...why?
I was a kid in the 80s but for most of my teenage life I strongly disliked nearly everything about the 80s aesthetic of my childhood. It was like, _so lame_. With the hindsight of recent years though, I've realised that it was actually pretty sweet and I wanted to celebrate it a little. 

Much the same way, in the modern web-development world of shaders, React and WebGL, I feel like it's easy to forget that the basics are actually pretty damn good. To that end, this theme goes back to basics - No Shader magic. No cloud-streamed WebGL render-farms. Just plain CSS :)

## Installation
To begin with, [install the base theme from the VS Marketplace](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode). This is the way Synthwave '84 is intended to be used day-to-day. If you want to enable the gratuitous 80s glow, it needs a little extra work to get it going. 

VS code doesn't natively support text effects and as a result, the glow is experimental. It's likely to be buggy and, whilst it looks rad, it isn't intended for extended use. Enabling the glow requires that the extension modifies the internal electron-app of VS Code, so use with caution.

If you do decide use the glow effect, you do so at your own risk. Bring your Sunglasses. Here be (laser)dragons.

### To enable the glow
As of v0.1.0, external extensions are no longer needed to active the glow. Open your command palette with `Ctrl + Shift + P` or `Shift + ⌘ + P` and choose "__Enable Neon Dreams__". It will prompt you to restart, and when you do the lights should be on :)

### To customise the glow brightness
In your `settings.json` add the key:
```
"synthwave84.brightness": "0.45"
```
The value should be a _float value_ from 0 to 1, where 00 is fully transparent. The default brightness is 0.45. To avoid eye strain, avoid using higher brightness values for extended periods of time.

## Updates
Every time you update VS code, you will need to repeat this step to re-enable the glow.

## Disabling the glow and uninstallation
The glow effect started as a joke and was never intended for long-term coding sessions. If you want to turn it off, you can disable it at any time by opening your command palette with `Ctrl + Shift + P` or `Shift + ⌘ + P` and choose "__Disable Neon Dreams__".

### Font
I haven't included a font in this release as I know that it's a very personal preference. The font I use (that is seen in the image above) is [Fira Code](https://github.com/tonsky/FiraCode), which I recommend if you're a fan of ligatures.

## Compatibility
This theme is **very much a work in progress**. I primarily develop in HTML & CSS, JS, React and Elixir so, whilst those language sets should look pretty good, there will likely be issues for other languages. I'll work on adding more support as I go. If you find anything glaringly wrong, raise an issue and I'll try to fix it as soon as I can.

## Contributing
I'm really happy to consider any contributions to this theme. Before you make any changes, [please read the contribution guide](https://github.com/robb0wen/synthwave-vscode/blob/master/CONTRIBUTING.md).

## Thanks
Lastly, I couldn't have made this if it weren't for the fantastic work of [Sarah Drasner](https://twitter.com/sarah_edo). Her [tutorial on theming for CSS tricks](https://css-tricks.com/creating-a-vs-code-theme/) was a huge help in developing this 🙏

Similarly, I'd like to thanks [Wes Bos](https://twitter.com/wesbos) for his [cool Cobalt2 theme](https://github.com/wesbos/cobalt2-vscode). His readme helped me figure out how to package this hot mess for public use 👍

If this theme is too much, then I recommend [Horizon](https://github.com/jolaleye/horizon-theme-vscode), or [City Lights](http://citylights.xyz/) for a similar, yet more understated, retro vibe. They're both beautiful.

Banner cityscape image from [Unsplash](https://unsplash.com/photos/DxHR8K5Egjk)
