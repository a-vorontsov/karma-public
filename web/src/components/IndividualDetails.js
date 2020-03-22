import * as React from "react";

class DetailsEntry extends React.Component {
    render() {
        const {entryKey} = this.props;
        let {entryValue} = this.props;
        if (Date.parse(entryValue) && entryValue.length === 24) { // only parse dates that are proper dates
            entryValue = entryValue.split("T")[0];  // discard time part of date
        }

        return (
            <div className={"detailsSection entry"}>
                <p className={"key"}>{entryKey}</p>
                <p className={"value"}>{entryValue ?? "-"}</p>
            </div>
        )
    }
}


export class IndividualDetails extends React.Component {
    render() {
        const {details} = this.props;
        return (
            <div className={"details"}>
                <div className={"detailsSection"}>
                    <DetailsEntry entryKey={"Username"} entryValue={details?.user.username}/>
                    <DetailsEntry entryKey={"Email"} entryValue={details?.user.email}/>
                    <DetailsEntry entryKey={"Causes"} entryValue={details?.causes.map(cause => cause.title).join(", ")}/>
                </div>
                <hr/>
                <div className={"detailsSection"}>
                    <DetailsEntry entryKey={"Registration date"} entryValue={details?.individual.registrationDate}/>
                    <DetailsEntry entryKey={"DOB"} entryValue={details?.individual.dateOfBirth}/>
                    <DetailsEntry entryKey={"Karma Points"} entryValue={details?.individual.karmaPoints}/>
                    <DetailsEntry entryKey={"Bio"} entryValue={details?.individual.bio}/>
                </div>
                <hr/>
                <div className={"detailsSection"}>
                    <DetailsEntry entryKey={"Address 1"} entryValue={details?.individual?.address.addressLine1}/>
                    <DetailsEntry entryKey={"Address 2"} entryValue={details?.individual?.address.addressLine2}/>
                    <DetailsEntry entryKey={"Town/City"} entryValue={details?.individual?.address.townCity}/>
                    <DetailsEntry entryKey={"Country/State"} entryValue={details?.individual?.address.countryState}/>
                    <DetailsEntry entryKey={"Postcode"} entryValue={details?.individual?.address.postcode}/>
                </div>
                <hr/>
                <div className={"detailsSection"}>
                    <DetailsEntry entryKey={"Upcoming events count"} entryValue={details?.upcomingEvents.length}/>
                    <DetailsEntry entryKey={"Past events count"} entryValue={details?.pastEvents.length}/>
                    <DetailsEntry entryKey={"Upcoming events created"} entryValue={details?.createdEvents.length}/>
                    <DetailsEntry entryKey={"Past events created"} entryValue={details?.createdPastEvents?.length}/>
                </div>
            </div>
        );
    }
}
