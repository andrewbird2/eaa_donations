import React from 'react';
import Input from "./components/Input";
import Select from "./components/Select";
import ButtonGroup from "./components/ButtonGroup";
import CheckBox from "./components/CheckBox";
import 'react-slidedown/lib/slidedown.css'
import StripeCheckout from "./components/StripeCheckout"
import CurrencyInput from "./components/CurrencyInput"
import APIService from "./services/API"

import {Button, Collapse, ControlLabel} from "react-bootstrap";
import {Elements} from 'react-stripe-elements';

import PaypalExpressBtn from 'react-paypal-express-checkout';

var validator = require("email-validator");

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.apiService = new APIService();
        this.state = {
            donation: {
                preselectedCharity: window.url_charity,  // Hack
                name: "",
                email: "",
                referralSource: null,
                recurring: null,
                allocate: false,
                allocation: {},
                subscribe: false,
                amount: null,
                contribute: false,
                contribution: null,
                paymentMethod: null,
                is_gift: false,
                gift_name: "",
                gift_email: "",
            },
            referralSources: [],
            partnerCharities: []
        };
        console.log(this.apiService);
        this.getCharities();
        this.getReferralSources();
        this.handleInputBase = this.handleInputBase.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputBoolean = this.handleInputBoolean.bind(this);
        this.handleInputInteger = this.handleInputInteger.bind(this);
        this.handleInputCheckBox = this.handleInputCheckBox.bind(this);
        this.handleInputCurrency = this.handleInputCurrency.bind(this);
        this.handleAllocation = this.handleAllocation.bind(this);
        this.handleStripeSubmit = this.handleStripeSubmit.bind(this);
        this.handleBankTransferSubmit = this.handleBankTransferSubmit.bind(this);
    }

    getCharities() {
        this.apiService.getCharities().then((charities) => {
            this.setState({
                partnerCharities: charities
            });
        })
    }

    getReferralSources() {
        this.apiService.getReferralSources().then((sources) => {
            this.setState({
                referralSources: sources
            });
        })
    }

    handleInputBase(name, value) {
        this.setState(
            prevState => ({
                donation: {
                    ...prevState.donation,
                    [name]: value
                }
            })
        );
    }

    handleAllocation(e) {
        let name = e.target.name;
        let value = parseInt(e.target.value);
        value = isNaN(value) ? null : value;
        this.setState(
            prevState => ({
                donation: {
                    ...prevState.donation,
                    allocation: {
                        ...prevState.donation.allocation,
                        [name]: value
                    }
                }
            })
        );
    }

    handleInput(e) {
        this.handleInputBase(e.target.name, e.target.value);
    }

    handleInputBoolean(e) {
        this.handleInputBase(e.target.name, e.target.value === "true");
    }

    handleInputCheckBox(e) {
        this.handleInputBase(e.target.name, e.target.checked);
    }

    handleInputInteger(e) {
        this.handleInputBase(e.target.name, parseInt(e.target.value));
    }

    handleInputCurrency(e) {
        let value = parseInt(e.target.value);
        value = isNaN(value) ? null : value;
        this.handleInputBase(e.target.name, value);
    }

    totalDonation() {
        let total = 0;
        if (this.state.donation.allocate) {
            for (var slug_id in this.state.donation.allocation) {
                total += this.state.donation.allocation[slug_id];
            }
        } else {
            total += this.state.donation.amount
        }
        total += this.state.donation.contribute ? this.state.donation.contribution : 0
        return total
    }

    submitButtonText() {
        return "Donate $".concat(this.totalDonation(), " - ", this.state.donation.recurring ? 'monthly' : 'once off')
    }

    validateLength() {
        const length = this.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    validateEmail() {
        if (this.value.length) {
            return validator.validate(this.value) ? 'success' : 'error';
        }
    }

    handleStripeSubmit(token) {
        console.log(token);
        // let response = await fetch("/charge", {
        //     method: "POST",
        //     headers: {"Content-Type": "text/plain"},
        //     body: token.id
        // });
        //
        // if (response.ok) alert("Purchase Complete!");
    }

    handleBankTransferSubmit() {
        console.log(1);
        // let response = await fetch("/charge", {
        //     method: "POST",
        //     headers: {"Content-Type": "text/plain"},
        //     body: token.id
        // });
        //
        // if (response.ok) alert("Purchase Complete!");
    }

    render() {
        return (
            <form className="container" onSubmit={this.handleFormSubmit}>
                <div className="panel">
                    <legend>Donation Details</legend>
                    <ButtonGroup
                        title={"How often will you be donating?"}
                        name={"recurring"}
                        value={this.state.donation.frequency}
                        handleChange={this.handleInputBoolean}
                        options={[
                            {id: false, value: "One-Time"},
                            {id: true, value: "Monthly"}]}
                    />
                    <ButtonGroup
                        title={"How would you like to allocate your donation?"}
                        name={"allocate"}
                        value={this.state.donation.allocate}
                        handleChange={this.handleInputBoolean}
                        helptext={"We would love to allocate your donation for you!"}
                        options={[
                            {id: false, value: "Where it's needed most"},
                            {id: true, value: "I want to choose"}]}
                    />
                    <ControlLabel>How much would you like to donate?</ControlLabel>
                    <Collapse in={this.state.donation.allocate}>
                        <div>
                            {this.state.partnerCharities.map(partner => {
                                return (
                                    <CurrencyInput
                                        className={"input-group-addon charity-name"}
                                        name={partner.slug_id}
                                        label={partner.value}
                                        value={this.state.donation.allocation[partner.slug_id]}
                                        handleChange={this.handleAllocation}
                                    />
                                )
                            })}
                        </div>
                    </Collapse>
                    {this.state.donation.allocate ? null :
                        <div>
                            <CurrencyInput
                                title={"How much would you like to donate?"}
                                name={"amount"}
                                label={"$"}
                                value={this.state.donation.amount}
                                handleChange={this.handleInputCurrency}
                            />
                        </div>
                    }
                    <CheckBox
                        title={"I would also like to contribute to covering Effective Altruism Australia's running costs"}
                        name={"contribute"}
                        value={this.state.donation.contribute}
                        handleChange={this.handleInputCheckBox}
                    />
                    <Collapse in={this.state.donation.contribute}>
                        <div>
                            <CurrencyInput
                                name={"contribution"}
                                label={"$"}
                                value={this.state.donation.contribution}
                                handleChange={this.handleInputCurrency}
                                helptext={"Thank you! These funds will help cover our administrative and operations costs. " +
                                "As we are not-for-profit organisation, any excess donations will be granted to our partner charities."}
                            />
                        </div>
                    </Collapse>
                    <legend></legend>
                    <CurrencyInput
                        readOnly={true}
                        label={"Total"}
                        value={this.totalDonation()}
                    />

                </div>

                <div className="panel">
                    <legend>Donor Details</legend>
                    <Input
                        inputType={"text"}
                        title={"Full Name"}
                        name={"name"}
                        value={this.state.donation.name}
                        placeholder={"Enter your name"}
                        handleChange={this.handleInput}
                        validationState={this.validateLength}
                        helptext={"Help text goes here"}
                    />
                    <Input
                        inputType={"text"}
                        title={"Email Address"}
                        name={"email"}
                        value={this.state.donation.email}
                        placeholder={"Enter your email address"}
                        handleChange={this.handleInput}
                        validationState={this.validateEmail}
                        helptext={"Help text goes here"}
                    />
                    <Select
                        inputType={"text"}
                        title={"Where did you hear about us?"}
                        name={"referralSource"}
                        value={this.state.donation.referralSource}
                        handleChange={this.handleInputInteger}
                        options={this.state.referralSources}
                    />
                    <CheckBox
                        title={"Send me news and updates"}
                        name={"subscribe"}
                        value={this.state.donation.subscribe}
                        handleChange={this.handleInputCheckBox}
                    />
                </div>

                <div className="panel">
                    <legend>Gift details</legend>
                    <CheckBox
                        title={"Are you making this donation as a gift to someone?"}
                        name={"is_gift"}
                        value={this.state.donation.is_gift}
                        handleChange={this.handleInputCheckBox}
                    />
                    <Collapse in={this.state.donation.is_gift}>
                        <div>
                            <Input
                                inputType={"text"}
                                title={"Recipient Name"}
                                name={"gift_name"}
                                value={this.state.donation.gift_name}
                                placeholder={"Enter recipient name"}
                                handleChange={this.handleInput}
                                validationState={this.validateLength}
                            />
                            <Input
                                inputType={"text"}
                                title={"Recipient Email Address"}
                                name={"gift_email"}
                                value={this.state.donation.gift_email}
                                placeholder={"Enter recipient email address"}
                                handleChange={this.handleInput}
                                validationState={this.validateEmail}
                            />
                        </div>
                    </Collapse>

                </div>


                <div className="panel">
                    <legend>Payment Details</legend>
                    <ButtonGroup
                        title={"How would you like pay?"}
                        name={"paymentMethod"}
                        value={this.state.donation.paymentMethod}
                        handleChange={this.handleInput}
                        options={[
                            {id: 'credit-card', value: "Credit Card"},
                            {id: 'paypal', value: "PayPal"},
                            {id: 'bank-transfer', value: "Bank Transfer"},
                        ]}
                    />
                    <Collapse in={this.state.donation.paymentMethod === 'credit-card'}>
                        <div>
                            <Elements>
                                <StripeCheckout
                                    name={this.state.donation.name}
                                    handleSubmit={this.handleStripeSubmit}
                                    buttonText={this.submitButtonText()}
                                />
                            </Elements>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.donation.paymentMethod === 'paypal'}>
                        <div>
                            <PaypalExpressBtn
                                client={{sandbox: 'AYMCgsY1DjnrVJzUw-se_NOGW8tUKW93nUOHzHOtPTPGSNxxSL8FIYwBaCG0Ul7kGZwIFDDWBSP5os2b'}}
                                total={this.totalDonation()}
                                currency='AUD'
                            />
                        </div>
                    </Collapse>
                    <Collapse in={this.state.donation.paymentMethod === 'bank-transfer'}>
                        <div>
                            <Button bsStyle={"success"}
                                    onClick={this.handleBankTransferSubmit}>{this.submitButtonText()}</Button>
                        </div>
                    </Collapse>
                </div>
            </form>
        );
    }
}

export default Form;
