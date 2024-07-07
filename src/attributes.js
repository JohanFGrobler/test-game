export function PlayerAttributes() {
  const defaults = {
    position: {
      x: 0,
      y: 0
    },
    size: {width: 50, height: 50}
  }

  return {
    id: 'player',
    position: defaults.position,
    velocity: {
      x: 0,
      y: 0
    },
    speed: {
      base: 0,
      max: 4
    },
    attack: {
      attackBox: {
        position: {
          x: defaults.position.x + defaults.size.width
        },
        size: defaults.size
      },
      duration: 100, // time in ms
      isAttacking: false
    },
    characterAcceleration: 0.2,
    jumpForce: 10,
    weight: 70,
    size: defaults.size,
    color: 'green',
  }
}

export function EnemyAttributes() {
  const defaults = {
    position: {
      x: 500,
      y: 0
    },
    size: {width: 50, height: 50}
  }

  return {
    id: 'enemy',
    position: defaults.position,
    velocity: {
      x: 0,
      y: 0
    },
    speed: {
      base: 0,
      max: 4
    },
    attack: {
      attackBox: {
        position: {
          x: defaults.position.x + defaults.size.width
        },
        size: defaults.size
      },
      duration: 100, // time in ms
      isAttacking: false
    },
    characterAcceleration: 0.2,
    jumpForce: 10,
    weight: 70,
    size: defaults.size,
    color: 'red',
  }
}
