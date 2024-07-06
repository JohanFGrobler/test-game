export default function Physics() {
  return {
    gravity: 0.2,
    friction: 0.9,
    playerAttributes: {
      speed: {
        base: 0,
        max: 4
      },
      acceleration: 0.3,
      jumpForce: 10,
      weight: 70
    }
  }
}
