import React, { useState, useRef, useEffect } from 'react';
import p5 from 'p5';
import styled from 'styled-components';
const CanvasContainer = styled.div`
    pointer-events: none;
    canvas {
        pointer-events: none;
    }
`
function Leaves({ style }) {
    const ref = useRef()

    const setup = (p, parent) => {
        const { width, height } = parent.getBoundingClientRect()
        p.parent = parent
        p.createCanvas(width, height)

        p.colorMode(p.HSB, 360, 100, 100)
        p.noStroke()
        p.leafArray = []
        for (let i = 0; i < 75; i++) {
            p.leafArray.push(new Leaf(p.width - (p.width + 50), p.random(0, height / 2), p))
        }
    }

    const draw = (p) => {
        p.clear()
        // same as using a for loop through leafArray
        p.leafArray.map((leaf) => {
            leaf.draw(p)
        })
    }

    useEffect(() => {
        if (!ref.current) return
        const sketch = new p5((p) => {
            p.setup = () => setup(p, ref.current)
            p.draw = () => draw(p)
        }, ref.current) // attach the canvas to the Container div (important)
    }, [ref])

    return (
        <CanvasContainer style={style} ref={ref}></CanvasContainer>
    )
}

class Leaf {
    constructor(x, y, p) {
        this.x = x
        this.y = y
        this.reset(p)
    }

    draw(p) {
        if (!this.started) {
            this.started = Math.random() > .999
            return;
        }
        p.fill(this.color)
        p.push()
        p.translate(this.x, this.y)
        p.rotate(this.rotation)
        p.triangle(0, 0, this.point2.x, this.point2.y, this.point3.x, this.point3.y)

        // p.circle(this.x, this.y, this.radius)
        p.pop()
        this.x += this.xSpeed
        this.ySpeed = p.sin(this.counter) * p.random(0.1, 0.5);
        this.y += this.ySpeed;
        this.counter += 0.015;
        this.rotation += .01;

        // wrap around
        if (this.x > p.width + 50 || this.y > p.height - 150) {
            this.reset(p)
        }
    }
    reset(p) {
        this.x = -25;
        this.y = p.random(0, p.height / 2);
        this.xSpeed = p.random(0.5, 1.3)
        this.counter = p.random();
        this.ySpeed = 0;
        this.color = p.color(p.random(0, 50), 70, p.random(80, 100))
        this.rotation = p.random(0, Math.PI * 2)
        this.point2 = { x: p.random(10, 50), y: p.random(10, 50) }
        this.point3 = { x: p.random(10, 50), y: p.random(10, 50) }
        this.started = false

    }
}

export default Leaves