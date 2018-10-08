import React from "react";
import {ControlLabel, Drop, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

const Select = props => {
    return (
        <FormGroup controlId="formControlsSelect">
            <ControlLabel>{props.title}</ControlLabel>
            <FormControl componentClass="select"
                         placeholder={props.placeholder}
                         name={props.name}
                         value={props.value}
                         onChange={props.handleChange}
            >
                <option key={''} value={''}>--------</option>
                {props.options.map(option => {
                    return (
                        <option key={option.id} value={option.id} onChange={props.handleChange}>
                            {option.value}
                        </option>
                    );
                })}
            </FormControl>
            <HelpBlock>{props.helptext}</HelpBlock>
        </FormGroup>
    );
};

export default Select;
