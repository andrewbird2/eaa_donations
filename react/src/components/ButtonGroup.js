import React from "react";
import {ButtonToolbar, ControlLabel, FormGroup, HelpBlock, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';

const ButtonGroup = props => {
    return (
        <FormGroup controlId="formBasicText"
                   validationState={props.validationState}
        >
            <ControlLabel>{props.title}</ControlLabel>
            <ButtonToolbar>
                <ToggleButtonGroup type="radio" name={props.name}
                                   bsSize={props.size}
                                   value={props.value.toString()}>
                    {
                        Object.keys(props.options).map((key, index) => {
                                return <ToggleButton value={key} onChange={props.handleChange}>{props.options[key]}</ToggleButton>
                            }
                        )
                    }
                </ToggleButtonGroup>
            </ButtonToolbar>
            <HelpBlock>{props.helptext}</HelpBlock>
        </FormGroup>
    );
};

export default ButtonGroup;
