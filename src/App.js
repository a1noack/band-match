// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './ProductPage';
import ButtonsComponent from './ButtonsComponent';
// import DesignPage from './DesignPage';
// import CheckoutPage from './CheckoutPage';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<ButtonsComponent/>} />
            <Route path="/products" component={ProductPage} />
        </Routes>
      {/*<Route path="/design" component={DesignPage} />*/}
      {/*<Route path="/checkout" component={CheckoutPage} />*/}
    </Router>
  );
}

export default App;
