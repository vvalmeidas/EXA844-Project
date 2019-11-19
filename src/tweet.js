var client = require('./twitter_client');
var settingsSearch = require('./settings_search');
var dynamo = require('./dynamo');
var monitoring = require('./monitoring');

class Tweet {
    constructor(id, text, date, isRT) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.isRT = isRT;
    }
};

//twitter search results
var text = '';
var id = '';
var isRt = false;
var date = '';

//aux
var i = 0;
var createdAt = '';
var months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}

var params;
var result = {};

//tratar caso sem coordenadas

module.exports.start = function() {
    params = settingsSearch.getUpdateParams(); //trocar por busca de monitoring

    params.forEach(param => {
        client.get('search/tweets', param, function(error, tweets, response) {
            tweets.statuses.forEach(function(tweet) {
                id = tweet.id_str;
                createdAt = tweet.created_at.split(' ');
                date = createdAt[2] + '/' + months[createdAt[1]] + '/' + createdAt[5];

                if (tweet.retweeted_status) {
                    tweet = tweet.retweeted_status;
                    isRT = true;
                } else {
                    isRT = false;
                }

                text = tweet.full_text;

                result.id = id;
                result.text = text;
                result.date = date;
                result.isRT = isRT.toString();

                ///     dynamo.saveData("tweets", new Tweet(id, text, date, isRT.toString()));

                console.log("DADOS DO TWEET");
                console.log(id);
                console.log(text);
                console.log(date);
                console.log(isRT);
                console.log("\n\n");
                i++;

            });

            console.log(i);
            i = 0;
        });
    });
};