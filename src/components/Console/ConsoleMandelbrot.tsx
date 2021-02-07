import React from 'react';

import 'katex/dist/katex.min.css';

// No types currently set for react-katex
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';

/** @type {{search: React.CSSProperties}} */

interface Styles {
    function: React.CSSProperties;
    italic: React.CSSProperties;
}
const styles: Styles = {
    function: {
        textAlign: 'center',
        margin: 15,
        backgroundColor: 'rgb(255, 239, 239)',
        overflow: 'hidden'
    },
    italic: {
        margin: 5
    }
}

const ConsoleMandelbrot = () => {
    
    return (
        <div className='console-math-container' style={styles.function}>
            <p>The Mandelbrot set is the set of complex numbers <i>c</i> for which the function</p> 
            <InlineMath >f_c(c)=z^2+c</InlineMath>
            <p>does not diverge when iterated from <InlineMath>z=0</InlineMath>, i.e., for which the sequence</p>
            <InlineMath >f_c(0),f_c(f_c(0))</InlineMath>
            <i style={styles.italic}>-Wikipedia</i>
            <p>
                What makes a Mandelbrot set so cool and unique is as you zoom in it gets infinitely 
                more complicated, and has this fine recursive characteristic to it. Making it a well known fractal-curve.
            </p>
            <p>
                Unfortuneately it is not wise to test the average CPU's lifespan by rendering an 
                infinite zoom Mandelbrot set on the every day persons browser, rapidly decreasing that number. So here's a static version.
            </p>
            <p>
                Now lets get to the good stuff!
            </p>
            <p>
                In order to represent the Mandelbrot visually we need to find each point 
                <i> c</i> of a part of the complex plane, if <InlineMath>Z_n</InlineMath> is bounded. 
            </p>
            <p>
                If the modulus of <InlineMath>Z_n</InlineMath> is greater than two, then it is not part of the 
                Mandelbrot set
            </p>
        </div>
    )
}

export default ConsoleMandelbrot;