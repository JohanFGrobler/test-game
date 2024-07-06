import Physics from './physics.js'

export default function Sprite({canvas, context, position, velocity, size, color}) {
  // Constants
  const {gravity, playerAttributes, friction} = Physics()
  const height = size?.height ?? 50
  const width = size?.width ?? 50
  const terminalVelocity = playerAttributes.weight * gravity
  const maxJumps = 2

  // Variables
  let acceleration = {x: 0, y: 0}
  let isStopping = false
  let isJumping = false
  let jumpCount = 0
  let keys = {left: false, right: false, up: false, down: false}

  function accelerate() {
    // Horizontal movement
    if (keys.left && !keys.right) {
      acceleration.x = -playerAttributes.acceleration
    } else if (keys.right && !keys.left) {
      acceleration.x = playerAttributes.acceleration
    } else {
      acceleration.x = 0
    }

    // Stop when no keys are pressed
    isStopping = !keys.left && !keys.right
  }

  function jump() {
    if (keys.up && !isJumping && jumpCount < maxJumps) {
      velocity.y = -playerAttributes.jumpForce
      jumpCount++
      isJumping = true
    }
  }

  function updatePosition() {
    velocity.x += acceleration.x
    velocity.y += gravity

    // Cap the falling speed to terminal velocity
    if (velocity.y > terminalVelocity) {
      velocity.y = terminalVelocity
    }

    // Cap horizontal velocity
    velocity.x = Math.max(-playerAttributes.speed.max, Math.min(playerAttributes.speed.max, velocity.x))

    // Apply friction when stopping
    if (acceleration.x === 0) {
      velocity.x *= friction
      if (Math.abs(velocity.x) < 0.01) velocity.x = 0
    }

    position.x += velocity.x
    position.y += velocity.y

    // Boundary checks
    if (position.x + width > canvas.width) {
      position.x = canvas.width - width
      velocity.x = 0
    } else if (position.x < 0) {
      position.x = 0
      velocity.x = 0
    }

    if (position.y + height > canvas.height) {
      position.y = canvas.height - height
      velocity.y = 0
      isJumping = false
      jumpCount = 0 // Reset jump flag when landing
    } else if (position.y < 0) {
      position.y = 0
      velocity.y = 0
    }
  }

  return {
    velocity,
    draw() {
      context.fillStyle = color ?? 'red'
      context.fillRect(position.x, position.y, width, height)
    },
    update() {
      this.draw()
      jump()
      updatePosition()
    },
    move(direction, isPressed = true) {
      keys[direction] = isPressed

      // Stops jump spamming when holding down key
      if (direction === 'up' && !isPressed) {
        isJumping = false
      }

      accelerate()
    }
  }
}
