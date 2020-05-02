import React, { useRef } from 'react'
import useScrollPosition from "../hooks/useScrollPosition"

import Arrow from "../svg/arrow-right.svg"

const ReturnToTop = () => {
    const element = useRef(null)
    const scroll = useScrollPosition()

    const buttonStyles = {
        appearance: "none",
        position: "fixed",
        bottom: ".8rem",
        right: ".8rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: ".8rem",
        borderRadius: "100%",
        border: "none",
        backgroundColor: "rgba(1, 1, 1, .5)",
        cursor: "pointer",
    }

    const arrowStyles = {
        transform: "rotate(-90deg)",
        transition: ".5s",
    }

    if (typeof window !== "undefined") {

        const handleClick = () => {
            window.scrollTo(0, 0)
            element.current.blur()
        }

        const handleKeyPress = (e) => {
            if (e.key === "Enter") window.scrollTo(0, 0)
            document.querySelector("#scrollTopFocus").focus()
        }
        return (
            <button
                style={
                    scroll.y > 0 ? {
                        ...buttonStyles,
                        transition: ".5s",
                        width: "50px",
                        height: "50px",
                        opacity: 1,
                    } : {
                            ...buttonStyles,
                            transition: ".5s",
                            width: 0,
                            height: 0,
                            opacity: 0,
                        }
                }
                className={`return-to-top`}
                onClick={handleClick}
                onKeyPress={handleKeyPress}
                tabIndex={0}
                ref={element}
            >
                <Arrow style={scroll.y > 0 ? {
                    ...arrowStyles,
                    height: "20px",
                    width: "20px",
                    opacity: 1,
                } : {
                        ...arrowStyles,
                        height: 0,
                        width: 0,
                        opacity: 0,
                    }

                } />
            </button>
        )
    }

    return null
}

export default ReturnToTop