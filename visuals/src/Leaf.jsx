import React from 'react';
import styled from 'styled-components';

function Leaf({ x, y }) {
    const radius = Math.random() * 10;

    return (
        <circle fill='#7ebd9c' cx={x} cy={y} r={radius} opacity='.5'></circle>
    )
}

export default Leaf;