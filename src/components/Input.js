import React from 'react'
import { NoSsr } from '@material-ui/core'
import { 
    TextField
} from '@material-ui/core'
import {
    makeStyles
} from '@material-ui/core/styles'
import styled from 'styled-components';
const StyledTextField = styled(TextField)`
  label.Mui-focused {
    color: #0072AA;
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: gray;
    }
    &:hover fieldset {
      border-color: gray;
    }
    &.Mui-focused fieldset {
      border-color: #0072AA;
    }
  }
`;

const useStyles = makeStyles( theme => ({
    inputLabel: {
        background: 'white'
        // background: '#E8F1EC'
    },
    formControl: {
        marginTop: 16,
        minWidth: '100%',
        maxWidth: 'inherit',
    }
}))

const Input = (props) => {
    const { label, name, value, onChange, id, disabled, type, error, margin = 'normal' } = props;
    const classes = useStyles()
    return (
        <NoSsr>
            <StyledTextField
                id={ id ? id : '' }
                label={label ? label : ''}
                name={name}
                fullWidth
                value={ value ? value : '' }
                type={ type ? type : '' }
                // onChange={ onChange ? onChange : false }
                // margin="normal"
                margin={margin}
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                    className: classes.inputLabel
                }}
                disabled={disabled}
                error={error}
                {...props}
            />
        </NoSsr>
    )
}

export default Input
