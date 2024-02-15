const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

// Conneting to MongoDB
async function connect() {
    mongoose.connect("mongodb+srv://nasir:xTueXxUMaihERTGr@cluster0.mewcb06.mongodb.net/?retryWrites=true&w=majority")
    console.log("Connected to MongoDB")    
}

connect().catch(error => console.log(error))


// Schema of post model
const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    author: String,
    category: String
})

// Post model
const Post = mongoose.model("Post", postSchema)

const app = express()

app.listen(8080, () => {
    console.log('Listening on port 8080')
})

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Hello there!")
})

// Create post API
app.post("/post", async(req, res) => {
    console.log(req.body)
    let title = req.body.title
    let description = req.body.description
    let image = req.body.image
    let author = req.body.author
    let category = req.body.category

    let post = new Post()
    post.title = title
    post.description = description
    post.image = image
    post.author = author
    post.category = category
    await post.save()
    res.json({ success: true, message: "Post created successfully" })
})

// Get all posts
app.get("/post", async(req, res) => {
    let posts = await Post.find()
    res.json(posts)
})

// Get single post by id
app.get("/post/:postId", async(req, res) => {
    try {
        
    let postId = req.params.postId
    let post = await Post.findById(postId)
    if (!post) {
        console.log("Post not found")
        res.status(404).json({message: "Post not found"})
    }
    res.json(post)

    } catch (error) {
        return res.status(500).json({message: error})
    }
})

// Update a post
app.put("/post/:postId", async(req, res) => {
    let postId = req.params.postId
    let payload = {
        title: req.body.title,
        description: req.body.description,
        // image: req.body.image,
        author: req.body.author,
        category: req.body.category
    }
    // method 1
    // let post = await Post.findByIdAndUpdate(postId, payload)
    
    // method 2
    let post = await Post.findById(postId)
    post.title = payload.title
    post.description = payload.description
    post.author = payload.author
    post.category = payload.category
    await post.save()
    res.json(post)
})

// Delete a post
app.delete("/post/:postId", async(req, res) => {
    let postId = req.params.postId

    // method 1
    let post = await Post.findByIdAndDelete(postId)
    if (!post) {
        console.log("Post not found")
        res.status(404).json({message: "Post not found"})
    }

    // method 2
    // let post = await Post.findById(postId)
    // await post.deleteOne()
    res.json({message: "Post deleted successfully"})
})
