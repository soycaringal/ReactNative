var express = require('express');
var router = express.Router();

/* POST message. */
router.post('/', function(req, res, next) {
  const data = req.body;

  // validate data format
  if (!data 
    || !data.conversation_id
    || !data.message
  ) {
    // return error
    res.json({
      error: true,
      message: 'Data is not in the proper format.'
    })
  }

  let response = '';
  const validateGreet = ['Hello', 'Hi'];
  const validateGoodbye = ['Goodbye', 'bye'];

  // validate response
  if (validateGreet.some(val => data.message.includes(val))) {
    response = 'Welcome to StationFive.'
  } else if (validateGoodbye.some(val => data.message.includes(val))) {
    response = 'Thank you, see you around.'
  } else {
    response = 'Sorry, I don’t understand.'
  }
  
  // return response
  res.json({
      response_id: data.conversation_id,
      response
  })
});

module.exports = router;
