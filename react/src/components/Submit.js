import React from "react";
import {Button} from 'react-bootstrap';

const Submit = props => {
    return (
        <Button
            bsStyle={"success"}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.label}
        </Button>
    );
};

export default Submit;
