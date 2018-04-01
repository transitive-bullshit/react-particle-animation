# react-particle-animation ([demo](https://transitive-bullshit.github.io/react-particle-animation/))

> ✨ Canvas-based particle animation for React.

[![NPM](https://img.shields.io/npm/v/react-particle-animation.svg)](https://www.npmjs.com/package/react-particle-animation) [![Build Status](https://travis-ci.org/transitive-bullshit/react-particle-animation.svg?branch=master)](https://travis-ci.org/transitive-bullshit/react-particle-animation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-particle-animation
# or
yarn add react-particle-animation
```

## Usage

Check out the [demo](https://transitive-bullshit.github.io/react-particle-animation/) in the [example folder](https://github.com/transitive-bullshit/react-particle-animation/tree/master/example).

```jsx
import React, { Component } from 'react'

import ParticleAnimation from 'react-particle-animation'

class Example extends Component {
  render () {
    return (
      <ParticleAnimation />
    )
  }
}
```

## Props

| Property      | Type               | Default                               | Description                                                                                                                                  |
|:--------------|:-------------------|:--------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| `numParticles`  | number           | 400                                  | Number of particles to use. |
| `interactive`   | boolean          | true                                 | Whether or not animation responds to mouse hover. |
| `color`         | object           | { r: 158, g: 217, b: 249, a: 255 }   | Base rgba particle color. |
| `background`    | object           | { r: 255, g: 255, b: 255, a: 255 }   | Background rgba color. |
| `lineWidth`     | number           | 1.0                                  | Connecting line width. |
| `particleRadius`| number           | 1.0                                  | Scaling factor for particle radii. |
| `particleSpeed` | number           | 1.0                                  | Scaling factor for particle speed. |
| `...`           | ...              | undefined                            | Any other props are applied to the root canvas element. |

Note that for colors, `rgba` are all floating point numbers between 0 and 255 (inclusive).

Note that the canvas size will automatically be inferred based on available space via [react-sizeme](https://github.com/ctrlplusb/react-sizeme), so it should be really easy to use this component as a fullscreen background as in the [demo](https://transitive-bullshit.github.io/react-particle-animation/).

## Related

- [particles.js](https://github.com/VincentGarreau/particles.js) - Older particle animation. Oddly enough, I developed this animation in Java back in 2008, though the two animations are AFAIK unrelated to each other.
- [Intersection.Aggregate](http://www.complexification.net/gallery/machines/interAggregate/index.php) - Jared Tarbell's original processing work from 2004 which this animation was inspired by (e.g., visualizing the intersections between circles moving about randomly).

## License

MIT © [transitive-bullshit](https://github.com/transitive-bullshit)

This module was bootstrapped with [create-react-library](https://github.com/transitive-bullshit/create-react-library).
