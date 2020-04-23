require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http')
const sendGrid = require('@sendgrid/mail')

const app = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body

    const emailMessage = {
        to: process.env.EMAIL_CONTACT,
        from: email,
        subject: `New Message from Website Contact Form`,
        html: `<h1>${name} has sent Adopt a Minor Leaguer a message!</h1>
    <div><h2>Their message is:</h2><div>
    <div><p>${message}</p><div>
    <br />
    <div><p>Responding to this email will send your email back to the sender.</p><div>
    `,
    }

    sendGrid.send(emailMessage)
        .then(response => res.send({
            statusCode: 200,
            success: true,
            errors: [],
            data: {}
        }))
        .catch(err => res.send(err))
})

if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    app.use('/api', router)
} else {
    app.use('/.netlify/functions/api', router)
}


module.exports = app
module.exports.handler = serverless(app)