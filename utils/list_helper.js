const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if (!blogs.length>0) {
        return 0;
    }

    if (blogs.length === 0) {
        return 0;
    }

    let summOfLikes=0;
    blogs.forEach(function (item, i, arr) {
        summOfLikes = summOfLikes + item.likes
    })
    return summOfLikes;
}

const favoriteBlog = (blogs) => {
    let favoriteBlogNumber = 0;
    blogs.forEach(function (item, i, arr) {
        if (item.likes > favoriteBlogNumber) {
            favoriteBlogNumber = i
        }
    })
    return blogs[favoriteBlogNumber]
}

const mostBlogs = (blogs) => {
    // let favoriteBlogNumber = 0;
    const blogMap = new Map();

    blogs.forEach(function (item, i, arr) {
        let currentValue = blogMap.get(item.author);
        if (currentValue != null) {
            blogMap.set(item.author, currentValue + 1)
        } else
        {
            blogMap.set(item.author, 1)
        }
    })

    let maxValue = 0;
    let favoriteBloger = "";
    blogMap.forEach(function (value, key, map)
    {
        if (map.get(key) >= maxValue) {
            favoriteBloger = key;
        }
    }
    )
    return {
        author: favoriteBloger,
        blogs: blogMap.get(favoriteBloger),
    };
    }


const mostLikes = (blogs) => {
    const blogMap = new Map();

    blogs.forEach(function (item, i, arr) {
        let currentValue = blogMap.get(item.author);
        if (currentValue != null) {
            blogMap.set(item.author, currentValue + item.likes)
        } else
        {
            blogMap.set(item.author, item.likes)
        }
    })

    let maxValue = 0;
    let favoriteBloger = "";
    blogMap.forEach(function (value, key, map)
        {
            if (map.get(key) >= maxValue) {
                favoriteBloger = key;
            }
        }
    )
    return {
        author: favoriteBloger,
        likes: blogMap.get(favoriteBloger),
    };
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}