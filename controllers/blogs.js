const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.get('/', async (request, response, next) => {

        const blogs = await Blog
            .find({}).populate('user', {username:1, name:1 })

        if (blogs) {
            response.json(blogs)
        } else {
            response.status(404).end()
        }

})

blogsRouter.get('/:id', async (request, response, next) => {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    if (body.likes===undefined) {
        body.likes = 0
    }
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})


blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

     const user = await User.findById(decodedToken.id)
    // const user = await User.findById(body.userId)

    console.log("User...." + request.user)

    //error........
    // const user = request.user

    if (body.likes===undefined) {
        body.likes = 0
    }

    const blog = new Blog({
        title: body.title,
        author: user.name,
        url: body.url,
        likes: body.likes,
        user:user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

        response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response,next) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    // const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(400).json({ error: 'invalid blog id' })
    }
    const userFromBlog = blog.user
    // console.log (userFromBlog.toString() + " " + decodedToken.id.toString() + " " + request.user.toString())

    if (userFromBlog.toString() === decodedToken.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }

        return response.status(400).json({ error: 'access denied' })
})

let x = 21;
let foo = function () {
    let x = 20;
}
foo();

module.exports = blogsRouter