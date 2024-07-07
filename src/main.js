import Sprite from './sprite.js'
import {EnemyAttributes, PlayerAttributes} from './attributes.js'

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')

  // Temp
  let direction

  // Sprites
  const enemy = Sprite({
    canvas,
    context,
    attributes: EnemyAttributes()
  })
  const player = Sprite({
    canvas,
    context,
    attributes: PlayerAttributes(),
    enemy
  })

  // Functions
  function init() {
    if (!canvas) {
      console.error('Canvas element not found')
      return
    }

    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.margin = '0'
    canvas.style.padding = '0'
    canvas.style.overflow = 'hidden'
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const style = document.createElement('style')
    style.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        overflow: hidden;
        height: 100%;
        width: 100%;
      }
      canvas {
        display: block;
      }
    `

    // cursor: none;
    document.head.appendChild(style)
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    context.scale(dpr, dpr)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    player.draw()
    enemy.draw()
  }

  function animate() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    enemy.enemy = player
    player.update()
    enemy.update()

    requestAnimationFrame(animate)
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
        player.move('left', true)
        break
      case 'ArrowRight':
      case 'd':
        player.move('right', true)
        break
      case 'ArrowUp':
      case 'w':
        player.move('up', true)
        break
      case 'ArrowDown':
      case 's':
        player.move('down', true)
        break
      case ' ':
        // Dash
        break
    }
  }

  function handleKeyUp(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
        player.move('left', false)
        break
      case 'ArrowRight':
      case 'd':
        player.move('right', false)
        break
      case 'ArrowUp':
      case 'w':
        player.move('up', false)
        break
      case 'ArrowDown':
      case 's':
        player.move('down', false)
        break
    }
  }

  function handleMouseDown(event) {
    if (!event) return

    player.attack()
  }

  // Do stuff
  init()
  resizeCanvas()
  animate()


  setInterval(() => {
    enemy.attack()
  }, 3000)

  // setInterval(() => {
  //   enemy.move(direction, true)
  //
  //   setTimeout(() => {
  //     enemy.move(direction, false)
  //     direction = direction === 'left' ? 'right' : 'left'
  //   }, 200)
  // }, 1000)

  // Event listeners
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('keyup', handleKeyUp)
})
