import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const MathDonut = () => {
    const [toggle, setToggle] = useState(true);

    const R1 = 1, R2 = 2, K1 = 150, K2 = 6;
    const [A, setA] = useState(1);
    const [B, setB] = useState(1);

    const ctxRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        initViewport();
    }, []);

    const initViewport = () => {
        let camera: any, scene: any, renderer: any, points: any;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505);
        scene.fog = new THREE.Fog(0x050505, 2000, 3500);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        const geometry = new THREE.BufferGeometry();

        // positions for the buffer
        const positions = [];
        const colors    = [];
        const color     = new THREE.Color();

        const n = 1000, n2 = n / 2;  

        let cA = Math.cos(A), sA = Math.sin(A),
            cB = Math.cos(B), sB = Math.sin(B);

        for (let j = 0; j < 6.28; j += 0.3) {
            let ct = Math.cos(j), st = Math.sin(j);

            for (let i = 0; i < 6.28; i += 0.1) {
                let sp = Math.sin(i), cp = Math.cos(i);
                let ox = R2 + R1 + ct,
                    oy = R1 * st;
                
                let x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB; // final 3D x coordinate
                let y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB; // final 3D y
                let z = (K2 + cA * ox * sp + sA * oy)
                let ooz = 1 / z; // one over z
                let xp = (150 + K1 * ooz * x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                let yp = (120 - K1 * ooz * y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                let L = 0.7 * (cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp));
                    const vx = (x / n) + 0.5;
                    const vy = (y / n) + 0.5;
                    const vz = (z / n) + 0.5;

                    positions.push(x, y, z);
                    color.setRGB(255, 255, L);
                    color.setHSL(0, 0, L);
                    // color.lerpHSL(color, L);

                    colors.push(color.r, color.g, color.b);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });

        points = new THREE.Points(geometry, material);
        scene.add(points);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        renderer.render(scene, camera);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        })
    }

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default MathDonut;