const express = require('express')
const app = express()
const port = 4000
var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
 
var config = {
    imap: {
    user: 'vijayakumar.vellaisamy@kumaran.com',
    password: 'arielWINTE666',
    host: 'outlook.office365.com',
    port: 993,
    tls: true,
      //  authTimeout: 3000
    }
};
 
imaps.connect(config).then(function (connection) {
    return connection.openBox('INBOX', false).then(function () {
        var searchCriteria = ['UNSEEN'];
        

        var fetchOptions = {
          bodies: ['HEADER', 'TEXT', ''],//markSeen: true
         //   bodies: 'HEADER,TEXT', markSeen: true 
        };
        return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            messages.forEach(function (item) {
                

                var all = _.find(item.parts, { "which": "" })
                var id = item.attributes.uid;
                var idHeader = "Imap-Id: "+id+"\r\n";
                simpleParser(idHeader+all.body, (err, mail) => {
                    // access to the whole mail object
                    
                    console.log("FROM = ",mail.from.text)
                    console.log("TO ADDRESS = ",mail.to.text)
                    console.log("SUBJECT = ",mail.subject)
                    console.log("MAIL BODY = ",mail.text)
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })