import React, { useState, useEffect } from 'react'
import '../styles/Fade.css'

function Fade({ show, isAbsolute, children, style, speed, fadeStyle }) {

    const [isRender, setIsRender] = useState(show);

    useEffect(() => {
        if (show) setIsRender(true);
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) setIsRender(false);
    };

    function getStyle() {
        let obj = {};
        if (fadeStyle === 'down') {
            obj = {
                animation: `${show ? 'fadeDown' : 'fadeUp'} 
                forwards ${speed ? speed : 1}s ease-in-out`,
            }
        }
        else if (fadeStyle === 'scale') {
            obj = {
                animation: `${show ? 'scaleUp' : 'scaleDown'} 
                forwards ${speed ? speed : 1}s ease-in-out`,
            }
        }
        else {
            obj = {
                animation: `${show ? 'fadeIn' : 'fadeOut'} 
                    forwards ${speed ? speed : 1}s ease-in-out`,
            }
        }
        return Object.assign(obj, style);
    }

    return (
        isRender && (
            <div style={
                getStyle()
            }
                onAnimationEnd={onAnimationEnd} className={isAbsolute ? 'absolute' : ''}>
                {children}
            </div>
        )
    )
}

export default Fade;