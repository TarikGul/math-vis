import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

const MathDonut = (props: { active: boolean }) => {

    let A: number = 1;
    let B: number = 1;

    let R1: number = 1, 
        R2: number = 2, 
        K1: number = 150, 
        K2: number = 7;

    // Used 
    let radiusCount     : number = 0;
    let radiusDirection : number = 1;

    // Request animation ref
    const reqRef = useRef<any>();
    // Scene ref
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    // Geometry buffer ref
    const geoRef = useRef<THREE.BufferGeometry | null>(null);
    // Context ref 
    const ctxRef = useRef<HTMLHeadingElement | null>(null);
    // Points ref
    const poiRef = useRef<THREE.Points | THREE.Object3D>(new THREE.Points());
    // Camera ref
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    // Renderer ref
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true })
    );

    const [isOpened, setIsOpened] = useState<boolean>(false);
    // Fun little idea to play around with
    const [breathingDonut, setIsBreathingDonut] = useState<boolean>(false);

    useEffect(() => {
        if (props.active) {
            setTimeout(() => {
                setIsOpened(true)
                initViewport();
            }, 500);
        } else {
            cancelVis();
        }
    }, [props.active]);

    const calculateTorus = () => {
        // positions for the buffer
        const positions: number[] = [];
        const colors   :    any[] = [];
        const color = new THREE.Color();

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
                let z = (K2 + cA * ox * sp + sA * oy)                 // final 3D z

                // Lumins for vertice (Alpha)
                let L = 0.9 * (cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp));

                positions.push(x, y, z);

                color.setRGB(255, 255, L);
                color.setHSL(0, 0, L);

                colors.push(color.r, color.g, color.b);
            }
        }

        return [positions, colors];
    }

    const initViewport = () => {
        /**
         * TYPES
         */
        let camera  : any = camRef.current, 
            scene   : any = sceRef.current, 
            renderer: any = renRef.current, 
            points  : any;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xB57C7C);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        // Init our buffer
        const geometry = new THREE.BufferGeometry();

        // Retrive the positions and colors for the Buffer
        const torus = calculateTorus();
        const positions = torus[0];
        const colors = torus[1];

        // We initialize the first set of points and Alphas for the positions
        // We then update the points every animationFrame with updated lighting and points
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();

        // Init Render Aesthetics
        const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });

        // Wrap up initializing geometrys and set ref
        geometry.center()
        geoRef.current = geometry;

        // Wrap up initializing points and set ref
        points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        poiRef.current = points;

        // Add Scene, Torus will only have one scene
        scene.add(points);

        // Init Renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create canvas
        document.body.appendChild(renderer.domElement);

        let animate = function () {
            reqRef.current = requestAnimationFrame(animate);
            render()
        };

        function render() {
            
            A += 0.007;
            B += 0.003;

            // The breathing donut
            if (breathingDonut) {
                if (radiusCount % 100 === 0) {
                    radiusDirection *= -1;
                }

                R1 += (radiusDirection * 0.01);
                R2 += (radiusDirection * 0.01);
                radiusCount += 1;
            }
            
            const result = calculateTorus();
            const newPositions = result[0];
            const newColors = result[1];
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3));

            renderer.render(scene, camera);
        }

        // Render the scene
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