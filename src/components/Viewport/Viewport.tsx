import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

import MathDonut from '../Math/MathDonut';

const Viewport = () => {
    // What Math Object are we going to Visualize
    const [visObject, setVisObject] = useState('');

    const ctxRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        initViewport();
    }, []);

    const defaultBackground = () => {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        })
       
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }

    const initViewport = () => {
        // if (visObject === '') {
        //     defaultBackground();
        // }
    }

    return (
        // <div ref={ctxRef}>
        <div>
            <MathDonut />
        </div>
    )
}

export default Viewport;