import React from 'react';
import styled from 'styled-components';

const StyledRect = styled.rect`
    fill: ${props => {
        if (props.shouldAnimate) return '#b88c4d'
        else if (props.selected) return '#d91e1e'
        else return '#664618'
    }};

    transition: 0.8s ease-out;

    &&:hover {
        fill: #d91e1e;
    }
`

function Branch({ x, y, branchClicked, index, width, height, angle, color, selected, shouldAnimate }) {

    return (
        <StyledRect
            fill={`hsl(${color}, 55 %, 40 %)`}
            shouldAnimate={shouldAnimate}
            // opacity='0'
            selected={selected}
            x={x}
            y={y}
            width={width}
            height={height}
            transform={`rotate(${180 - angle}, ${x}, ${y})`}
            onClick={() => branchClicked(index)}
        />
    )
}

export default Branch;