import React from 'react';
import { ConsumersPropsInterface } from './contract';

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const ConsumerList: React.FC<ConsumersPropsInterface> = ({ consumers }) => {
    const data = [];
    for (const id in consumers) {
        const consumer = consumers[id];
        data.push(
            <tr key={consumer.id}>
                <td className={'text-break'}>{consumer.id}</td>
                <td>
                    {consumer.resources.pid} /
                    <br />
                    {consumer.resources.hostname}
                </td>
                <td>{consumer.resources.ipAddress.join('<br />')}</td>
                <td>{consumer.rates.processing}</td>
                <td>{consumer.rates.acknowledged}</td>
                <td>{consumer.rates.unacknowledged}</td>
                <td>{consumer.resources.cpu.percentage}</td>
                <td>{formatBytes(consumer.resources.ram.usage.rss)}</td>
                <td>{formatBytes(consumer.resources.ram.free)}</td>
                <td>{formatBytes(consumer.resources.ram.total)}</td>
            </tr>
        );
    }

    if (!data.length) {
        return <p>No existing consumers yet.</p>;
    }

    return (
        <>
            <p>
                Note: Sometimes the CPU usage is not accurate and does not match the real CPU usage. Therefore it should
                be regarded just as an indicative value.
            </p>
            <table className={'table .consumers'}>
                <thead className={'thead-light'}>
                    <tr>
                        <th rowSpan={3}>ID</th>
                        <th rowSpan={3}>
                            PID /
                            <br />
                            Hostname
                        </th>
                        <th rowSpan={3}>
                            IP
                            <br />
                            Address
                        </th>
                        <th rowSpan={3}>
                            Processing <br />
                            msg/sec
                        </th>
                        <th rowSpan={3}>
                            Acks <br />
                            msg/sec
                        </th>
                        <th rowSpan={3}>
                            Unacks <br />
                            msg/sec
                        </th>
                        <th colSpan={5}>Resources</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>
                            CPU <br /> (%)
                        </th>
                        <th colSpan={3}>Memory</th>
                    </tr>
                    <tr>
                        <th>Usage</th>
                        <th>Free</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>{data}</tbody>
            </table>
        </>
    );
};

const Consumers: React.FC<ConsumersPropsInterface> = (props) => {
    return (
        <div className={'consumers'}>
            <h3>Consumers</h3>
            <ConsumerList {...props} />
        </div>
    );
};

export default Consumers;
