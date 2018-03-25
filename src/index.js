const fieldHeight = 400
const fieldWidth = 500

class Platform {
  constructor() {
    this.x = 0
    this.y = (fieldHeight - Platform.height) / 2
  }

  draw(ctx) {
    ctx.fillStyle = Platform.color
    ctx.fillRect(
      this.x,
      this.y,
      Platform.width,
      Platform.height,
    )
  }
}

Platform.width = 10
Platform.height = 100
Platform.color = '#ff0000'
Platform.speed = 20


class Player extends Platform {
  movePlatformByEvent(e) {
    const modifier = 1
    switch(e.keyCode) {
      case 38: {
        if (this.y > 0) {
          this.y -= Platform.speed * modifier
        }
        break
      }
      case 40: {
        if (this.y < fieldHeight - Platform.height) {
          this.y += Platform.speed * modifier
        }
        break
      }
    }
  }
}


class Computer extends Platform {
  constructor() {
    super()
    this.x = fieldWidth - Platform.width
  }
}


class Boll {
  constructor() {
    this.setInitialProps()
  }

  setInitialProps(direction) {
    const directionKoef = (direction === 'right') ? 1 : -1
    this.x = fieldWidth / 2
    this.y = fieldHeight / 2
    this.angle = Math.random() * (Math.PI / 2) - Math.PI / 4
    Boll.speed = directionKoef * Math.abs(Boll.speed)
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(
      this.x,
      this.y,
      Boll.radius,
      0,
      2 * Math.PI,
      false
    )
    ctx.fillStyle = Boll.color
    ctx.fill()
  }
}

Boll.color = '#00ff00'
Boll.radius = 8
Boll.speed = 4


const core = (pong) => {
  const {
    boll,
    player,
    computer,
    score,
  } = pong

  if (
    (boll.y <= Boll.radius) ||
    (boll.y + Boll.radius >= fieldHeight)
  ) {
    Boll.speed = -Boll.speed
    boll.angle = Math.PI - boll.angle
    return
  }

  if (boll.x - Boll.radius < Platform.width) {
    if (
      (boll.y + (Boll.radius * 2) >= player.y) &&
      (boll.y - (Boll.radius * 2) <= player.y + Platform.height)
    ) {
      const shift = (player.y + (Platform.height / 2) - boll.y) / (Platform.height / 2)
      const shiftCoef = (shift / 2) + 0.5

      boll.angle = shiftCoef * (Math.PI / 2) - Math.PI / 4
      Boll.speed = -Boll.speed

      return
    }
  }


  // if (boll.y >= fieldHeight - Platform.height - Boll.radius) {
  //   if (
  //     (boll.x + (Boll.radius * 2) >= platform.x) &&
  //     (boll.x - (Boll.radius * 2) <= platform.x + Platform.width)
  //   ) {
  //     //boll.angle *= -1
  //     const shift = (platform.x + (Platform.width / 2) - boll.x) / (Platform.width / 2)
  //     const shiftCoef = (shift / 2) + 0.5
  //     boll.angle = -(shiftCoef * (Math.PI / 2) + Math.PI / 4)
  //     return
  //   }
  //
  //   // else if (boll.y >= fieldHeight - Boll.radius) {
  //   //   arkanoid.status = 'finish'
  //   //   arkanoid.finish()
  //   //   return
  //   // }
  // }

  if (boll.x <= Boll.radius) {
    score.computer += 1
    boll.setInitialProps('right')
    return
  }

  if (boll.x >= fieldWidth - Boll.radius) {
    score.player += 1
    boll.setInitialProps('left')
    return
  }

  // for (let tilesRow of tiles) {
  //   for (let tile of tilesRow) {
  //     if (!tile.isAlive) continue
  //     if (
  //       boll.x - Boll.radius <= tile.x + Tile.width &&
  //       boll.x + Boll.radius >= tile.x &&
  //       boll.y - Boll.radius <= tile.y + Tile.height &&
  //       boll.y + Boll.radius >= tile.y
  //     ) {
  //       tile.isAlive = false
  //       boll.angle *= -1
  //       return
  //     }
  //   }
  // }
}

const renderScore = (ctx, score) => {
  const {
    player,
    computer,
  } = score

  ctx.fillStyle = 'red'
  ctx.textAlign = 'center'
  ctx.font = '35px Comic Sans MS'
  ctx.fillText(`${player}:${computer}`, fieldWidth / 2, 50)
}


const requestAnimationFrame = window.requestAnimationFrame

const render = (ctx, pong) => {
  const {
    player,
    computer,
    boll,
    score,
  } = pong

  boll.y += (Boll.speed * Math.sin(boll.angle))
  boll.x += (Boll.speed * Math.cos(boll.angle))
  ctx.clearRect(0, 0, fieldWidth, fieldHeight)

  renderScore(ctx, score)
  player.draw(ctx)
  computer.draw(ctx)
  boll.draw(ctx)

  core(pong)

  requestAnimationFrame(() => render(ctx, pong))
}


window.onload = () => {
  const canvas = document.getElementById('field')
  const ctx = canvas.getContext('2d')

  const pong = {
    player: new Player(),
    computer: new Computer(),
    boll: new Boll(),
    score: {
      player: 0,
      computer: 0,
    },
  }

  console.log(pong)

  addEventListener(
    'keydown',
    pong.player.movePlatformByEvent.bind(pong.player)
  )
  render(ctx, pong)
}
