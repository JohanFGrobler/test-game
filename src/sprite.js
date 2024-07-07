import {Physics} from './physics.js'

export default function Sprite({canvas, context, attributes, enemy}) {
  // Variables
  let acceleration = {x: 0, y: 0}
  let isStopping = false
  let isJumping = false
  let jumpCount = 0
  let keys = {left: false, right: false, up: false, down: false}
  let {
    position,
    velocity,
    speed,
    characterAcceleration,
    jumpForce,
    weight,
    size,
    color,
    attack
  } = attributes

  // Constants
  const {gravity, friction} = Physics()
  const height = size?.height ?? 50
  const width = size?.width ?? 50
  const terminalVelocity = weight * gravity
  const maxJumps = 2

  function accelerate() {
    // Horizontal movement
    if (keys.left && !keys.right) {
      acceleration.x = -characterAcceleration
    } else if (keys.right && !keys.left) {
      acceleration.x = characterAcceleration
    } else {
      acceleration.x = 0
    }

    // Stop when no keys are pressed
    isStopping = !keys.left && !keys.right
  }

  function jump() {
    if (keys.up && !isJumping && jumpCount < maxJumps) {
      velocity.y = -jumpForce
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
    velocity.x = Math.max(-speed.max, Math.min(speed.max, velocity.x))

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

    // Update attack box position
    attack.attackBox.position = position

    detectAttackCollision()
  }

  function detectAttackCollision() {
    if (!enemy) return;

    const xIntersect = attack.attackBox.position.x + attack.attackBox.size.width >= enemy.attributes.position.x
      && attack.attackBox.position.x <= enemy.attributes.position.x  + enemy.attributes.size.width
    const yIntersect = attack.attackBox.position.y + attack.attackBox.size.height >= enemy.attributes.position.y
      && attack.attackBox.position.y <= enemy.attributes.position.y  + enemy.attributes.size.height

    const isAttackCollision = xIntersect && yIntersect && attack.isAttacking

    if (isAttackCollision) {
       console.log('eina!')
    }
  }

  return {
    attributes,
    enemy,
    draw() {
      // Player body
      context.fillStyle = color ?? 'red'
      context.fillRect(position.x, position.y, width, height)

      //Attack body
      context.fillStyle = 'blue'
      context.fillRect(
        attack.attackBox.position.x,
        attack.attackBox.position.y,
        attack.attackBox.size.width,
        attack.attackBox.size.height
      )
    },
    update() {
      this.draw()
      jump()
      updatePosition()
    },
    attack() {
      console.log('ek moer jou')
      attack.isAttacking = true

      setTimeout(() => {
        console.log('klaar gemoer')
        attack.isAttacking = false
      }, attack.duration)
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
