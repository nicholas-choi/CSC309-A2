require('./port');
var express = require('express');
var app = express();

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content'));


/* WHERE WE HAVE BEGUN WORKING */

// The POST Request (Registering a User)!
app.post('/api/makeuser/:name/', function(req, res) {

	// Passed in User/Password Parameters.
	var username = req.body.name;
	var password = req.body.pass;

	// Console Log Description (Server/Terminal).
	console.log("POST:Create:"+username+","+password);

	// Our SQL Query.
	let sql = 'INSERT INTO appuser(name, password) VALUES (?,?);';

	// Adding Data into SQL.
	db.run(sql, [username, password], function (err) {
		var result = {};
  		if (err) {
			res.status(409);
    			result["error"] = err.message;
  		} else {
			result[username] = "updated rows: "+this.changes;
		}
		// Successful: Return 'Result' to both Console & Webpage (RES).
		console.log(JSON.stringify(result));
		res.json(result);
	});
});


// The GET Request (Getting # of Scores).
app.get('/api/getsid/', function(req, res) {

	// Console Log Description (Server/Terminal).
	console.log("GET:Number Of Scores");

	// Our SQL Query.
	let sql = "SELECT count(*) AS num FROM highscore;";

	// Getting Data Row Value.
	db.get(sql, [], function(err, row) {
		var result = {};
		result["getsid"] = [];
		if (err) {
    			result["error"] = err.message;
  		} else {
  			result["getsid"].push(row);
  		}
  		res.json(result);
	});
});

// The POST Request (Creating a Score).
app.post('/api/score/:name/', function(req, res) {

	// Passed In Sid, Name, Score Parameters.
	var sid = req.body.sid;
	var name = req.body.name;
	var score = req.body.score;

	// Console Log.
	console.log("POST:CreateScore:"+sid+","+name+","+score);

	// Our SQL Query.
	let sql = "INSERT INTO highscore VALUES (?,?,?);";

	// DB-Insert.
	db.run(sql, [sid, name, score], function(err) {
		var result = {};
  		if (err) {
			res.status(409);
    			result["error"] = err.message;
  		} else {
			result[name] = "updated rows: "+this.changes;
		}
		// Successful: Return 'Result' to both Console & Webpage (RES).
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

// The POST Request (Incrementing User's Win Count).
app.post('/api/increment/:name/', function(req, res) {

	// Passed in Username/Wins.
	var user = req.body.name;
	var wins = req.body.wins;

	// Console Log.
	console.log("POST:IncrementWin:"+user);

	// Our SQL Query.
	let sql = "UPDATE appuser SET wins=? WHERE name=?;";

	// Increment In DB.
	db.run(sql, [wins, user], function(err) {
		var result = {};
  		if (err) {
			res.status(409);
    			result["error"] = err.message;
  		} else {
			result[user] = "updated rows: "+this.changes;
		}
		// Successful: Return 'Result' to both Console & Webpage (RES).
		console.log(JSON.stringify(result));
		res.json(result);
	});

});

// The POST Request (Checking if a User Exists)!
app.post('/api/checkuser/:name/', function(req, res) {

	// Passed in User Parameters.
	var username = req.body.name;

	// Console Log Description (Server/Terminal).
	console.log("POST:CheckExists:"+username);

	// Our SQL Query.
	let sql = 'SELECT count(*) AS num FROM appuser WHERE name=?;';

	// Saving Row data.
	db.get(sql, [username], function(err, row) {
		var result = {};
		result["checkreg"] = [];
		if (err) {
    			result["error"] = err.message;
  		} else {
  			result["checkreg"].push(row);
  		}
  		res.json(result);
	});
});


// The POST Request (Login)!
app.post('/api/login/', function(req, res) {

	// Passed in User/Password Parameters.
	var username = req.body.name;
	var password = req.body.pass;

	// Console Log Description (Server/Terminal).
	console.log("POST:Login:"+username+","+password);

	// Our SQL Query.
	let sql = "SELECT * FROM appuser WHERE name=? AND password=?;";

	// Saving Row data.
	db.get(sql, [username, password], function(err, row) {
		var result = {};
		result["login"] = [];
		if (err) {
    			result["error"] = err.message;
  		} else {
  			result["login"].push(row);
  		}
  		res.json(result);
	});
});

app.delete('/api/delete/:name/', function(req, res) {

	// Passed in User/Password Parameters.
	var username = req.body.name;
	var password = req.body.pass;

	// Console Log Description (Server/Terminal).
	console.log("DELETE:"+username+","+password);

	// Our SQL Query.
	let sql = "DELETE FROM appuser WHERE name=? AND password=?;";

	// Deleting The Row.
	db.run(sql, [username, password], function(err) {
		var result = {};
  		if (err) {
			res.status(409);
    			result["error"] = err.message;
  		} else {
			result[username] = "updated rows: "+this.changes;
		}
		// Successful: Return 'Result' to both Console & Webpage (RES).
		console.log(JSON.stringify(result));
		res.json(result);
	});
});

// The POST Request (Updating Profile)!
app.put('/api/update/', function(req, res) {

    // Passed in User/Password Parameters.
    var username = req.body.name;
    var password = req.body.pass;
    var email = req.body.email;

    // Console Log Description (Server/Terminal).
    console.log("POST:UpdateProfile:"+username+","+password+","+email);

    // Our SQL Query.
    let sql = "UPDATE appuser SET password=?, email=? WHERE name=?;";

    db.run(sql, [password, email, username], function(err) {
        var result = {};
        if (err) {
            res.status(409);
                result["error"] = err.message;
                alert("409: Update Failed");
        } else {
            result[username] = "updated rows: "+this.changes;
        }
        // Successful: Return 'Result' to both Console & Webpage (RES).
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

// The GET Request (Getting Top 10 Highscores)!
app.get('/api/scores/', function(req, res) {

	// Our SQL Query.
	let sql = 'SELECT name, score FROM highscore ORDER BY score DESC LIMIT 10;';

	// Saving Row data.
	db.all(sql, [], function(err, rows) {
		var result = {};
		result["scores"] = [];
  		if (err) {
    			result["error"] = err.message;
  		} else {
			rows.forEach((row) => {
				result["scores"].push(row);
			});
		}
		res.json(result);
	});
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

// db.close();
