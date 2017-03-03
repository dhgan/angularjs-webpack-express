var express = require('express');
var router = express.Router();

/* GET page1 page. */
router.get('/', function(req, res) {
	res.render('page1');
});

module.exports = router;