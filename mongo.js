const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://mongotest:${password}@cluster0.dwpwqyq.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
    const blogSchema = new mongoose.Schema({
        title: String,
        author: String,
        url: String,
        likes: Number
    })

    const Blog = mongoose.model('Blog', blogSchema)


    const blog = new Blog({
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 2
    })

    blog.save().then(result => {
      console.log('blog saved!')
      mongoose.connection.close()
    })

    Blog.find({}).then(result => {
        result.forEach(blog => {
            console.log(blog)
        })
        mongoose.connection.close()
    })
})