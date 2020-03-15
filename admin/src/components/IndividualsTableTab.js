import * as React from "react";
import {useEffect} from "react";
import MaterialTable from 'material-table'

export function IndividualsTableTab() {
    const [individuals, setIndividuals] = React.useState([]);

    useEffect(() => {
        async function fetchData() {
            const usersResponse = (await fetch(process.env.REACT_APP_API_URL + "/admin/individuals"));
            const users = await usersResponse.json();
            setIndividuals(users.data.individuals);
        }
        fetchData();
    }, []);

    return (
        <div style={{ maxWidth: '100%' }}>
            <MaterialTable
                columns={[
                    { title: 'First name', field: 'firstname' },
                    { title: 'Last name', field: 'lastname' },
                    { title: 'Banned', field: 'banned', type: 'boolean' },
                ]}
                data={individuals}
                options={{pageSize: 15, pageSizeOptions: [5, 15, 25]}}
                title="Users"
            />
        </div>
    );
}