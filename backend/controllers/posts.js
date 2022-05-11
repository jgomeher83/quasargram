const Post = require('../models/Post')

const createPost = async (req, res) => {
    //backend
    try{
        await Post.create(req.body)
        .then(post=>{
            res.status(201).json({post})
        })
        .catch(err=>console.log(err))
    }catch (err) {
        console.log(err)
    }
}

const getAllPosts = async (req, res) => {
    // backend
    try {
        const posts = await Post.find({})
        res.status(200).json({posts})

    } catch (err) {
        console.log('error obteniendo los posts');
        res.status(500).json({ msg: error })
    }
}

const getOnePost = async (req, res) => {
    const _id = req.params.id
    try{
        const post = await Post.findOne({_id})
        res.status(200).json({post})
    }catch(err){
        console.log('error obteniendo user');
        res.status(500).json({ msg: error })
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getOnePost
}