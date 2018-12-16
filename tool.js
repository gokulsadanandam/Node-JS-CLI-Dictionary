let express = require('express'),
    https = require('https'),
    request = require('request')
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const app = {
    parsedresults: [],
    randomWords: [
        "west",
        "shoot",
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
        if (process.argv[3]) {
            this.type = process.argv[2] || "dict"
            this.word = process.argv[3]
        } else if (process.argv[2]) {
            this.type = "game"
        } else {
            this.type = "dict"
            this.word = process.argv[2] || this.getRandomWord()
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
                this.url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + this.word
                this.getWordDetail(this.word, "definitions", this.url)
                this.getWordDetail(this.word, "synonyms")
                this.getWordDetail(this.word, "antonyms")
                this.getWordDetail(this.word, "sentences")
                break;
            case "def":
                this.url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + this.word
                this.getWordDetail(this.word, "definitions", this.url)
                break;
            case "game":
                this.playgame()
                break;
            default:
                console.log("Invalid Command")
                break;
        }
    },
    getRandomWord: function() {
        this.index = this.getRandomIndex(0, 39)
        this.word = this.randomWords[this.index]
        console.log("\tRandom Word of the Day is - " + this.word)
        return this.word
    },
    getRandomIndex: function(lower, higher) {

        return parseInt(Math.random() * (higher - lower) + lower)

    },
    parseJSONData: function(input, parameter) {
        Object.keys(input).forEach((data) => {
            if (parameter == data) {
                if (data == "definitions") {
                    this.parsedresults = this.parsedresults.concat(input[data])
                } else {
                    input[data].forEach((values) => {
                        this.parsedresults.push(values.text.trim())
                    })
                    return this.parsedresults
                }

            } else if (input[data] instanceof Array) {
                this.parseJSONData(input[data][0], parameter)
            }
        })
    },
    printResult: function(data) {
        data.forEach((values, index) => {
            index = index + 1
            console.log("\t\t" + index + ")" + values)
        })
        this.parsedresults = []
    },
    getWordDetail: function(word, value, url, game) {
        const options = {
            "url": url || 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + word + '/' + value,
            "headers": {
                "Accept": "application/json",
                "app_id": "aa63a5d1",
                "app_key": "63a40f1f9cd31d55134b61c79b44d471"
            }
        };
        request.get(options, (err, resp, body) => {
            if (resp.statusCode == 200) {
                if (game) {
                    this.parseJSONData((JSON.parse(body)), (value))
                    this.gameaction(word, value, this.parsedresults)
                } else {
                    console.log(" \n \t" + value.toUpperCase())
                    this.parseJSONData((JSON.parse(body)), (value))
                    this.printResult(this.parsedresults)
                }
            } else {
              if(game){
                this.playgame()
              }else{
                console.log("\n\tNO " + value.toUpperCase() + " FOUND")
              }
              }
        })
    },
    getUserInput: function(question, word, type, words) {

        rl.question(question, (answer) => {
            this.answer = answer
            this.parseanswer(answer, word, type, words)
        })
    },
    shuffle : function(word,type,words){
  
      sword = word.split("")
  
      for(var i = sword.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = sword[i];
        sword[i] = sword[j];
        sword[j] = tmp;
      } 
    sword = sword.join("");
    console.log(" The Scrambled Word is " + sword + "\n")
    this.getUserInput(' Try to Answer now-> \n',word,type,words)      
    },
    gethint:function(word ,type,words){
      console.log(words)
      let random_num = this.getRandomIndex(0,words.length-1)
      if((random_num%2)==1){
        console.log("Another " + type + ' of the Word is "' + words[random_num] + '"')
        this.getUserInput('Enter the Word\n',word,type,words)
      }else{
        this.shuffle(word,type,words)
      }
    },
    parseanswer: function(answer, word, type, words) {
        if ((answer.trim().toLowerCase() === word.toLowerCase()) || (words.includes(answer.trim().toLowerCase()))) {
            console.log(" Correct Answer\n")
            this.getUserInput(' Want to Play Again ? y or n ?\n ', word, type, words)
        } else if (parseInt(answer.trim()) == 1) {
            this.getUserInput('\n Enter the Word ->', word, type, words)
        } else if (parseInt(answer.trim()) == 2) {
            this.gethint(word,type,words)
        } else if (parseInt(answer.trim()) == 3) {
            console.log("\n The Word is " + word.toUpperCase())
            this.getWordDetail(this.word, "synonyms")
            this.getWordDetail(this.word, "antonyms")
            this.getWordDetail(this.word, "sentences")
            rl.close()
        } else if ((answer.trim().toLowerCase() == 'y')) {
            this.playgame()
        } else if ((answer.trim().toLowerCase() == 'n')) {
            rl.close()
        } else {
            console.log("\n Wrong Answer :(\n\n")
            let try_again = " 1) Enter 1 to Try Again.\n 2) Enter 2 to get a Hint\n 3) Enter 3 to get the answer.\n\n Enter Your Option ->  "
            this.getUserInput(try_again, word, type, words)
        }
    },
    gameaction: function(word, type, words) {
        let random_index = this.getRandomIndex(0, words.length - 1)
        question = "\n Find the Word. " + type.slice(0, type.length - 1) + ' of the word is "' + words[random_index] + '"\n Enter Your Answer -> '
        words.splice(random_index,1)
        this.getUserInput(question, word, type, words)
    },
    playgame: function() {
        this.random_action = ["synonyms", "definitions", "antonyms"]
        this.word_index = this.getRandomIndex(0, this.randomWords.length-1)
        this.random_action_index = this.getRandomIndex(0, 1000) % 3
        this.word = this.randomWords[this.word_index]
        this.action = this.random_action[this.random_action_index]
        if (this.action == "definitions") {
            this.url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + this.word
            this.getWordDetail(this.word, this.action, this.url, true)
        } else {
            this.getWordDetail(this.word, this.action, null, true)
        }
    }
}
module.exports = app.parseInput()