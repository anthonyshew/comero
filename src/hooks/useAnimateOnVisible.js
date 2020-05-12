import { useEffect } from 'react'

export const useAnimateOnVisible = (options) => {
    useEffect(() => {
        if (!options.element) return console.error("No element specified for useAnimateOnVisible()")
        const observer = new IntersectionObserver(([entry]) => {
            const crossedBottomOfViewport = entry.boundingClientRect.y > entry.rootBounds.y

            if (crossedBottomOfViewport && entry.isIntersecting) {
                options.element.current.classList.add(options.inClass ?? "in")
                options.element.current.classList.remove(options.outClass ?? "out")
            }

            if (crossedBottomOfViewport && !entry.isIntersecting) {
                options.element.current.classList.remove(options.inClass ?? "in")
                options.element.current.classList.add(options.outClass ?? "out")
            }

        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        })

        if (options.element.current) {
            observer.observe(options.element.current)
        }

        return () => observer.disconnect()
    }, [options.element, options.inClass, options.outClass])
}