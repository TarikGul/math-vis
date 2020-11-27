# Welcome to this Math Visualizer

## Tech

- React
- Typescript
- Three.js

Why am I using React here? 

Really just because I want to practice more typescript with React, but also wanted to work on my math chops as I advance more and more into the Cryptographic Math world. But also because I wanted to show that you can use React along with heavy computational math, and visualize it while maintaining performance and integirty.

Im using three.js instead of plan WEBGL because of the readabiity and documentation with Three.js. Its a growing community, and I really like some of the tooling their API has to offer. That being said this is the first time im using it. 

Here are some gifs so far. The Torus is finished for the most part. I am having touble with the Mandelbulb, There is something wrong with my mathematically understanding of the mandelbulb so its just print a sphere with a concentration near the polar points specifcally the starting. But I was able to find really cool behaviors that I would never be able to understand without the visuals with where my high level mathematics is right now. 

![Torus](/Torus.gif)

![MandelBulb](/MandelBulb.gif)

## Setup

Clone the repository

Copy `tsconfig.json`

Delete `tsconfig.json`

run `yarn start`

paste old `tsconfig.json`

Unfortunately this is the only work around I know with the current CRA- Typescript bug. Currently is an issue with `typscript@4.0.3`

## Torus

TODO Need to post the math used for this, and the references I used

The first completed shape 

## Mandelbulb

Currently working on it. 

## Notes

All memory leaks associated with Three.js is taken care of. The last thing
That needs to get done in regards to the garbage collection is, before switching
visualizations i need to make a promise that will only render the next Object3D if
garbage collection is complete and finished, or else there will be a shader typeerror
that occurs. 
