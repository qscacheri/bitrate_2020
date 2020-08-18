import React from 'react';
import styled from 'styled-components';

const StyledRect = styled.rect`
    /* fill: ${props => `rgb(${props.color}, 100, 100)`}; */
    &&:hover{
        fill: blue
    }
`

function Branch({ x, y, width, height, angle, color }) {

    return (
        <StyledRect
            fill={`hsl(${color}, 55%, 40%)`}
            // opacity='0'
            x={x}
            y={y}
            width={width}
            height={height}
            transform={`rotate(${180 - angle}, ${x}, ${y})`}
        />
    )
}

export default Branch;