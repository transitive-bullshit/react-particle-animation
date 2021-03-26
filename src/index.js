/**
 * @class ParticleAnimation
 *
 * TODO: speed-up via basic spacial-acceleration data structure
 * @date:  December 2008 (Java)
 * @port:  August 2012 to processing.js
 * @port:  April 2018 to react and canvas
 *
 * Original concept by Casey Reas (http://reas.com/)
 *
 * A surface filled with 100 medium to small sized circles.
 * Each circle has a different size and direction, but moves
 * at the same slow rate. Display:
 *  A. The instantaneous intersections of the circles.
 *  B. The aggregate intersections of the circles.
 *
 * @see http://www.complexification.net/gallery/machines/interAggregate/index.php
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import sizeMe from 'react-sizeme'
import raf from 'raf'

import Circle from './circle'

const noop = () => {}

class ParticleAnimation extends PureComponent {
  static propTypes = {
    numParticles: PropTypes.number,
    lineWidth: PropTypes.number,
    particleRadius: PropTypes.number,
    particleSpeed: PropTypes.number,
    interactive: PropTypes.bool,
    color: PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
      a: PropTypes.number
    }),
    background: PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
      a: PropTypes.number
    }),
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }).isRequired,
    style: PropTypes.object
  }

  static defaultProps = {
    numParticles: 400,
    lineWidth: 1.0,
    particleRadius: 1.0,
    particleSpeed: 1.0,
    interactive: true,
    color: {
      r: 158,
      g: 217,
      b: 249,
      a: 255
    },
    background: {
      r: 255,
      g: 255,
      b: 255,
      a: 255
    },
    style: {}
  }

  _canvas = React.createRef()

  componentWillMount() {
    this._reset(this.props)
  }

  componentDidMount() {
    this._tick()
  }

  componentWillUnmount() {
    raf.cancel(this._tickRaf)
  }

  componentWillReceiveProps(props) {
    this._reset(props, this.props)
  }

  render() {
    const {
      numParticles,
      interactive,
      particleRadius,
      particleSpeed,
      size,
      color,
      background,
      lineWidth,
      style,
      ...rest
    } = this.props

    return (
      <div
        style={{
          overflow: 'hidden',
          ...style
        }}
        {...rest}
      >
        <canvas
          ref={this._canvas}
          width={size.width}
          height={size.height}
          onMouseOver={interactive ? this._onMouseOver : noop}
          onMouseOut={interactive ? this._onMouseOut : noop}
          onMouseMove={interactive ? this._onMouseMove : noop}
        />
      </div>
    )
  }

  _tick = () => {
    this._update()
    this._draw()

    this._tickRaf = raf(this._tick)
  }

  _update() {
    const { interactive } = this.props

    for (let i = 0; i < this._particles.length; ++i) {
      this._particles[i].update()
    }

    if (interactive) {
      for (let i = 0; i < this._mouseParticles.length; ++i) {
        this._mouseParticles[i].update()
      }
    }
  }

  _draw() {
    const { interactive, lineWidth, background, color, size } = this.props

    if (!this._canvas) return
    const canvas = this._canvas.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // clear background
    ctx.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`
    ctx.fillRect(0, 0, size.width, size.height)

    ctx.lineWidth = lineWidth

    let particles = this._particles

    if (interactive && this._mouseX && this._mouseY) {
      particles = [].concat(this._particles)

      const minR = Math.min(size.width, size.height)
      const xRadius = minR / 5
      const yRadius = minR / 5

      for (let i = 0; i < this._mouseParticles.length; ++i) {
        const p = this._mouseParticles[i]
        particles.push(
          new Circle({
            x: this._mouseX + (p.x / size.width - 0.5) * xRadius,
            y: this._mouseY + (p.y / size.height - 0.5) * yRadius,
            radius: p.radius,
            width: p.width,
            height: p.height
          })
        )
      }
    }

    for (let i = 0; i < particles.length; ++i) {
      const pi = particles[i]

      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
        (color.a / 255.0) * 0.1
      })`
      ctx.beginPath()
      ctx.ellipse(pi.x, pi.y, pi.radius / 10, pi.radius / 10, 0, 0, 2 * Math.PI)
      ctx.fill()

      for (let j = i + 1; j < particles.length; ++j) {
        const pj = particles[j]

        if (pi.intersects(pj)) {
          const dist = Math.sqrt(
            (pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y)
          )
          const d = Math.max(0, Math.min(1, dist / 100.0))
          const a = 20 * d + 150 * (1.0 - d)

          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
            (color.a * a) / (255.0 * 255.0)
          })`
          ctx.beginPath()
          ctx.moveTo(pi.x, pi.y)
          ctx.lineTo(pj.x, pj.y)
          ctx.stroke()
        }
      }
    }
  }

  _reset(props, old) {
    const { numParticles } = props

    const numMouseParticles = Math.max(5, Math.min(50, numParticles / 25)) | 0

    this._particles = this._resetParticles(this._particles || [], props, old)
    this._mouseParticles = this._resetParticles(
      this._mouseParticles || [],
      {
        ...props,
        numParticles: numMouseParticles
      },
      old
    )
  }

  _resetParticles(particles, props, old) {
    const { numParticles, size, particleRadius, particleSpeed } = props

    const createParticle = () =>
      new Circle({
        x: Math.random() * size.width,
        y: Math.random() * size.height,
        radius: (10 + Math.random() * 60) * particleRadius,
        width: size.width,
        height: size.height,
        speed: 0.5 * particleSpeed
      })

    if (old) {
      let max = numParticles

      if (numParticles > particles.length) {
        max = particles.length

        const diff = numParticles - particles.length
        for (let i = 0; i < diff; ++i) {
          particles.push(createParticle())
        }
      } else {
        particles = particles.slice(0, numParticles)
      }

      for (let i = 0; i < max; ++i) {
        const p = particles[i]
        p.x = (p.x * size.width) / old.size.width
        p.y = (p.y * size.height) / old.size.height
        p.radius = (p.radius * particleRadius) / old.particleRadius
        p.radiusSquared = p.radius * p.radius
        p.width = size.width
        p.height = size.height
        p.dX = (p.dX * particleSpeed) / old.particleSpeed
        p.dY = (p.dY * particleSpeed) / old.particleSpeed
      }
    } else {
      for (let i = 0; i < numParticles; ++i) {
        particles.push(createParticle())
      }
    }

    return particles
  }

  _onMouseOver = (event) => {
    const { offsetX, offsetY } = event.nativeEvent

    this._mouseX = offsetX
    this._mouseY = offsetY
  }

  _onMouseOut = (event) => {
    this._mouseX = undefined
    this._mouseY = undefined
  }

  _onMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent

    this._mouseX = offsetX
    this._mouseY = offsetY
  }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(
  ParticleAnimation
)
