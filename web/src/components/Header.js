import * as React from "react";

export class Header extends React.Component {
    render() {
        return (
            <header>
                <img className={"header-title"} src={process.env.PUBLIC_URL + "/header-title.png"} alt={"Karma"}/>
            </header>
        );
    }
}