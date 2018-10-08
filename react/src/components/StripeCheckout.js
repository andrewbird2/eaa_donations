import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import Submit from './Submit'

class StripeCheckout extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    async submit() {
        this.props.handleSubmit(this.props.stripe);
    }

    render() {
        return (
            <div className="checkout">
                <CardElement style={{base: {fontSize: '16px'}}}/>
                <br/>
                <Submit
                    onClick={this.submit}
                    label={this.props.label}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
}

export default injectStripe(StripeCheckout);
