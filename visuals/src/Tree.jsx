import React, { useCallback } from 'react';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Branch from './Branch';
import * as d3 from 'd3';
import Leaves from './Leaves';
import Sequencer from './Sequencer';
import * as Tone from 'tone'

const Container = styled.div`
    width: 100%;
    height: 100vh;
    /* background: linear-gradient(0deg, rgba(255,170,0,0.7547969016708246) 0%, rgba(255,235,18,0.7491946607744661) 25%, rgba(230,145,146,0.7547969016708246) 75%, rgba(230,188,217,0.7463935403262867) 100%); */
    position: absolute;
    top: 0;
    left: 0;
`

function Tree() {
    const ref = useRef();
    const groupRef = useRef()
    const [branches, setBranches] = useState();
    const pendingRecursive = useRef(0);
    const [zoom, setZoom] = useState({ k: 1, x: 0, y: 0 })
    const [leaves, setLeaves] = useState();
    const [noteArray, setNoteArray] = useState(new Array(64))
    const [animatedNote, setAnimatedNote] = useState(-1)

    const onNotePlayed = (note) => {
        setAnimatedNote(note)
        // console.log(note);
    }
    const [sequencer] = useState(new Sequencer(onNotePlayed))
    // gets position of the next branch to be drawn
    const getNextPosition = (x, y, length, angle) => {
        const degToRad = (deg) => {
            return (deg + 90) * (Math.PI / 180)
        }

        return { x: x + Math.cos(degToRad(angle)) * length, y: y - Math.sin(degToRad(angle)) * length }
    }

    const scale = d3.scaleLinear()
        .domain([0, 1])
        .range([10, 25])

    const angleScale = d3.scaleLinear()
        .domain([0, 1])
        .range([10, 45])


    const generateTree = (x, y, width, height, angle, branchesArray = []) => {
        if (width < 8 || height < 50) {
            return;
        }
        branchesArray.push({ x, y, width, height, angle, color: 35 });
        const newHeight = height -= scale(Math.random());
        const newWidth = width -= 3
        const newPosition = getNextPosition(x, y, height, angle)

        pendingRecursive.current += 1
        generateTree(newPosition.x - (width - newWidth) / 2, newPosition.y, newWidth, newHeight, angle - angleScale(Math.random()), branchesArray);
        pendingRecursive.current--;


        pendingRecursive.current += 1
        generateTree(newPosition.x - (width - newWidth) / 2, newPosition.y, newWidth, newHeight, angle + angleScale(Math.random()), branchesArray);
        pendingRecursive.current--

        if (pendingRecursive.current == 1) {
            setBranches(branchesArray)
        }
    }

    const generateLeaves = (xPos, yPos, leavesArray = []) => {
        const { x, y, width, height } = groupRef.current.getBoundingClientRect();
        for (let i = 0; i < 100; i++) {
            xPos = x + Math.random() * width;
            yPos = y + Math.random() * height;
            leavesArray.push({ x: xPos, y: yPos });
        }
        setLeaves(leavesArray);

    }

    // generates tree
    useEffect(() => {
        const newArray = noteArray
        newArray.fill(false)
        setNoteArray(newArray)

        const { width, height } = ref.current.getBoundingClientRect();
        const x = width / 2;
        const y = height;
        pendingRecursive.current = 1
        generateTree(x, y - 50, 25, 200, 0);

    }, [])

    // generates leaves
    useEffect(() => {
        if (!branches) return
        const { width } = ref.current.getBoundingClientRect();
        const x = width / 2;
        const y = 0;
        generateLeaves(x, y);
    }, [branches])

    // positions and scales so tree fits in screen
    useEffect(() => {
        if (!branches) return
        const bounds = groupRef.current.getBoundingClientRect(),
            dx = bounds.width,
            dy = bounds.height,
            x = (bounds.x + dx) / 2,
            y = (bounds.y + dy) / 2,
            scale = 0.9 / Math.max(dx / window.innerWidth, (dy / window.innerHeight)),
            translate = [window.innerWidth / 2 - scale * x, window.innerHeight / 2 - scale * y];

        setZoom({ k: scale, x: translate[0], y: translate[1] })
    }, [branches])


    const branchClicked = (index) => {
        Tone.context.resume()
        const newArray = noteArray.map((value, i) => i === index ? !value : value)
        sequencer.setNoteArray(newArray);
        setNoteArray(newArray)
    }

    return (
        <Container>
            <Leaves style={{ zIndex: 0, position: 'absolute', width: window.innerWidth, height: window.innerHeight }} />
            <svg style={{ position: 'relative', zIndex: 1, width: window.innerWidth, height: window.innerHeight, background: 'none' }} ref={ref}>
                <g ref={groupRef} transform={`translate(${[zoom.x, zoom.y]}) scale(${zoom.k})`}>
                    {branches && branches.map((branch, i) => <Branch key={i} branchClicked={branchClicked} selected={noteArray[i]} index={i} {...branch} shouldAnimate={i === animatedNote} />)}
                </g>
            </svg>
            <Leaves style={{ zIndex: 2, position: 'absolute', left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }} />
        </Container>
    )
}

export default Tree;