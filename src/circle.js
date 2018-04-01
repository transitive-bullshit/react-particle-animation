/**
 * @class Circle
 */

export default class Circle {
  width
  height

  radius
  radiusSquared

  x
  y
  dX
  dY

  constructor({ x, y, radius, width, height, speed }) {
    this.x = x
    this.y = y

    this.width = width
    this.height = height

    this.radius = radius
    this.radiusSquared = radius * radius

    this.dX = 0.5 + Math.random()
    this.dX *= (Math.random() > 0.5 ? 1 : -1) * speed

    this.dY = 0.5 + Math.random()
    this.dY *= (Math.random() > 0.5 ? 1 : -1) * speed
  }

  update() {
    this.x += this.dX
    this.y += this.dY

    // wrap circle around the edge of the simulation
    if (this.x + this.radius < 0 && this.dX < 0) {
      this.x = this.width + this.radius
    } else if (this.x - this.radius >= this.width && this.dX > 0) {
      this.x = -this.radius
    }

    if (this.y + this.radius < 0 && this.dY < 0) {
      this.y = this.height + this.radius
    } else if (this.y - this.radius >= this.height && this.dY > 0) {
      this.y = -this.radius
    }
  }

  intersects(circle) {
    const xDif = circle.x - this.x
    const yDif = circle.y - this.y
    const d = Math.sqrt(xDif * xDif + yDif * yDif)

    // reject if distance btwn circles is greater than their radii combined
    if (d > this.radius + circle.radius) {
      return false
    }

    // reject if one circle is inside of the other
    return (d >= Math.abs(circle.radius - this.radius))
  }

  getIntersections(circle) {
    let xDif = circle.x - this.x
    let yDif = circle.y - this.y
    const dist2 = xDif * xDif + yDif * yDif
    const d = Math.sqrt(dist2)

    // reject if distance btwn circles is greater than their radii combined
    if (d > this.radius + circle.radius) {
      return null
    }

    // reject if one circle is inside of the other
    if (d < Math.abs(circle.radius - this.radius)) {
      return null
    }

    xDif /= d
    yDif /= d

    // distance from this circle to line cutting through intersections
    const a = (this.radiusSquared - circle.getRadiusSquared() + dist2) / (2 * d)

    // coordinates of midpoint of intersection
    const pX = this.x + a * xDif
    const pY = this.y + a * yDif

    // the distance from (x, y) to either of the intersection points
    const h = Math.sqrt(this.radiusSquared - a * a)

    // check if there's only one intersection
    if (h <= 0) {
      return [
        { x: pX, y: pY }
      ]
    }

    xDif *= h
    yDif *= h

    const x1 = (pX + yDif)
    const y1 = (pY - xDif)
    const x2 = (pX - yDif)
    const y2 = (pY + xDif)

    // there are (at least) two intersections
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 }
    ]
  }
}
