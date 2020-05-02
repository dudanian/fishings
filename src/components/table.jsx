import React from 'react';

import images from '../../public/images/*.png';


const Row = React.memo(function (props) {
    return (
        <tr>
            <td>{props.data.name}</td>
            <td><img
                src={images[props.data.image]}
                alt={props.data.name} />
            </td>
            <td>{props.data.price}</td>
            <td>{props.data.location}</td>
            {props.data.shadow && <td>{props.data.shadow}</td>}
            <td>{props.data.time.join(' - ')}</td>
        </tr>
    );
});

export default function Table(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Location</th>
                    {props.isFish && <th>Shadow</th>}
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map((v => <Row key={v.name} data={v} />))}
            </tbody>
        </table>
    );
}