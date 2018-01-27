const request = require('request');
const https = require('https');
const fs = require('fs');
const GitHubToken = require('./secrets.js');

const repoOwner = process.argv[2];
const repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': GitHubToken
    }
  };

  request(options, function(err, res, body) {
    if (err) {
      // 1) do something errory
      // 2) don't let anything else happen
    }
    const response = JSON.parse(body);


    response.forEach(function(contribObj) {
      var avatarUrl = contribObj.avatar_url;
      var filePath = `./avatars/${contribObj.login}.jpg`;    // dummy value
      callback(avatarUrl, filePath);
    })
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {                                   // Note 2
      throw err;
    })
    .on('response', function (response) {                           // Note 3
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath))
}

// getRepoContributors("jquery", "jquery", downloadImageByURL)//function(err, result) {
//   console.log("Errors:", err);
//   // console.log("Result:", result);
//   result.forEach(function(key) {
//     console.log(key.avatar_url);
//   })
// });
// downloadImageByURL('https://avatars2.githubusercontent.com/u/2741?v=3&s=466', 'avatars/kvirani.jpg');
