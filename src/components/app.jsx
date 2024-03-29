import React from 'react';
import FishTable from './table';
import fish_data from '../../public/fish';
import bugs_data from '../../public/bugs';
import creatures_data from '../../public/creatures';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { createTheme, ThemeProvider } from '@mui/material/styles';


// No more ripple, on the whole application 💣!
const theme = createTheme({
    components: {
        MuiToggleButton: {
            defaultProps: {
                disableRipple: true,
            },
        }
    },
});

const GROUPS = ["Fish", "Bugs", "Creatures"];
const HEMISPHERES = ["Northern", "Southern"];
const FISH_LOCATIONS = [...new Set(fish_data.map(v => v.location))].sort();
const BUGS_LOCATIONS = [...new Set(bugs_data.map(v => v.location))].sort();
const TEMPORALS = ["Leaving", "Coming"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", 'Oct', 'Nov', 'Dec'];


export default function App(props) {

    let [group, setGroup] = React.useState(GROUPS[0]);
    let [hemisphere, setHemisphere] = React.useState(HEMISPHERES[0]);
    let [temporal, setTemporal] = React.useState(null);
    let [fishLocation, setFishLocation] = React.useState(null);
    let [bugsLocation, setBugsLocation] = React.useState(null);
    let [month, setMonth] = React.useState(null);

    let data, location, setLocation, LOCATIONS

    if (group === "Fish") {
        data = fish_data
        location = fishLocation
        setLocation = setFishLocation
        LOCATIONS = FISH_LOCATIONS
    } else if (group === "Bugs") {
        data = bugs_data
        location = bugsLocation
        setLocation = setBugsLocation
        LOCATIONS = BUGS_LOCATIONS
    } else {
        data = creatures_data
        location = null
        setLocation = () => {}
        LOCATIONS = ["Ocean"]
    }

    // filter down the data
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
        <ThemeProvider theme={theme} >
            <div>Group</div>
            <ToggleButtonGroup
                exclusive
                onChange={(_, v) => { if (v) { setGroup(v) } }}
                value={group}
                size='small'
            >
                {GROUPS.map((v, i) => (
                    <ToggleButton
                        key={i}
                        value={v}>
                        {v}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
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
            <br />
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
            <FishTable hasShadow={data !== bugs_data} hasPattern={data === creatures_data} hasLocation={data !== creatures_data} data={data} />
        </ThemeProvider>
    );
}