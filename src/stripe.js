import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe('your-publishable-key-here');

// ... further code to handle payments