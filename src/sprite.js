import {Physics} from './physics.js'

export default function Sprite({canvas, context, attributes, enemy}) {
  // Variables
  let acceleration = {x: 0, y: 0}
  let isStopping = false
  let isJumping = false
  let jumpCount = 0
  let keys = {left: false, right: false, up: false, down: false}
  let lastDirection = 'right'
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
      lastDirection = 'left'
    } else if (keys.right && !keys.left) {
      acceleration.x = characterAcceleration
      lastDirection = 'right'
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
  }

  function updateAttackBoxPosition() {
    function attackLeft (){
      attack.attackBox.position = {x: position.x - width, y: position.y}
    }

    function attackRight (){
      attack.attackBox.position = {x: position.x + width, y: position.y}
    }

    if (keys.left && !keys.right) {
      attackLeft()
    } else if (keys.right && !keys.left) {
      attackRight()
    } else if (lastDirection){
      switch (lastDirection){
        case 'left': attackLeft()
          break;
        case 'right': attackRight()
          break;
      }
    }
  }

  function detectAttack({rectangle1, rectangle2}) {
    if (!rectangle2) return

    const xIntersect = rectangle1.attack.attackBox.position.x + rectangle1.attack.attackBox.size.width >= rectangle2.attributes.position.x
      && rectangle1.attack.attackBox.position.x <= rectangle2.attributes.position.x + rectangle2.attributes.size.width
    const yIntersect = rectangle1.attack.attackBox.position.y + rectangle1.attack.attackBox.size.height >= rectangle2.attributes.position.y
      && rectangle1.attack.attackBox.position.y <= rectangle2.attributes.position.y + rectangle2.attributes.size.height

    const isAttackCollision = xIntersect && yIntersect && attack.isAttacking

    if (isAttackCollision) {
      attack.isAttacking = false
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
      if (attack.isAttacking) {
        context.fillStyle = 'blue'
        context.fillRect(
          attack.attackBox.position.x,
          attack.attackBox.position.y,
          attack.attackBox.size.width,
          attack.attackBox.size.height
        )
      }

    },
    update() {
      this.draw()
      updateAttackBoxPosition()
      detectAttack({rectangle1: this.attributes, rectangle2: this.enemy})
      jump()
      updatePosition()
    },
    attack() {
      console.log('ek moer jou')
      attack.isAttacking = true

      setTimeout(() => {
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
