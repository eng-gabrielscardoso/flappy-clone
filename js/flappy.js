function newElement(tagName, className)
{
    const el = document.createElement(tagName)
    el.className = className
    return el 
}

function Bar(reverse = false)
{
    this.el = newElement('div', 'bar')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')

    this.el.appendChild(reverse ? body : border)
    this.el.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

function ParBars(height, gap, x_axis)
{
    this.el = newElement('div', 'par-bars')

    this.over = new Bar(true)
    this.under = new Bar(false)

    this.el.appendChild(this.over.el)
    this.el.appendChild(this.under.el)

    this.drawGap= () => {
        const overHeight = Math.random() * (height - gap)
        const underHeight = height - gap - overHeight
        this.over.setHeight(overHeight)
        this.under.setHeight(underHeight)
    }

    this.getXAxis = () => parseInt(this.el.style.left.split('px')[0])
    this.setXAxis = x_axis => this.el.style.left = `${x_axis}px`
    this.getWidth = () => this.el.clientWidth

    this.drawGap()
    this.setXAxis(x_axis)
}

function Bars(height, width, gap, interval, notifyPoint)
{
    this.pars = [
        new ParBars(height, gap, width),
        new ParBars(height, gap, width + interval),
        new ParBars(height, gap, width + interval * 2),
        new ParBars(height, gap, width + interval * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pars.forEach(par => {
            par.setXAxis((par.getXAxis()) - displacement)
            if(par.getXAxis() < -par.getWidth()){
                par.setXAxis(par.getXAxis() + interval * this.pars.length)
                par.drawGap()
            }

            const middle = width / 2
            const crossMiddle = par.getXAxis() + displacement >= middle 
                && par.getXAxis() < middle
            crossMiddle && notifyPoint()
        })
    }
}

function Bird(heightPlay)
{
    let flying = false
    
    this.el = newElement ('img', 'bird')
    this.el.src = './assets/bird.png'

    this.getYAxis = () => parseInt(this.el.style.bottom.split('px')[0])
    this.setYAxis = y => this.el.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.ontouchstart = e => flying = true
    window.onkeyup = e => flying = false
    window.ontouchend = e => flying = false

    this.animate = () => {
        const newYAxis = this.getYAxis() + (flying ? 5 : -5)
        const maxHeight = heightPlay - this.el.clientHeight

        if(newYAxis <= 0){
            this.setYAxis(0)
        } else if (newYAxis >= maxHeight){
            this.setYAxis(maxHeight)
        } else {
            this.setYAxis(newYAxis)
        }
    }

    this.setYAxis(heightPlay / 2)
}

function Progress() 
{
    this.el = newElement('span', 'progress')
    this.updatePoints = points => {
        this.el.innerHTML = points
    }

    this.updatePoints(0)
}

function areOverlapping(elA, elB)
{
    const a = elA.getBoundingClientRect()
    const b = elB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    
    return horizontal && vertical
}

function Colision(bird, bars)
{
    let collided = false

    bars.pars.forEach(par => {
        if(!collided){
            const over = par.over.el
            const under = par.under.el

            collided = areOverlapping(bird.el, over)
                || areOverlapping(bird.el, under)
        }
    })

    return collided
}

function Flappy() 
{
    let points = 0

    const areaPlay = document.querySelector('[area-game]')
    const height = areaPlay.clientHeight
    const width = areaPlay.clientWidth

    const progress = new Progress() 
    const bars = new Bars(height, width, 250, 400,
        () => progress.updatePoints(++points))
    const bird = new Bird(height)

    areaPlay.appendChild(progress.el)
    areaPlay.appendChild(bird.el)
    bars.pars.forEach(par => areaPlay.appendChild(par.el))

    this.start = () => {
        const timer = setInterval(() => {
            bars.animate()
            bird.animate()

            if(Colision(bird, bars)){
                clearInterval(timer)
            }
        }, 20)
    }
}

const flappy = new Flappy()
flappy.start()