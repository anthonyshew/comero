
import { useState, useEffect } from 'react'

// Returns an object with two keys, x and y

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState({ x: window.pageXOffset, y: window.pageYOffset })

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition({ x: window.pageXOffset, y: window.pageYOffset })
        }
        let timeout = false
        let delay = 150

        window.addEventListener("scroll", () => {
            clearTimeout(timeout)
            timeout = setTimeout(updatePosition, delay)
        })

        return () => window.removeEventListener("scroll", updatePosition)
    }, [])
    return scrollPosition
}

export default useScrollPosition