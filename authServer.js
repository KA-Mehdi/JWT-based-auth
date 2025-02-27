//////////// handle only authentification//////////////////////////
require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())

let refreshTokens = []

// create a new acces token based on the refresh token and send it back to the user
app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    console.log("Received Refresh Token:", refreshToken);
    if (refreshToken == null){
        return res.sendStatus(401)  
    } 
    if (!refreshTokens.includes(refreshToken))
        return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH, (err, user) => {
        if (err) return res.sendStatus(403)
            const accesToken = generateAccessToken({name: user.name})
            res.json({ accesToken: accesToken })
    })
})

// user logout = token deleted 
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})


app.post('/login', (req, res) => {
    // auth create json web token
    const username = req.body.username
    const user = {name: username}
    // after assuming that he loged in correctly
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_REFRESH)
    refreshTokens.push(refreshToken)
    res.json({ accesToken: accessToken, refreshToken: refreshToken })
})

// generate acces token for the user that has logged in 
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}


app.listen(4000)