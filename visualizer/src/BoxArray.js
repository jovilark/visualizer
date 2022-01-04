import Box from "./Box.js";
import { useRef, useState, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";

function BoxArray(props) {
    const ref = useRef();
    const boxes = []

    var count = 0;
    const total = 64;
    const mag = .01;
    for (var x = -4; x < 4; x++) {
        for (var z = -4; z < 4; z++) {
            const c = `hsl(${(Math.floor((100/total)*count))}, 100%, 50%)`
            boxes.push(
            <Box 
            scale={props.scales ? props.scales[count] ? props.scales[count]*mag : 1 : 1}
            position={[x*2, 0, z*2]}
            color={c}
            />)
            count += 1
        }
    }

    return (
        <>
            {boxes}
        </>
    )
}

export default BoxArray;