
const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors())
const  mainRouter = require('./routes/main') 
const connectDB = require('./db/connect')
require('dotenv').config()

//middlewares to handle req??
// app.use(express.static('./public/')) 
app.use(express.json())
//routes
// app.get('/hello',(req, res)=>{
//     res.send('Task Manager App')
// })
// app.use('products', tasks )
const port = 9888
app.use('/api/v1', mainRouter )
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI) 
        console.log('connected db quasargram-posts..');
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch(error) {
        console.log(error);
    }
}
start()