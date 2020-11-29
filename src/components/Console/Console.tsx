import React, { useState } from 'react';

import '../../styles/Console.scss';

// Styles are switched between
const styles = {
    container: {
        display: 'inlineBlock',
        cursor: 'pointer',
    }, 
    consoleWrapper: {
        margin: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        height: 45,
        width: 200,
        backgroundColor: 'rgba(226, 226, 226, 0.363)',
        borderRadius: 3,
        opacity: 0.9,
        transition: '2s'
    },
    openConsole: {
        margin: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        height: '95vh',
        width: 500,
        backgroundColor: 'rgba(226, 226, 226, 0.363)',
        borderRadius: 3,
        opacity: 0.9,
        transition: '2s'
    },
    button: {
        height: 45
    }, 
}

const Console = (props: { setSelectedVis: any }) => {
    const [selected, setSelected] = useState<string>('default');
    const [isOpen,     setIsOpen] = useState<boolean>(false);

    const update = (e: any) => {
        setSelected(e.currentTarget.value);
        props.setSelectedVis(e.currentTarget.value);
    }

    const openConsole = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div style={isOpen ? styles.openConsole : styles.consoleWrapper}>
            <div className='container' 
                 style={styles.container} 
                 onClick={() => openConsole()}>
                {
                   isOpen ? (
                       <div>
                           <div className='change-bar1'></div>
                           <div className='change-bar2'></div>
                           <div className='change-bar3'></div>
                       </div>
                   ) : (
                        <div>
                            <div className='bar1'></div>
                            <div className='bar2'></div>
                            <div className='bar3'></div>
                        </div>
                   )
                }
                
            </div>
            <select style={styles.button} value={selected} onChange={(e) => update(e)}>
                <option value='default'>Box</option>
                <option value='torus'>Torus</option>
                <option value='mandelbulb'>Mandelbulb</option>
                <option value='mandelbrot'>Mandelbrot</option>
            </select>
        </div>
    )
}

export default Console;