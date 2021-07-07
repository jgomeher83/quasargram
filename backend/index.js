//the backend mount the posts that fetch
//from firebase to a localhost:8080/posts
//using the  server with nodemon and heroku??

/*
dependencies
*/
const express = require('express')
const admin = require('firebase-admin');
let Busboy = require('busboy');
inspect = require('util').inspect;
let fields = {}

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
app.post('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')

    //to parse the formData
    var busboy = new Busboy({ headers: request.headers });

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function (data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function () {
            console.log('File [' + fieldname + '] Finished');
        });
    });

    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

        fields[fieldname] = val
    });

    busboy.on('finish', function () {
        console.log('Done parsing form!');
        //response.writeHead(303, { Connection: 'close', Location: '/' });
        console.log('fields', fields);
        db.collection('posts').doc(fields.id).set({
            id: fields.id,
            caption: fields.caption, 
            location: fields.location,
            date: parseInt(fields.date),
            imageUrl: 'https://informationplanet.com.ve/wp-content/uploads/2020/05/mejores-ciudades-de-nueva-zelanda-1-980x653.jpg' 
        })
        response.send('Done parsing form!');
    });
    request.pipe(busboy);

})

/*
listen
*/
app.listen(process.env.PORT || 8080)