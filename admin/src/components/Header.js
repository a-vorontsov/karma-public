import * as React from "react";

export class Header extends React.Component {
    render() {
        return (
            <header>
                <img className={"logo"} src={"favicon.ico"} alt={"Karma"}/>
                <h1>Karma, brother</h1>
            </header>
        );
    }
}