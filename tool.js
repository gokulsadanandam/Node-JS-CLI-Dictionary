let express = require('express'),
    https = require('https'),
    request = require('request')
const readline = require('readline');

const app = {
    parseInput: function() {
        this.type = process.argv[2]
        this.word = process.argv[3]
        switch (this.type) {
            case "def":
                this.getWordDetail(this.word,"synonyms")
                break;
            case "ant":
                this.getWordDetail(this.word,"antonyms")
                break;
            default:
                console.log("Invalid Command")
                break;
        }
    },
    parseJSONData : function(input,parameter){
        Object.keys(input).forEach((data)=>{
          if(parameter==data){
            input[data].forEach((values)=>{
              console.log("\t" + values.text)
            })
              return input[data]
          }else if(input[data] instanceof Array){
              this.parseJSONData(input[data][0],parameter)
            }
        })
    },
    getWordDetail: function(word,value) {
        const options = {
            "url": 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + word + '/' + value,
            "headers": {
                "Accept": "application/json",
                "app_id": "aa63a5d1",
                "app_key": "63a40f1f9cd31d55134b61c79b44d471",
            }
        };

        request.get(options, (err, resp, body) => {

            let data =  this.parseJSONData((JSON.parse(body)),value)
        })
    }
}

module.exports = app.parseInput()