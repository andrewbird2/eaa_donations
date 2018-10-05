import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Button} from 'react-bootstrap';

class StripeCheckout extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    async submit() {
        let token = await this.props.stripe.createToken({name: this.props.name});
        this.props.handleSubmit(token);
    }

    render() {
        return (
            <div className="checkout">
                <CardElement style={{base: {fontSize: '16px'}}}/>
                <br/>
                <Button bsStyle={"success"} onClick={this.submit}>{this.props.buttonText}</Button>
            </div>
        );
    }
}

export default injectStripe(StripeCheckout);