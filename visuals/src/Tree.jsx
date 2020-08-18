import React from 'react';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import Branch from './Branch';
import Leaf from './Leaf'

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background: #b0cbad;
`

function Tree() {
    const ref = useRef();
    const groupRef = useRef()
    const [numbers, setNumbers] = useState([5, 3, 7, 64, 255]);
    const [branches, setBranches] = useState();
    const pendingRecursive = useRef(0);
    const [branchCounter, setBranchCounter] = useState(0)
    const [zoom, setZoom] = useState({ k: 1, x: 0, y: 0 })
    const [leaves, setLeaves] = useState();

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
            console.log("done");
            setBranches(branchesArray)
        }
    }

    const generateLeaves = (x, y, leavesArray = []) => {
        for (let i = 0; i < 100; i++) {
            x = Math.random() * (window.innerWidth - (window.innerWidth / 2));
            y = Math.random() * (window.innerHeight - (window.innerHeight / 2));
            leavesArray.push({ x, y });
        }
        setLeaves(leavesArray);

    }

    // generates tree
    useEffect(() => {
        const { width, height } = ref.current.getBoundingClientRect();
        const x = width / 2;
        const y = height;
        pendingRecursive.current = 1
        generateTree(x, y - 100, 25, 200, 0);
    }, [])

    // generates leaves hopefully
    useEffect(() => {
        const { width } = ref.current.getBoundingClientRect();
        const x = width / 2;
        const y = 0;
        generateLeaves(x, y);
    }, [])

    // positions and scales so tree fits in screen
    useEffect(() => {
        if (!branches) return
        const bounds = groupRef.current.getBoundingClientRect(),
            dx = bounds.width,
            dy = bounds.height,
            x = (bounds.x + dx) / 2,
            y = (bounds.y + dy) / 2,
            scale = 0.9 / Math.max(dx / window.innerWidth, dy / window.innerHeight),
            translate = [window.innerWidth / 2 - scale * x, window.innerHeight / 2 - scale * y];

        setZoom({ k: scale, x: translate[0], y: translate[1] })
    }, [branches])


    return (
        <Container>
            <svg style={{ width: window.innerWidth, height: window.innerHeight }} ref={ref}>
                <g ref={groupRef} transform={`translate(${[zoom.x, zoom.y]}) scale(${zoom.k})`}>
                    {branches && branches.map((branch, i) => <Branch key={i} {...branch} />)}
                </g>
                <g>
                    {leaves && leaves.map((leaf, i) => <Leaf key={i} {...leaf} />)}
                </g>
            </svg>
        </Container>
    )
}

export default Tree;