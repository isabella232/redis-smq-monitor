import React, { useCallback, useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import {
    getGlobalAcknowledgedTimeSeries,
    getGlobalDeadLetteredTimeSeries,
    getGlobalPublishedTimeSeries
} from '../../transport/http/api/time-series';
import TimeSeriesChart from '../common/TimeSeriesChart/TimeSeriesChart';
import useUrlParams from '../../hooks/useUrlParams';

enum ENavigationTab {
    ACKNOWLEDGED = 'acknowledged',
    DEAD_LETTERED = 'dead-lettered',
    PUBLISHED = 'published'
}

const Home: React.FC<RouteComponentProps> = ({ location }) => {
    const { getUrlParam, setUrlParam } = useUrlParams();

    const activeTab = useMemo(() => getUrlParam('rates') ?? ENavigationTab.ACKNOWLEDGED, [
        location.pathname,
        location.search
    ]);

    const FetchAcknowledgedTimeSeries = useCallback(
        (from: number, to: number) => () => getGlobalAcknowledgedTimeSeries(from, to),
        []
    );

    const FetchDeadLetteredTimeSeries = useCallback(
        (from: number, to: number) => () => getGlobalDeadLetteredTimeSeries(from, to),
        []
    );

    const FetchPublishedTimeSeries = useCallback(
        (from: number, to: number) => () => getGlobalPublishedTimeSeries(from, to),
        []
    );

    return (
        <>
            <h1 className={'display-4'}>Global Rates</h1>
            <p>
                The following metrics are gathered from all existing queues in the system. Select a specific queue from
                the queue listing, to view its metrics.
            </p>
            <Nav variant="pills" className={'mb-4'}>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => setUrlParam('rates', ENavigationTab.ACKNOWLEDGED)}
                        active={activeTab === ENavigationTab.ACKNOWLEDGED}
                    >
                        Acknowledged
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => setUrlParam('rates', ENavigationTab.DEAD_LETTERED)}
                        active={activeTab === ENavigationTab.DEAD_LETTERED}
                    >
                        Dead-lettered
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        onClick={() => setUrlParam('rates', ENavigationTab.PUBLISHED)}
                        active={activeTab === ENavigationTab.PUBLISHED}
                    >
                        Published
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            {activeTab === ENavigationTab.ACKNOWLEDGED && (
                <TimeSeriesChart
                    label={'Acknowledged (global)'}
                    scale={'messages'}
                    stream={`streamGlobalAcknowledged`}
                    FetchTimeSeriesRequestFactory={FetchAcknowledgedTimeSeries}
                />
            )}
            {activeTab === ENavigationTab.DEAD_LETTERED && (
                <TimeSeriesChart
                    label={'Dead-lettered (global)'}
                    scale={'messages'}
                    stream={`streamGlobalDeadLettered`}
                    FetchTimeSeriesRequestFactory={FetchDeadLetteredTimeSeries}
                />
            )}
            {activeTab === ENavigationTab.PUBLISHED && (
                <TimeSeriesChart
                    label={'Published (global)'}
                    scale={'messages'}
                    stream={`streamGlobalPublished`}
                    FetchTimeSeriesRequestFactory={FetchPublishedTimeSeries}
                />
            )}
        </>
    );
};

export default Home;
