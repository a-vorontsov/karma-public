import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {AppDocumentsTab} from "./AppDocumentsTab"

class TabPanel extends React.Component {
    render() {
        const {children, value, index, ...other} = this.props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }
}

export function TabView() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const a11yProps = index => ({
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    });

    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} className={"tabView"}>
                    <Tab label="Statistics" {...a11yProps(0)} />
                    <Tab label="User management" {...a11yProps(1)} />
                    <Tab label="T&C and Privacy Policy" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <AppDocumentsTab/>
                {/*<p>Graphs and stuff</p>*/}
            </TabPanel>
            <TabPanel value={value} index={1}>
                <p>Table of users w/ ban button goes here</p>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AppDocumentsTab/>
            </TabPanel>
        </div>
    );
}
