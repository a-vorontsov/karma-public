import * as React from "react";

export class Header extends React.Component {
    render() {
        return (
            <header>
                <img className={"header-title"} src={"header-title.png"} alt={"Karma"}/>
            </header>
        );
    }
}