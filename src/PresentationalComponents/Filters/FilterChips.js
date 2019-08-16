import React from 'react';
import { Button, Chip, ChipGroup, ChipGroupToolbarItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { FILTER_CATEGORIES } from '../../AppConstants';

const FilterChips = (props) => {
    const { filters } = props;
    const localFilters = { ...filters };
    delete localFilters.text;
    delete localFilters.impacting;
    delete localFilters.reports_shown;
    delete localFilters.topic;
    const prunedFilters = Object.entries(localFilters);

    return prunedFilters.length > 0 && <>
        <ChipGroup withToolbar>
            { prunedFilters.map(item => {
                const category = FILTER_CATEGORIES.find(category => category.urlParam === item[0]);
                return <ChipGroupToolbarItem key={ item[0] } categoryName={ category.title }>
                    { item[1].split(',').map(value => {
                        const categoryValue = category.values.find(values => values.value === String(value));
                        return <Chip key={ value } onClick={ () => props.removeFilter(category.urlParam, categoryValue.value) }>
                            { categoryValue.label }
                        </Chip>;
                    }) }
                </ChipGroupToolbarItem>;
            }) }
        </ChipGroup>
        <Button variant="link" onClick={ () => props.removeAllFilters() }>
            Clear filters
        </Button>
    </>;
};

FilterChips.propTypes = {
    filters: PropTypes.object,
    removeFilter: PropTypes.func,
    removeAllFilters: PropTypes.func
};

export default FilterChips;
