import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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
    const [document, setDocument] = React.useState('terms');
    const [changed, setChanged] = React.useState(true);
    const [value, setValue] = React.useState('Document text...');

    const handleSelectChange = event => {
        setDocument(event.target.value);
        if (event.target.value !== document) {
            setChanged(true);
        }
    };

    const handleTextChange = event => {
        setValue(event.target.value);
    };

    const submitChange = event => {
        fetch(process.env.REACT_APP_API_URL + "/information", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: document, content: value})
        })
    };

    useEffect(() => {
        async function fetchTerms() {
            const type = document;
            const termsResponse = (await fetch(process.env.REACT_APP_API_URL + "/information?type=" + type));
            const terms = await termsResponse.json();
            setValue(terms.data.information.content);
        }
        if (changed) {
            fetchTerms();
            setChanged(false);
        }
    }, [changed, document]);


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
                    <MenuItem value={"terms"}>Terms & Conditions</MenuItem>
                    <MenuItem value={"privacyPolicy"}>Privacy Policy</MenuItem>
                    <MenuItem value={"about"}>About</MenuItem>

                </Select>
            </FormControl>
            <TextField className={"documentTextBox"}
                // id="standard-multiline-flexible"
                label="Contents"
                multiline
                value={value}
                onChange={handleTextChange}
            />
            <Button variant="contained" color="primary" className={"submitButton"} onClick={submitChange}>
                Update
            </Button>
        </div>
    );
}