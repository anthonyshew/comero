import React, { useState, useRef } from 'react'
import '../styles/accordion.scss'

import Arrow from "../svg/arrow-right.svg"

export const Accordion = ({ children }) => {
    return (
        <div className="accordion-container">
            {children}
        </div>
    )
}

export const AccordionItem = ({ header, children }) => {
    const content = useRef(null)
    const [open, setOpen] = useState(false)

    const toggleVisibility = () => {
        const elem = content.current
        elem.classList.toggle("open")
        if (elem.style.maxHeight) {
            setOpen(false)
            elem.style.maxHeight = null
        } else {
            setOpen(true)
            elem.style.maxHeight = elem.scrollHeight + 36 + "px"
        }
    }

    return (
        <div className="accordion-item">
            <button className="header-button" onClick={toggleVisibility} tabIndex={0}>
                <h3>{header}</h3>
                <Arrow style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }} />
            </button>
            <div className="content" ref={content}>
                {children}
            </div>
        </div>
    )
}