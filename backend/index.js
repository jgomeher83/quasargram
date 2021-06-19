//the backend mount the posts that fetch
//from firebase to a localhost:8080/posts
//using the  server with nodemon and heroku??

/*
dependencies
*/
const express = require('express')

const admin = require('firebase-admin');
/*
config-express
*/
const app = express()

/*
config - firebase
*/
//with this json we have access to firebase
const serviceAccount = require('./serviceAccountKey.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//basic endpoint - posts
app.get('/posts', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    let posts = []
    db.collection('posts').orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                posts.push(doc.data())
            })
            response.send(posts)
        })
})

//basic endpoint - createPost
app.get('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.send('createPost')

})

/*
listen
*/
app.listen(process.env.PORT || 8080)