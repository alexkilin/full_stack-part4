const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

test('total likes of empty blogs array', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
})

test('total likes of not empty blogs array', () => {
    const blogs = [
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 3,
        }
        ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 3)
})

test('favorite blog', () => {
    const testblog =
        {
            title: "Test2",
            author: "Test2",
            url: "Test2",
            likes: 3,
        }
    const blogs = [
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 2,
        },
        testblog,
        {
            title: "Test3",
            author: "Test3",
            url: "Test3",
            likes: 1,
        }
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.equal(result, testblog)
})

test('most blogs', () => {
    const testValue =
        {
            author: "Test",
            blogs: 3,
        }
    const blogs = [
        {
            title: "Test",
            author: "Test1",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test3",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test3",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test3",
            author: "Test",
            url: "Test3",
            likes: 1,
        }
    ]
    const result = listHelper.mostBlogs(blogs)
    assert.deepEqual(result, testValue)
})

test('most likes', () => {
    const testValue =
        {
            author: "Test",
            likes: 5,
        }
    const blogs = [
        {
            title: "Test",
            author: "Test1",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test3",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test3",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test",
            author: "Test",
            url: "Test",
            likes: 2,
        },
        {
            title: "Test3",
            author: "Test",
            url: "Test3",
            likes: 1,
        }
    ]
    const result = listHelper.mostLikes(blogs)
    assert.deepEqual(result, testValue)
})