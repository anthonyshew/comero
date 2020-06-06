require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http')
const sendGrid = require('@sendgrid/mail')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const router = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const getDateTime = () => {
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()
    var second = now.getSeconds()
    if (month.toString().length === 1) {
        month = '0' + month
    }
    if (day.toString().length === 1) {
        day = '0' + day
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute
    }
    if (second.toString().length === 1) {
        second = '0' + second
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
    return dateTime
}

router.post("/checkout", async (req, res) => {
    const clientSecret = await stripe.paymentIntents.create({
        amount: req.body.checkoutAmount * 100,
        currency: "usd"
    }).catch(err => console.log(err))

    res.send(clientSecret)
})

router.post('/checkout-success', (req, res) => {
    const { order, data } = req.body

    const emailMessage = {
        to: [process.env.EMAIL_TO, data.email],
        from: process.env.EMAIL_FROM,
        replyTo: data.email,
        subject: `New Online Order!`,
        html: `
        <h1>We have recieved a new online order!</h1>
        <h2>${getDateTime()}</h2>
        ${order.orderItems.map(item => (
            `<div>
                <div><h2 style="display: inline">Item: </h2><span style="font-size: 14px">${item.menuItem}</span></div>
                <div><h3 style="display: inline">   Options: </h3><span>${item.options.map(option => `<span style="font-size: 14px">${option}</span>`)}</span></div>
            </div>`
        ))}
        <div><h1>Customer Information</h1></div>
        <div><h2 style="display: inline">First Name: </h2><span style="font-size: 14px">${data.First_name}</span></div>
        <div><h2 style="display: inline">Last Name: </h2><span style="font-size: 14px">${data.Last_name}</span></div>
        <div><h2 style="display: inline">Street Address: </h2><span style="font-size: 14px">${data.Street_address}</span></div>
        <div><h2 style="display: inline">City: </h2><span style="font-size: 14px">${data.City}</span></div>
        <div><h2 style="display: inline">State: </h2><span style="font-size: 14px">${data.State}</span></div>
        <div><h2 style="display: inline">Postal Code: </h2><span style="font-size: 14px">${data.Postal_Code}</span></div>
    `,
    }

    sendGrid.send(emailMessage)
        .then(response => res.send({
            statusCode: 200,
            success: true,
            errors: [],
            data: firstName
        }))
        .catch(err => res.send(err))
})

router.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body

    const emailMessage = {
        to: process.env.EMAIL_CONTACT,
        from: process.env.EMAIL_FROM,
        replyTo: email,
        subject: `New Message from Website Contact Form`,
        html: `<h1>${name} has sent your restaurant a message!</h1>
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