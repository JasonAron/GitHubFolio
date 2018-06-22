const express = require('express')
const router = express.Router()
const { isAuthenticated, isAuthenticatedBoolean } = require('../../utils/isAuthenticated')
const { user, repository, gitHubAPI, fileHandler } = require('../../controllers')

/**
 * API Routes - '/api/user'
 */

router.route('/data')
  // Retrieve all user data, pinned repos included
  // PASS OR FAIL? ->
  .get(isAuthenticated, (req, res, next) => {
    user.getDataById({ _id: req.user._id })
      .then(userData => res.json(userData))
      .catch(err => next(err))
  })
  // Update user data (non-pinned repo data)
  // PASS OR FAIL? -> PASS
  .put(isAuthenticated, (req, res, next) => {
    // Destructure request body, compose user data object
    const { profileName, profilePageUrl, email, profileImageUrl, bio, location, chosenTemplate, chosenColor } = req.body
    const userData = { _id: req.user._id, profileName, profilePageUrl, email, profileImageUrl, bio, location, chosenTemplate, chosenColor }
    user.updateData(userData)
      .then(repos => res.status(201).json(repos))
      .catch(err => next(err))
  })

router.route('/pinnedrepos')
  // Query GitHub graphQL, store pinned repos in DB
  // PASS OR FAIL? -> FAIL
  .post(isAuthenticated, (req, res, next) => {
    gitHubAPI.getPinnedRepos(req.user.accessToken)
      .then(repositories => repository.addNew({ _id: req.user._id, repositories }))
      .then(() => res.status(201).send())
      .catch(err => next(err))
  })
  // Update user pinned repos
  // PASS OR FAIL? -> FAIL
  .put(isAuthenticated, (req, res, next) => {
    // Destructure request body, compose repo data object
    const { _id, name, description, repositoryUrl, deployedUrl } = req.body
    const repos = { _id, name, description, repositoryUrl, deployedUrl }
    repository.update(repos)
      .then(() => res.status(204).send())
      .catch(err => next(err))
  })

router.route('/photo/:repoId')
  // Add photo to pinned repo
  // PASS OR FAIL? -> FAIL
  .post(isAuthenticated, (req, res, next) => {
    fileHandler.handleImageUpload({ req, res, _id: req.params.repoId })
      .then(updatedRepoData => res.status(201).json(updatedRepoData))
      .catch(err => next(err))
  })

router.route('/isauthenticated')
  .get((req, res, next) => {
    res.json({ isAuthenticated: isAuthenticatedBoolean(req) })
  })

module.exports = router
