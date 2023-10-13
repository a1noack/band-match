const express = require('express')
const stripe = require('stripe')('sk_test_51Nyet8FSTpMtfSJn18DbFYsFV6s4RCLAm6oY7hBH5zE1H5wZBuMiwe6FXQP0E9VSYPUe7myLe33LSYIR2QHeFyFm00xTIu8eYB');

const app = express();

app.use(express.json());

app.post('/charge', async (req, res) => {
  const { amount, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: token.id,
      description: 'Charge for test@example.com',
    });

    res.send('Payment successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Payment failed');
  }
});




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