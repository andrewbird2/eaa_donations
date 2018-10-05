import React from "react";
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

const Input = props => {
    return (
        <FormGroup controlId="formBasicText" validationState={props.validationState()}>
            <ControlLabel>{props.title}</ControlLabel>
            <FormControl
                inputType={"text"}
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
                {...props}
            />
            <FormControl.Feedback/>
            <HelpBlock>{props.helptext}</HelpBlock>
        </FormGroup>
    );
};

export default Input;
