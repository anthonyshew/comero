import { useEffect } from 'react'

export const useBodyScrollLock = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const body = document.querySelector('body')
            const preserveXScroll = window.pageXOffset
            const preserveYScroll = window.pageYOffset
            console.log(preserveXScroll, preserveYScroll)

            body.style.position = 'fixed'

            return () => {
                body.style.position = 'static'
                window.scrollTo(preserveXScroll, preserveYScroll)

            }
        }

        return null

    }, [])
}