const Post = require('../models/Post')

exports.viewCreateScreen = function (req, res) {
    res.render('create-post')
}

exports.create = function (req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then(() => {
        res.send('New post created.')
    }).catch((errors) => {
        res.send(errors)
    })
}

exports.viewSingle = async function (req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        res.render('single-post-screen', { post: post })
    } catch {
        res.render('404')
    }
}

exports.viewEditScreen = async function (req, res) {
    try {
        let post = await Post.findSingleById(req.params.id)
        res.render('edit-post', { post: post })
    } catch {
        res.render('404')
    }
}

exports.edit = function (req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update().then((status) => {
        // the post was successfully updated in the database
        // or user had permission but there were validation errors
        if (status == 'success') {
            // post updated in db
            req.flash('success', 'Post sucessfully updated.')
            req.session.save(function () {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        } else {
            post.errors.forEach(error => {
                req.flash('errors', error)

            })
            req.session.save(function () {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }
    }).catch(() => {
        // a post with requested id does not exist
        // or if the current visitor is not the owner of the post
        req.flash('errors', 'You do not have permission to perform that action')
        req.session.save(function () {
            res.redirect('/')
        })
    })
}