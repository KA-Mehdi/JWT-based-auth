require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())

// => get the token they have send us and verify this is the correct user
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ') [1]
    if(token == null) return res.sendStatus(401)

    // we have a valid token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
    
}

const posts = [
    {
        username: 'mehdi',
        title: 'post1 '
    },
    {
        username: 'kamil',
        title: 'post2 '
    }
]


app.get('/posts', authenticateToken,(req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})



app.listen(3000)