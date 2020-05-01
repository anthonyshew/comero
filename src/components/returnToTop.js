import React, { useRef } from 'react'
import useScrollPosition from "../hooks/useScrollPosition"

import Arrow from "../svg/arrow-right.svg"

const ReturnToTop = () => {
    const element = useRef(null)
    const scroll = useScrollPosition()

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
            <div
                className={`return-to-top${scroll.y > 0 ? " in" : ""}`}
                onClick={handleClick}
                onKeyPress={handleKeyPress}
                tabIndex={0}
                role="button"
                ref={element}
            >
                <Arrow style={{ transform: "rotate(-90deg)" }} />
            </div>
        )
    }

    return null
}

export default ReturnToTop