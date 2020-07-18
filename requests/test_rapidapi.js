require('dotenv').config();

const unirest = require("unirest");
const req = unirest("GET", "https://love-calculator.p.rapidapi.com/getPercentage");

req.query({
	"fname": "Agloks",
	"sname": "Life"
});

req.headers({
	"x-rapidapi-host": "love-calculator.p.rapidapi.com",
	"x-rapidapi-key": process.env.KEY_API,
	"useQueryString": true
});


const getLove = () => {	
	req.end(function (res) {
		if (res.error) throw new Error(res.error);
	
		res.body;
	});	
}

module.exports = { getLove }