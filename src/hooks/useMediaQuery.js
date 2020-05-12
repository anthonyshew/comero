import { useState, useEffect } from 'react'

// Returns a boolean stating whether the media query is true or false

export const useMediaQuery = (mediaQuery) => {

    if (typeof window !== 'undefined') {
        const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches)

        useEffect(() => {
            const mediaQueryList = window.matchMedia(mediaQuery)
            const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches)

            mediaQueryList.addListener(documentChangeHandler)

            documentChangeHandler()
            return () => {
                mediaQueryList.removeListener(documentChangeHandler)
            }
        }, [mediaQuery])

        return isVerified
    }

    return null
}