# Texturas Fractales y Procedurales

## About

TFP is an app that generates custom Perlin and Worley Noise images.

Features:

- **Perlin Noise** (1D, 2D and 3D)
- **Worley Noise** (2D ~~and 3D~~)

## How it works

It makes use of his own libraries that holds each algorithm.

Basic structure:

```JavaScript
const PERLIN = {
    noise1D(x) { },
    noise2D(x, y) { },
    noise3D(x, y, z) { }
}

const WORLEY = {
    st(spots, pos) { },            // First closest
    nd(spots, pos) { },            // Second closest
    ndMinusSt(spots, pos) { },     // Second closest (minus first)
    manhattan(spots, pos) { },     // First closest (Manhattan metrics)
    chebyshev(spots, pos) { }      // First closest (Chebyshev metrics)
    // minkowski(spots, pos, e) { }   // First closest (Chebyshev metrics) [unused]
}
```

## Credits

- Perlin Noise: **Ken Perlin**
- Worley Noise: **Steven Worley**

## License

Texturas Fractales y Procedurales (TFP) CC BY-NC 2018 by [Leonardo de S.L.F](https://github.com/Wikarot "GitHub profile").
