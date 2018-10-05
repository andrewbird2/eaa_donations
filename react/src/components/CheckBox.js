import React from "react";
import {Checkbox, FormGroup, HelpBlock} from 'react-bootstrap';

const CheckBox = props => {
    return (
        <FormGroup controlId="fromCheckBox">
            <Checkbox type="text"
                      name={props.name}
                      onChange={props.handleChange}
                      checked={props.value}
            >{props.title}</Checkbox>
            <HelpBlock>{props.helptext}</HelpBlock>
        </FormGroup>
    );
};

export default CheckBox;
