const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: 'test title',
        author: 'mluukkai1',
        url: 'test url',
        likes: 2,
    },
    {
        title: 'test title3',
        author: 'mluukkai1',
        url: 'test url',
        likes: 3,
    },
    {
        title: 'test title2',
        author: 'test author2',
        url: 'test url2',
        likes: 4,
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
}