import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export function AppDocumentsTab() {
    const classes = useStyles();
    const [document, setDocument] = React.useState('termsAndConditions');
    const [value, setValue] = React.useState('Document text...');

    const handleSelectChange = event => {
        setDocument(event.target.value);
    };

    const handleTextChange = event => {
        setValue(event.target.value);
    };

    return (
        <div className={"tabContainer"}>
            <FormControl className={classes.formControl + " documentSelect"}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Document
                </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={document}
                    onChange={handleSelectChange}
                >
                    <MenuItem value={"termsAndConditions"}>Terms & Conditions</MenuItem>
                    <MenuItem value={"privacyPolicy"}>Privacy Policy</MenuItem>
                    <MenuItem value={30}>Some other option</MenuItem>

                </Select>
            </FormControl>
            <TextField className={"documentTextBox"}
                // id="standard-multiline-flexible"
                label="Contents"
                multiline
                value={value}
                onChange={handleTextChange}
            />
            <Button variant="contained" color="primary" className={"submitButton"}>
                Submit
            </Button>
        </div>
    );
}