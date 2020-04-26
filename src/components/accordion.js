import React, { useRef } from 'react'
import '../styles/accordion.scss'

const Accordion = ({ ...props }) => {
    return (
        <div className="accordion-container">
            <AccordionItem />
            <AccordionItem />
            <AccordionItem />
        </div>
    )
}

export default Accordion

const AccordionItem = ({ ...props }) => {

    const content = useRef(null)

    const toggleVisibility = () => {
        const elem = content.current
        elem.classList.toggle("open")
        if (elem.style.maxHeight) {
            elem.style.maxHeight = null
        } else {
            elem.style.maxHeight = elem.scrollHeight + "px"
        }
    }

    return (
        <div className="accordion-item">
            <button className="header-button" onClick={toggleVisibility} tabIndex={0}>
                <h3>I am the accordion's header.</h3>
            </button>
            <div className="content" ref={content}>
                <p>Hi! I'm an accordion's item!</p>
            </div>
        </div>
    )
}