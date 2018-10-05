import React, {Component} from 'react';
import './App.css';
import Form from "./Form"
import {StripeProvider} from "react-stripe-elements";

class App extends Component {

    render() {
        return (
            <StripeProvider apiKey="pk_test_LqCqBrL45H2muETuFyi5QKRH">
                <div className="container">
                    <Form/>
                </div>
            </StripeProvider>
        );
    }
}

export default App;
