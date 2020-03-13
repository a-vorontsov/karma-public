import * as React from "react";

export class HighlightedStats extends React.Component {
    render() {
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
                         50
                    </h2>
                    <p>Users making the world a better place</p>
                </div>
            </div>
        );
    }
}