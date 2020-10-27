import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import React, { Suspense, lazy } from 'react';

import Loading from '../../PresentationalComponents/Loading/Loading';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import messages from '../../Messages';
import { useIntl } from 'react-intl';

const SystemsTable = lazy(() => import(/* webpackChunkName: "SystemsTable" */ '../../PresentationalComponents/SystemsTable/SystemsTable'));

const List = () => {
    const intl = useIntl();

    return <React.Fragment>
        <PageHeader>
            <PageHeaderTitle title={`${intl.formatMessage(messages.insightsHeader)} ${intl.formatMessage(messages.systems).toLowerCase()}`} />
        </PageHeader>
        <Main><Suspense fallback={<Loading />}><SystemsTable /></Suspense></Main>
    </React.Fragment>;

};

List.displayName = 'systems-list';

export default List;
