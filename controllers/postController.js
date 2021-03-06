const Post = require('../models/Post')

exports.viewCreateScreen = function (req, res) {
    res.render('create-post')
}

exports.apiCreate = function (req, res) {
    let post = new Post(req.body, req.apiUser._id)
    post.create().then((newId) => {
        res.json('Cool going. Banzai')
    }).catch((errors) => {
        res.json(errors)
    })
}

exports.create = function (req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then((newId) => {
        req.flash('success', 'New post successfully created.')
        req.session.save(() => res.redirect(`/post/${newId}`))

    }).catch((errors) => {
        errors.forEach(error => req.flash('error', error))
        req.session.save(() => res.redirect('/create-post'))
    })
}

exports.viewSingle = async function (req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        res.render('single-post-screen', {
            post: post,
            title: post.title
        })

    } catch {
        res.render('404')
    }
}

exports.viewEditScreen = async function (req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        if (post.isVisitorOwner) {
            res.render('edit-post', { post: post })
        } else {
            req.flash('You do not have permission to perform that action.')
            req.session.save(() => res.redirect('/'))
        }
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


exports.apiDelete = function (req, res) {
    Post.delete(req.params.id, req.apiUser._id).then(() => {
        res.json('Gone!')
    }).catch(() => {
        res.json('No can do.')
    })

}

exports.delete = function (req, res) {
    Post.delete(req.params.id, req.visitorId).then(() => {
        req.flash('success', 'Post successfully deleted.')
        req.session.save(() => res.redirect(`/profile/${req.session.user.username}`))
    }).catch(() => {
        req.flash('error', 'You do not have permission to perform that action')
        req.session.save(() => res.redirect('/'))
    })

}

exports.search = function (req, res) {
    Post.search(req.body.searchTerm).then(posts => {
        res.json(posts)
    }).catch(() => {
        res.json([])
    })
}