import React, { useRef } from 'react'
import '../styles/accordion.scss'

export const Accordion = ({ children }) => {
    return (
        <div className="accordion-container">
            {children}
        </div>
    )
}

export const AccordionItem = ({ header, children }) => {
    const content = useRef(null)

    const toggleVisibility = () => {
        const elem = content.current
        elem.classList.toggle("open")
        if (elem.style.maxHeight) {
            elem.style.maxHeight = null
        } else {
            elem.style.maxHeight = elem.scrollHeight + 36 + "px"
        }
    }

    return (
        <div className="accordion-item">
            <button className="header-button" onClick={toggleVisibility} tabIndex={0}>
                <h3>{header}</h3>
            </button>
            <div className="content" ref={content}>
                {children}
            </div>
        </div>
    )
}