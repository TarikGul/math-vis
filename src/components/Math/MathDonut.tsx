import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const MathDonut = (props: { active: boolean }) => {

    const R1: number = 1, 
          R2: number = 2, 
          K1: number = 150, 
          K2: number = 7;

    const ctxRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (props.active) {
            initViewport();
        }
    }, [props.active]);

    const initViewport = () => {
        let camera: any, scene: any, renderer: any, points: any, drawCount: any;

        let A: number = 1;
        let B: number = 1;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xC4C4C4);
        // scene.fog = new THREE.Fog(0x050505, 2000, 3500);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        const geometry = new THREE.BufferGeometry();

        const calculateTorus = () => {
            // positions for the buffer
            const positions = [];
            const colors    = [];
            const color     = new THREE.Color();
    
            const n = 1000, n2 = n / 2;  
    
            let cA = Math.cos(A), sA = Math.sin(A),
                cB = Math.cos(B), sB = Math.sin(B);
    
    
            for (let j = 0; j < 6.28; j += 0.1) {
                let ct = Math.cos(j), st = Math.sin(j);
    
                for (let i = 0; i < 6.28; i += 0.03) {
                    let sp = Math.sin(i), cp = Math.cos(i);
                    let ox = R2 + R1 + ct,
                        oy = R1 * st;
                    
                    let x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB; // final 3D x coordinate
                    let y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB; // final 3D y
                    let z = (K2 + cA * ox * sp + sA * oy)
                    let L = 0.9 * (cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp));

                    // If we want to make the vertices colorful.
                    // But in this specific case we are not because we 
                    // want to capture correct lighting
                    const vx = (x / n) + 0.5;
                    const vy = (y / n) + 0.5;
                    const vz = (z / n) + 0.5;

                    positions.push(x, y, z);
                    // color.setRGB(vx, vy, L);
                    color.setRGB(255, 255, L);
                    color.setHSL(0, 0, L);

                    colors.push(color.r, color.g, color.b);
                }
            }

            return [positions, colors];
        }

        const torus = calculateTorus();
        const positions = torus[0];
        const colors = torus[1];

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });

        geometry.center()
        points = new THREE.Points(geometry, material);

        points.frustumCulled = false;
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        // renderer.render(scene, camera);

        let animate = function () {
            requestAnimationFrame(animate);
            render()
        };

        function render() {

            setInterval(function () {
                A += 0.0007;
                B += 0.0003;

                // geometry.deleteAttribute('position');
                const result = calculateTorus();
                const newPositions = result[0];
                const newColors = result[1];

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3));
            }, 50)

            renderer.render(scene, camera);

        }
        animate();

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