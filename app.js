var _ = require('lodash');
var config = require('./config');
var Twitter = require('twitter');

if (process.env.NODE_ENV !== 'production') {
  config = _.merge(config, require('./local.env.js'));
}

var client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

client.stream('statuses/filter', {track: config.track}, function(stream) {
  stream.on('data', function(tweet) {
    if (tweet.user.screen_name !== config.screen_name) {
      // console.log(tweet.user.screen_name);
      // console.log(tweet);
      client.post('statuses/update', {
        status: 'nah RT @' + tweet.user.screen_name + ': ' + tweet.text
      }, function(err, tweet, response) {
        if (err) {
          console.log(err);
          return;
        }
        // console.log(tweet.text);
      });
    }
  });

  stream.on('error', function(err) {
    throw err;
  });
});
