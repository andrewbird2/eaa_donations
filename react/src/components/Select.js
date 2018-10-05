import React from "react";
import {ControlLabel, Drop, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';

const Select = props => {
    return (
        <FormGroup controlId="formControlsSelect">
            <ControlLabel>{props.title}</ControlLabel>
            <FormControl componentClass="select"
                         placeholder={props.placeholder}
                         onChange={props.handleChange}
                         name={props.name}
            >
                <option key={null} value={null}>--------</option>
                {props.options.map(option => {
                    return (
                        <option key={option.id} value={option.id} label={option.value}>
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
