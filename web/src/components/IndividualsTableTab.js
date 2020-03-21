import * as React from "react";
import {useEffect} from "react";
import MaterialTable from 'material-table'
import {IndividualDetails} from "./IndividualDetails";

export function IndividualsTableTab() {
    const [individuals, setIndividuals] = React.useState([]);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        async function fetchData() {
            const usersResponse = (await fetch(process.env.REACT_APP_API_URL + "/admin/individuals"));
            const users = await usersResponse.json();
            setIndividuals(users.data.individuals);
        }
        fetchData();
    }, []);

    const toggleBan = (event, rowData) => {
        if (!window.confirm((rowData.banned ? "Unban " : "Ban ") + rowData.firstname + " " + rowData.lastname + "?")) return;
        fetch(process.env.REACT_APP_API_URL + "/admin/toggleBan", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: {individual: rowData}}),
        });

        rowData.banned = !rowData.banned;
        const indivs = individuals.slice();
        indivs.map(individual => individual.id === rowData.id ? {...individual, banned: !individual.banned} : individual);
        setIndividuals(indivs);
    };

    const fetchProfileDetails = async (profile) => {
        const details = await fetch(process.env.REACT_APP_API_URL + "/profile?userId=" + profile.userId)
            .then(res => res.json());
        profile.details = details.data;
        const indivs = individuals.slice();
        indivs.map(individual => individual.id === profile.id ? {...individual, details} : individual);
        setIndividuals(individuals);
        forceUpdate();
    };

    return (
        <div>
            <MaterialTable
                columns={[
                    { title: 'First name', field: 'firstname' },
                    { title: 'Last name', field: 'lastname' },
                    { title: 'Phone', field: 'phone' },
                    { title: 'Gender', field: 'gender' },
                    { title: 'Banned', field: 'banned', type: 'boolean' },
                ]}
                actions={[
                    (rowData) => ({
                        icon: 'not_interested',
                        tooltip: rowData.banned ? 'Unban user' : 'Ban User',
                        onClick: toggleBan,
                    })
                ]}
                data={individuals}
                options={{pageSize: 15, pageSizeOptions: [5, 15, 25, 50]}}

                detailPanel={
                    rowData => {
                        if (!rowData.details) fetchProfileDetails(rowData);
                        return <IndividualDetails details={rowData.details}/>
                    }
                }

                onRowClick={(event, rowData, togglePanel) => {
                    togglePanel();
                }}

                title="Users"
            />
        </div>
    );
}
