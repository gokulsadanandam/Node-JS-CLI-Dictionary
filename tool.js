let express = require('express'),
    https = require('https'),
    request = require('request')
const readline = require('readline');

const app = {
    randomWords:[   
            'west',"shoot",
            "give",
            "psychology",
            "check",
            "justify",
            "birthday",
            "breeze",
            "means",
            "mass",
            "inn",
            "note",
            "hypnothize",
            "spring",
            "self",
            "embox",
            "bank",
            "get",
            "clay",
            "overeat",
            "legislation",
            "productive",
            "verdict",
            "aid",
            "sniff",
            "speaker",
            "institution",
            "buy",
            "bless",
            "guess",
            "appreciate",
            "wind",
            "contract",
            "understanding",
            "burial",
            "mosaic",
            "account",
            "killer",
            "destruction",
            "combination"
        ],
    parseInput: function() {
        if(!process.argv[2]){
            this.type = "dict"
            this.index = parseInt(Math.random()* (40 - 0) + 0)
            this.word =  this.randomWords[this.index] 
            console.log("Random Word of the Day is - " + this.word + "\n")
        }
        else if (process.argv[3]) {
            this.type = process.argv[2]
            this.word = process.argv[3]
        } else {
            this.type = "dict"
            this.word = process.argv[2]
        }
        switch (this.type) {
            case "syn":
                this.getWordDetail(this.word, "synonyms")
                break;
            case "ant":
                this.getWordDetail(this.word, "antonyms")
                break;
            case "ex":
                this.getWordDetail(this.word, "sentences")
                break;
            case "dict":
                this.getWordDetail(this.word, "synonyms")
                this.getWordDetail(this.word, "antonyms")
                this.getWordDetail(this.word, "sentences")
                break;
            default:
                console.log("Invalid Command")
                break;
        }
    },
    parseJSONData: function(input, parameter) {
        Object.keys(input).forEach((data) => {
            if (parameter == data) {
                let index = 1
                input[data].forEach((values) => {
                    console.log("\t\t" + index + ") " + values.text)
                    index = index + 1
                })
                return input[data]
            } else if (input[data] instanceof Array) {
                this.parseJSONData(input[data][0], parameter)
            }
        })
    },
    getWordDetail: function(word, value) {
        const options = {
            "url":'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + word + '/' + value , 
            "headers": {
                "Accept": "application/json",
                "app_id":"aa63a5d1",
                "app_key":"63a40f1f9cd31d55134b61c79b44d471"
            }
        };
        request.get(options, (err, resp, body) => {
            if(resp.statusCode==200){
              console.log(" \n \t" + value)
              this.parseJSONData((JSON.parse(body)), (value))
            }else{
              console.log("\t No " + value + " Found \n")
            }
        })
    }
}

module.exports = app.parseInput()