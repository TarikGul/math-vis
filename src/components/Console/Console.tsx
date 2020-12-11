import React, { useState } from 'react';
import ConsoleMandelbrot from './ConsoleMandelbrot';

import '../../styles/Console.scss';

const styles = {
    menuIconContainer: {
        display: 'inlineBlock',
        cursor: 'pointer',
    }, 
    consoleWrapper: {
        margin: 15,
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
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
        flexDirection: 'column',
        // justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        height: 'auto',
        maxHeight: '95vh',
        width: 500,
        backgroundColor: 'rgba(226, 226, 226, 0.363)',
        borderRadius: 3,
        opacity: 1.0,
        transition: '2s'
    },
    headerBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        height: 45,
        margin: '0 0 0 0',
    }, 
}

const Console = (props: { setSelectedVis: any }) => {

    // Stores the selected state locally, before dispatching it 
    const [selected, setSelected] = useState<string>('default');
    // State for checking whether the console is open or not
    const [isOpen,     setIsOpen] = useState<boolean>(false);

    const update = (e: any) => {
        setSelected(e.currentTarget.value);
        props.setSelectedVis(e.currentTarget.value);
    }

    const openConsole = () => {
        setIsOpen(!isOpen);
    }

    const consoleDetail = (mathType: string) => {
        switch(mathType) {
            case 'mandelbrot':
                return <ConsoleMandelbrot />
            default:
                
        }
    }

    return (
        <div style={isOpen ? styles.openConsole : styles.consoleWrapper}>
            <div style={styles.headerBar}>
                <div className='container' 
                    style={styles.menuIconContainer} 
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
            {/* This is going to be the Main container for the Math info, and refernces */}
            <div className='info-container'>
                {
                    isOpen ? (
                        consoleDetail(selected)
                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}

export default Console;