// example of running tests: npm test -- tests/blog_api.test.js
// npm test -- --test-name-pattern="--"

const { test, after, beforeEach, describe} = require('node:test')
const Blog = require('../models/blog')

const mongoose = require('mongoose')
const helper = require('../utils/test_helper')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require("../models/user");
const bcrypt = require("bcrypt");
const api = supertest(app)


describe('blogs testing', () => {

    let token = ''

    beforeEach(async () => {

        await Blog.deleteMany({})
        for (let blog of helper.initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }

        await User.deleteMany({})
        const newUser = {
            username: 'mluukkai1',
            password: 'salainen1',
        }

        const createTestUserResponse = await api
            .post('/api/users')
            .send(newUser)

        const body = {
            username: 'mluukkai1',
            password: 'salainen1'
        }

        const loginResponse = await api
            .post('/api/login')
            .send(body)

     token = loginResponse.body.token


    })


    test('blogs are returned as json', async () => {

        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


    after(async () => {
        await mongoose.connection.close()
    })

    test('there are two blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('the first title is about test title title', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        const titles = response.body.map(e => e.title)
        // assert.strictEqual(contents.includes('test title'), true)
        assert(titles.includes('test title'))
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'mluukkai1',
            url: 'test url2',
            likes: 4,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        const titles = response.body.map(r => r.title)

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

        assert(titles.includes('async/await simplifies making async calls'))
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'test author2',
            url: 'test url2',
            likes: 4,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        // const response = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[1]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

/////test
        const resultGetBlog = await api
            .get(`/api/blogs/`)
            .set('Authorization', `Bearer ${token}`)

        console.log(resultGetBlog.body)
        console.log(resultGetBlog.body[0].id)

/////

        await api
            .delete(`/api/blogs/${resultGetBlog.body[0].id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('blog without number of likes saved with value of "0"', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'test author2',
            url: 'test url2',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        const titles = response.body.map(r => r.title)
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        assert(titles.includes('async/await simplifies making async calls'))
        // assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[blogsAtStart.length - 1]

        assert.strictEqual(blogToView.likes, 0)

    })

    test('blog without title or URL causes to respond with the status code 400 Bad Request', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'test author2',
            likes: 4,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        // const response = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})