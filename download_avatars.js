const request = require('request');
const https = require('https');
const fs = require('fs');
const GitHubToken = require('./secrets.js');

const repoOwner = process.argv[2];
const repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

const getRepoContributors = function (repoOwner, repoName, callback) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': GitHubToken
    }
  };

  request(options, function(err, res, body) {
    const response = JSON.parse(body);

    response.forEach(function(contribObj) {
      var avatarUrl = contribObj.avatar_url;
      var filePath = `./avatars/${contribObj.login}.jpg`;
      callback(avatarUrl, filePath);
    })
  });
}

const downloadImageByURL = function (url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath))
}

if (!repoOwner || !repoName) {
  console.log("Error!! Please check your repository owner and/or repository name.");
} else {
  getRepoContributors(repoOwner, repoName, downloadImageByURL);
}