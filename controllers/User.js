const { User } = require('../models')

const associateRepositories = ({ _id, repoIds }) => {
  return User.findOneAndUpdate(
    { _id },
    { $set: { repositories: repoIds } },
    { new: true })
}

const getRepositoryIds = ({ _id }) => {
  return User.findOne({ _id }, 'repositories')
}

const getDataById = async ({ _id }) => {
  return User.findOne({ _id })
    .populate('repositories')
}

const getDataByGitHubId = async ({ gitHubId }) => {
  return User.findOne({ gitHubId })
    .populate('repositories')
}

const loginWithGithub = async ({
  gitHubId,
  location,
  bio,
  profileImageUrl,
  profilePageUrl,
  profileName,
  email
}) => {
  const cb = (err, doc) => {
    if (err) throw err
    return doc
  }

  return User.findOneAndUpdate(
    { gitHubId },
    {
      profileName,
      profilePageUrl,
      profileImageUrl,
      email,
      bio,
      location
    },
    {
      upsert: true,
      new: true
    }, cb)
}

const updateData = (
  { _id },
  {
    profileName,
    email,
    bio,
    location,
    chosenTemplate
  }) => {
  return User.findOneAndUpdate(
    { _id },
    {
      profileName,
      email,
      bio,
      location,
      chosenTemplate
    },
    { new: true })
}

module.exports = {
  loginWithGithub,
  getRepositoryIds,
  getDataById,
  getDataByGitHubId,
  updateData,
  associateRepositories
}
