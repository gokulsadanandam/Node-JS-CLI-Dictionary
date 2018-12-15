let express = require('express'),
    https = require('https'),
    request = require('request')
const readline = require('readline');


const app = {
      parseInput : function(){
        this.type = process.argv[2]
        this.word = process.argv[3]
        switch (this.type){
          case "def":
              this.getDefinition(this.word)
              break
          default:
            console.log("Invalid Command")
            break
        }
      },
      getDefinition : function(word){
        console.log("Getting Definition")
      }



        }
    




module.exports = app.parseInput()