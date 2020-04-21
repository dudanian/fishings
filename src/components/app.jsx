import React from 'react';
import FishTable from './table';
import fish_data from '../../public/fish';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const HEMISPHERES = ["Northern", "Southern"];
const LOCATIONS = [...new Set(fish_data.map(v => v.location))].sort();
const TEMPORALS = ["Leaving", "Coming"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", 'Oct', 'Nov', 'Dec'];


export default function App(props) {

    let [hemisphere, setHemisphere] = React.useState(HEMISPHERES[0]);
    let [temporal, setTemporal] = React.useState(null);
    let [location, setLocation] = React.useState(null);
    let [month, setMonth] = React.useState(null);

    // filter down the data
    let data = fish_data;

    if (location) {
        data = data.filter(v => v.location === location);
    }
    if (month) {
        let i = MONTHS.indexOf(month);
        data = data.filter(v => v.months[hemisphere][i]);

        if (temporal === "Leaving") {
            let j = (i + 1) % MONTHS.length;
            data = data.filter(v => !v.months[hemisphere][j]);
        } else if (temporal === "Coming") {
            let j = (i - 1 + MONTHS.length) % MONTHS.length;
            data = data.filter(v => !v.months[hemisphere][j]);
        }
    }



    return (
        <React.Fragment>
            <div>Hemisphere</div>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => { if (v) { setHemisphere(v) } }}
                value={hemisphere}
                size='small'
            >
                {HEMISPHERES.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <div>Location</div>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setLocation(v)}
                value={location}
                size='small'
            >
                {LOCATIONS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <div>Month</div>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setTemporal(v)}
                value={temporal}
                size='small'
            >
                {TEMPORALS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <br/>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setMonth(v)}
                value={month}
                size='small'
            >
                {MONTHS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <FishTable data={data} />
        </React.Fragment>
    );
}