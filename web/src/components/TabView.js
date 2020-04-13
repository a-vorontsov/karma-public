import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {AppDocumentsTab} from "./AppDocumentsTab"
import {IndividualsTableTab} from "./IndividualsTableTab";

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
                    <Tab label="Links" {...a11yProps(0)} />
                    <Tab label="User management" {...a11yProps(1)} />
                    <Tab label="T&C and Privacy Policy" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ul className={'links'}>
                    <li>Android Application - <a href={'https://github.com/a-vorontsov/karma-public/releases/download/1.0.0/KARMA.apk'}>https://github.com/a-vorontsov/karma-public/releases/download/1.0.0/KARMA.apk</a></li>
                    <li>iOS Application - <a href={'https://testflight.apple.com/join/2mDl8SbS'}>https://testflight.apple.com/join/2mDl8SbS</a></li>
                    <li>KARMA Administrator Website - <a href={'https://karma.laane.xyz/admin'}>https://karma.laane.xyz/admin</a></li>
                    <li>API - <a href={'https://karma.laane.xyz/api'}>https://karma.laane.xyz/api</a></li>
                    <li>Documentation - <a href={'https://karma.laane.xyz/docs'}>https://karma.laane.xyz/docs</a></li>
                    <li>Logs - <a href={'https://karma.laane.xyz/logs'}>https://karma.laane.xyz/logs</a></li>
                    <li>Test coverage - <a href={'https://karma.laane.xyz/coverage'}>https://karma.laane.xyz/coverage</a></li>
                </ul>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <IndividualsTableTab/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AppDocumentsTab/>
            </TabPanel>
        </div>
    );
}
