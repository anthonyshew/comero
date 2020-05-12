
import { useState, useEffect } from 'react'

// Returns an object with two keys, x and y

export const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(typeof window !== "undefined" ? { x: window.pageXOffset, y: window.pageYOffset } : undefined)

    useEffect(() => {
        if (typeof window !== "undefined") {
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
        }
    }, [])

    return scrollPosition
}