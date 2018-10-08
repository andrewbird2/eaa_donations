import React from 'react';
import Input from "./components/Input";
import Select from "./components/Select";
import ButtonGroup from "./components/ButtonGroup";
import CheckBox from "./components/CheckBox";
import 'react-slidedown/lib/slidedown.css'
import StripeCheckout from "./components/StripeCheckout"
import CurrencyInput from "./components/CurrencyInput"
import APIService from "./services/API"
import Result from "./Result"
import Submit from "./components/Submit"
import {Alert, Collapse, ControlLabel} from "react-bootstrap";
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
                referral_source: null,
                recurring: "",
                allocate: false,
                allocation: {},
                subscribe: false,
                amount: null,
                contribute: false,
                contribution: null,
                payment_method: "",
                is_gift: false,
                gift: {
                    recipient_name: "",
                    recipient_email: "",
                    personal_message: "",
                },
                stripe_token: null,
            },
            response: {
                bankReference: null,
                success: null,
                errorMessage: '',
            },
            referralSources: [],
            partnerCharities: [],
            submitting: false,
        };
        console.log(this.apiService);
        this.getCharities();
        this.getReferralSources();
        this.handleInputBase = this.handleInputBase.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputBoolean = this.handleInputBoolean.bind(this);
        this.handleInputCheckBox = this.handleInputCheckBox.bind(this);
        this.handleInputCurrency = this.handleInputCurrency.bind(this);
        this.handleAllocationInput = this.handleAllocationInput.bind(this);
        this.handleStripeSubmit = this.handleStripeSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePaypalCancel = this.handlePaypalCancel.bind(this);
        this.handleGiftInput = this.handleGiftInput.bind(this);
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

    handleAllocationInput(e) {
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

    handleGiftInput(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState(
            prevState => ({
                donation: {
                    ...prevState.donation,
                    gift: {
                        ...prevState.donation.gift,
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
        console.log(e.target.value);
        this.handleInputBase(e.target.name, e.target.value === "true");
    }

    handleInputCheckBox(e) {
        this.handleInputBase(e.target.name, e.target.checked);
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
        total += this.state.donation.contribute ? this.state.donation.contribution : 0;
        return total
    }

    CharityText() {
        // if (this.state.donation.allocate) {
        //     for (var slug_id in this.state.donation.allocation) {
        //         total += this.state.donation.allocation[slug_id];
        //     }
        // } else {
        //     total += this.state.donation.amount
        // }
        // total += this.state.donation.contribute ? this.state.donation.contribution : 0;
        // return total
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

    handleSubmit() {
        this.setState({
            submitting: true
        });
        let form = this;
        this.apiService.submit(this.state.donation).then(function (response) {
            form.setState({
                response: response,
                submitting: false,
            })
        });
    }

    async handleStripeSubmit(stripe) {
        this.setState({
            submitting: true
        });
        let token = await stripe.createToken({name: this.state.donation.name});
        console.log(token);
        if (token.error) {
            this.setState({
                response: {
                    success: false,
                    errorMessage: token.error.message
                }
            })
        } else {
            this.handleInputBase('stripe_token', token);
            this.handleSubmit();
        }
        this.setState({
            submitting: false
        });
    }

    handlePaypalCancel() {
        this.setState({
            response: {
                success: false,
                errorMessage: "It looks like you didn't complete the Paypal transaction",
            }
        });
    }

    render() {
        return (
            <div>
                {!this.state.response.success ?
                    <form className="container" onSubmit={this.handleFormSubmit}>
                        <div className="panel">
                            <legend>Donation Details</legend>
                            <ButtonGroup
                                title={"How often will you be donating?"}
                                name={"recurring"}
                                value={this.state.donation.recurring}
                                handleChange={this.handleInputBoolean}
                                options={{
                                    false: "One-Time",
                                    true: "Monthly"
                                }}
                            />
                            <ButtonGroup
                                title={"How would you like to allocate your donation?"}
                                name={"allocate"}
                                value={this.state.donation.allocate}
                                handleChange={this.handleInputBoolean}
                                helptext={"We would love to allocate your donation for you!"}
                                options={{
                                    false: "Where it's needed most",
                                    true: "I want to choose"
                                }}
                            />
                            <ControlLabel>How much would you like to donate?</ControlLabel>
                            <Collapse in={this.state.donation.allocate}>
                                <div>
                                    {this.state.partnerCharities.map(partner => {
                                        return (
                                            <CurrencyInput
                                                className={"input-group-addon charity-name"}
                                                name={partner.id}
                                                label={partner.value}
                                                value={this.state.donation.allocation[partner.id]}
                                                handleChange={this.handleAllocationInput}
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
                                name={"referral_source"}
                                value={this.state.donation.referral_source}
                                handleChange={this.handleInput}
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
                                        name={"recipient_name"}
                                        value={this.state.donation.gift.recipient_name}
                                        placeholder={"Enter recipient name"}
                                        handleChange={this.handleGiftInput}
                                        validationState={this.validateLength}
                                    />
                                    <Input
                                        inputType={"text"}
                                        title={"Recipient Email Address"}
                                        name={"recipient_email"}
                                        value={this.state.donation.gift.recipient_email}
                                        placeholder={"Enter recipient email address"}
                                        handleChange={this.handleGiftInput}
                                        validationState={this.validateEmail}
                                    />
                                    <Input
                                        inputType={"text"}
                                        title={"Personal message (optional)"}
                                        name={"personal_message"}
                                        value={this.state.donation.gift.personal_message}
                                        placeholder={"Enter a personal message"}
                                        handleChange={this.handleGiftInput}
                                        componentClass={"textarea"}
                                        validationState={this.validateLength}

                                    />
                                </div>
                            </Collapse>

                        </div>


                        <div className="panel">
                            <legend>Payment Details</legend>
                            <ButtonGroup
                                title={"How would you like pay?"}
                                name={"payment_method"}
                                value={this.state.donation.payment_method}
                                handleChange={this.handleInput}
                                options={{
                                    'credit-card': 'Credit Card',
                                    'paypal': 'Paypal',
                                    'bank-transfer': 'Bank Transfer'
                                }}
                            />
                            <Collapse in={this.state.donation.payment_method === 'credit-card'}>
                                <div>
                                    <Elements>
                                        <StripeCheckout
                                            name={this.state.donation.name}
                                            handleSubmit={this.handleStripeSubmit}
                                            label={this.submitButtonText()}
                                            disabled={this.state.submitting}
                                        />
                                    </Elements>
                                </div>
                            </Collapse>
                            <Collapse in={this.state.donation.payment_method === 'paypal'}>
                                <div>
                                    <PaypalExpressBtn
                                        client={{sandbox: 'AYMCgsY1DjnrVJzUw-se_NOGW8tUKW93nUOHzHOtPTPGSNxxSL8FIYwBaCG0Ul7kGZwIFDDWBSP5os2b'}}
                                        total={this.totalDonation()}
                                        currency='AUD'
                                        onSuccess=''
                                        onCancel={this.handlePaypalCancel}
                                        onError={this.handlePaypalCancel}
                                    />
                                </div>
                            </Collapse>
                            <Collapse in={this.state.donation.payment_method === 'bank-transfer'}>
                                <div>
                                    <Submit
                                        label={this.submitButtonText()}
                                        onClick={this.handleSubmit}
                                        disabled={this.state.submitting}
                                    />
                                </div>
                            </Collapse>
                            {this.state.response.success === false ?
                                <div>
                                    <br/>
                                    <Alert bsStyle={"warning"}>
                                        <strong>Holy guacamole!</strong> {this.state.response.errorMessage}
                                    </Alert>
                                </div> :
                                null}
                        </div>
                    </form>
                    :
                    <Result
                        name={this.state.donation.name}
                        total={this.totalDonation()}
                        payment_method={this.state.donation.payment_method}
                        recurring={this.state.donation.recurring}
                        bankReference={this.state.response.bankReference}
                    />}
            </div>

        )
            ;
    }
}

export default Form;
