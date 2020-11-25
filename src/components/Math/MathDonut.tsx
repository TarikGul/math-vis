import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

const MathDonut = (props: { active: boolean }) => {
    let intervalId: any;

    let A: number = 1;
    let B: number = 1;

    const R1: number = 1, 
          R2: number = 2, 
          K1: number = 150, 
          K2: number = 7;

    // Geometry buffer ref
    const geoRef = useRef<any>();
    // Request animation ref
    const reqRef = useRef<any>();
    // Points ref
    const poiRef = useRef<any>();
    // Context ref 
    const ctxRef = useRef<HTMLHeadingElement | null>(null);
    // Scene ref
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    // Camera ref
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    // Renderer ref
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true })
    );

    const [isOpened, setIsOpened] = useState<boolean>(false)

    useEffect(() => {
        if (props.active) {
            setIsOpened(true)
            initViewport();
        } else {
            cancelVis();
        }
    }, [props.active]);

    const calculateTorus = () => {
        // positions for the buffer
        const positions: number[] = [];
        const colors   :    any[] = [];
        const color = new THREE.Color();

        const n = 1000, n2 = n / 2;

        let cA = Math.cos(A), sA = Math.sin(A),
            cB = Math.cos(B), sB = Math.sin(B);


        for (let j = 0; j < 6.28; j += 0.2) {
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

    const initViewport = () => {
        let camera: any = camRef.current, 
            scene: any = sceRef.current, 
            renderer: any = renRef.current, 
            points: any, 
            drawCount: any;

        // let A: number = 1;
        // let B: number = 1;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xC4C4C4);
        // scene.fog = new THREE.Fog(0x050505, 2000, 3500);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        const geometry = new THREE.BufferGeometry();

        const torus = calculateTorus();
        const positions = torus[0];
        const colors = torus[1];

        // We initialize the first set of points and Alphas for the positions
        // We then update the points every animationFrame with updated lighting and points
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });

        geometry.center()

        geoRef.current = geometry;

        points = new THREE.Points(geometry, material);

        points.frustumCulled = false;
        poiRef.current = points;
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        let animate = function () {
            requestAnimationFrame(animate);
            render()
        };

        function render() {
            A += 0.007;
            B += 0.003;

            const result = calculateTorus();
            const newPositions = result[0];
            const newColors = result[1];
            
            // geometry.deleteAttribute('position');
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3));

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        })
    }

    const cancelVis = () => {
        if (isOpened) {
            // Stop requestAnimationFrame
            cancelAnimationFrame(reqRef.current);

            // Garbage Collection
            disposeHierarchy(sceRef.current, disposeNode);

            // Renderer cleanup
            renRef.current.dispose();

            // Remove scene
            sceRef.current.remove(poiRef.current)

            // Retrieve HtmlCollection of canvas's
            let canvas = document.getElementsByTagName('CANVAS')

            // Remove all canvas elements
            for(let i = 0; i < canvas.length; i++) {
                canvas[0].remove();
            }

            setIsOpened(false);
        }
    }

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default MathDonut;