export function PlayerAttributes() {
  const defaults = {
    position: {
      x: 0,
      y: 0
    },
    size: {width: 50, height: 50}
  }

  return {
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
        position: defaults.position,
        size: defaults.size
      },
      duration: 100, // time in ms
      isAttacking: false
    },
    characterAcceleration: 0.3,
    jumpForce: 10,
    weight: 70,
    size: defaults.size,
    color: 'green',
  }
}

export function EnemyAttributes() {
  const defaults = {
    position: {
      x: 250,
      y: 0
    },
    size: {width: 50, height: 50}
  }

  return {
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
        position: defaults.position,
        size: defaults.size
      },
      duration: 100, // time in ms
      isAttacking: false
    },
    characterAcceleration: 0.3,
    jumpForce: 10,
    weight: 70,
    size: defaults.size,
    color: 'red',
  }
}
