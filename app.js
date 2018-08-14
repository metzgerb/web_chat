var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'SuperSecretChatPassword',
    resave: true,
    saveUninitialized: false
    }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static('static'));



//render GET for homepage
app.get('/',function(req,res){
    var context = {};
    //check for current session
    if(!req.session.handle){
        res.render('login', context);
        return;
    }
    
    context.handle = req.session.handle;
    res.render('chat', context);
});

app.post('/', function(req,res){
   var context = {};

    //add session info
    if(req.body['New Handle']){
        req.body.handle = req.body.handle.replace(/ /g,"_");
        req.session.handle = req.body.handle;
    }
    
    //check for no session
    if(!req.session.handle){
        res.render('login', context);
        return;
    }
    
    context.handle = req.session.handle;
    res.render('chat',context);
});

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        io.emit('message', msg);
    });
});
  
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

server.listen(app.get('port'), function(){
    console.log("Server started on port: " + app.get('port') + "; Press Ctrl-C to terminate.");
});
