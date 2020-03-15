import * as React from "react";
import {useEffect} from "react";

export function HighlightedStats() {
    // const [signups, setSignups] = React.useState(0); // TODO: Get all signups
    const [users, setUsers] = React.useState(0);

    useEffect(() => {
        async function fetchData() {
            const usersResponse = (await fetch(process.env.REACT_APP_API_URL + "/admin/users"));
            const users = await usersResponse.json();
            setUsers(users.data.users.length);
        }
        fetchData();
    }, []);

    return (
        <div className={"highlightContainer"}>
            <div className="highlightedStat">
                <h2>
                    421
                </h2>
                <p>Sign-ups to charity events through Karma</p>
            </div>
            <div className="highlightedStat">
                <h2>
                    {users}
                </h2>
                <p>Users making the world a better place</p>
            </div>
        </div>
    );
}