const stripe = require('stripe')

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