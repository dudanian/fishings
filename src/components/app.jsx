import React from 'react';
import FishTable from './table.jsx';

import * as fish_data from '../../public/fish.json';


export default function App(props) {
    let data = fish_data["Northern Hemisphere"];
    return (<FishTable data={ data } />);
}