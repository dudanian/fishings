import React from 'react';

import images from '../../public/images/*.png';


const FishRow = React.memo(function(props) {
    return (
        <tr>
            <td>{props.fish.name}</td>
            <td><img
                src={images[props.fish.image]}
                alt={props.fish.name} />
            </td>
            <td>{props.fish.price}</td>
            <td>{props.fish.location}</td>
            <td>{props.fish.shadow}</td>
            <td>{props.fish.time}</td>
        </tr>
    );
});

export default function FishTable(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Shadow</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map((v => <FishRow key={v.name} fish={v} />))}
            </tbody>
        </table>
    );
}