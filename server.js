//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/app'));

app.get('/*', function(req,res) {
        res.sendFile(path.join(__dirname+'/dist/app/index.html'));
});

// Start the app by listening on the default Heroku port
const host = process.env.HOST || '0.0.0.0'
app.listen(process.env.PORT || 8080, host, function() {
        console.log('Server started') 
});
