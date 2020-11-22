import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const Viewport = () => {

    const ctxRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        initViewport();
    }, []);

    const initViewport = () => {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
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

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default Viewport;