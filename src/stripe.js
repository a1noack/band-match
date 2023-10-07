const stripe = require('stripe')

const apiKey = '<pk_test_51Nyet8FSTpMtfSJnMFNRnK1SMKx28yj7DsxKdxf00cFrGxTdpA4jqwfJyNHQAjfTOsS9E03DfISUDZaKL6OhH9HO00FH7nCfVd>'
const secretKey = '<sk_test_51Nyet8FSTpMtfSJng62XlvDYYrCckgqi4qZodyEweEfYZHH1967EhlkPooMdHzwgmeMNJnON7LLrDzHXKZmHS2Pj00tUNrZia6>'

stripe.setApiKey(apiKey, secretKey)




// app.post('/charge', async (req, res) => {
//   const { amount, token } = req.body;
//
//   try {
//     const charge = await stripe.charges.create({
//       amount,
//       currency: 'usd',
//       source: token.id,
//       description: 'Charge for test@example.com',
//     });
//
//     res.send('Payment successful');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Payment failed');
//   }
// });
// ... further code to handle payments