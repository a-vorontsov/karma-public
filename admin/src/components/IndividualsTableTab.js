import * as React from "react";
import {useEffect} from "react";
import MaterialTable from 'material-table'

export function IndividualsTableTab() {
    const [individuals, setIndividuals] = React.useState([]);

    useEffect(() => {
        async function fetchData() {
            const usersResponse = (await fetch(process.env.REACT_APP_API_URL + "/admin/individuals"));
            const users = await usersResponse.json();
            console.log(users);
            setIndividuals(users.data.individuals);
        }
        fetchData();
    }, []);

    const toggleBan = async (event, rowData) => {
        if (!window.confirm(rowData.banned ? "Unban " : "Ban " + rowData.firstname + " " + rowData.lastname + "?")) return;
        rowData.banned = !rowData.banned;
        const indivs = individuals.slice();
        indivs.map(individual => individual.id === rowData.id ? {...individual, banned: !individual.banned} : individual);
        setIndividuals(indivs);
        await fetch(process.env.REACT_APP_API_URL + "/admin/toggleBan", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: {individual: rowData}}),
        });
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
                options={{pageSize: 15, pageSizeOptions: [5, 15, 25]}}
                title="Users"
            />
        </div>
    );
}
