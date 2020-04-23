import { useEffect } from 'react'

const useBodyScrollLock = () => {
    useEffect(() => {

        const body = document.querySelector('body')

        body.style.position = 'fixed'

        return () => {
            body.style.position = 'static'
        }
    }, [])
}

export default useBodyScrollLock