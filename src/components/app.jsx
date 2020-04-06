import React from 'react';
import FishTable from './table';
import fish_data from '../../public/fish';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const CATEGORIES = Object.keys(fish_data);
const LOCATIONS = fish_data[CATEGORIES[0]].map(v => v.location).filter((v, i, a) => a.indexOf(v) === i);
const TEMPORALS = ["Leaving", "Coming"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", 'Oct', 'Nov', 'Dec'];


export default function App(props) {

    let [category, setCategory] = React.useState(CATEGORIES[0]);
    let [temporal, setTemporal] = React.useState(null);
    let [location, setLocation] = React.useState(null);
    let [month, setMonth] = React.useState(null);

    // filter down the data
    let data = fish_data[category];

    if (location) {
        data = data.filter(v => v.location === location);
    }
    if (month) {
        data = data.filter(v => v.months[MONTHS.indexOf(month)]);
    }

    if (month && temporal === "Leaving") {
        let i = MONTHS.indexOf(month);
        let j = (i + 1) % MONTHS.length;
        data = data.filter(v => v.months[i] && !v.months[j])
    }
    if (month && temporal === "Coming") {
        let i = MONTHS.indexOf(month);
        let j = (i - 1) % MONTHS.length;
        data = data.filter(v => v.months[i] && !v.months[j])
    }

    return (
        <React.Fragment>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => { if (v) { setCategory(v) } }}
                value={category}
            >
                {CATEGORIES.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setTemporal(v)}
                value={temporal}
            >
                {TEMPORALS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setLocation(v)}
                value={location}
            >
                {LOCATIONS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => setMonth(v)}
                value={month}
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