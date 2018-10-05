import React from "react";
import {FormControl, FormGroup, HelpBlock, InputGroup} from 'react-bootstrap';

const CurrencyInput = props => {
    return (
        <FormGroup>
            <InputGroup>
                <InputGroup.Addon bsClass={props.className || 'input-group-addon'}>{props.label}</InputGroup.Addon>
                <FormControl
                    readOnly={props.readOnly}
                    controlId={props.name}
                    inputType={"text"}
                    name={props.name}
                    value={props.value === null ? '' : props.value}
                    onChange={props.handleChange}
                    placeholder={"Please enter an amount"}
                />
                <InputGroup.Addon>.00</InputGroup.Addon>
            </InputGroup>
            <HelpBlock>{props.helptext}</HelpBlock>
        </FormGroup>
    );
};

export default CurrencyInput;
