const mongoose = require('mongoose')

const connectDB = (url) => {
    return mongoose.connect(url,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify: false,
        useUnifiedTopology:true
    })
}

module.exports = connectDB






//so the connect string to the DB is this where I put the pass and the name of the DB. 