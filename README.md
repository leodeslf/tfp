# Texturas Fractales y Procedurales

or Fractal and Procedural Textures.

## Table of Contents

- [About](#About)
- [How it works](#How-It-Works)
- [Credits](#Credits)

## About

```txt
   _____________ _____________ _____________
  /\            \\            \\            \
  \ \____    ____\\     _______\\     ____   \
   \/___/\   \___/ \    \_____ / \    \___\   \
        \ \   \   \ \     ____\ \ \     _______\
         \ \   \   \ \    \___/  \ \    \______/
          \ \___\   \ \____\      \ \____\
           \/___/    \/____/       \/____/

```

TFP is a web application, generates custom Perlin and Worley Noise images on HTMLs Canvas API.

Features:

- **Perlin Noise** (1D, 2D and 3D)
- **Worley Noise** (2D ~~and 3D~~)

## How it works

It makes use of his own libraries that holds each algorithm.

Basic structure:

```JavaScript
const WORLEY = {
    st(spots, pos) { },            // First closest
    nd(spots, pos) { },            // Second closest
    ndMinusSt(spots, pos) { },     // Second closest (minus first)
    manhattan(spots, pos) { },     // First closest (Manhattan metrics)
    chebyshev(spots, pos) { }      // First closest (Chebyshev metrics)
    /*
    minkowski(spots, pos, e) { }   // First closest (Chebyshev metrics)
    */
}

const PERLIN = {
    noise1D(x) { },
    noise2D(x, y) { },
    noise3D(x, y, z) { }
}
```

## Credits

- TFP: **[Leonardo de S.L.F](https://github.com/Wikarot "GitHub profile")**
- Perlin Noise: **Ken Perlin**
- Worley Noise: **Steven Worley**

## License

Texturas Fractales y Procedurales CC BY-NC 2018 by Leonardo de S.L.F.
