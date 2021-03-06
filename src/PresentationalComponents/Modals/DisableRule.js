import React, { useState } from 'react';
import { setAck, setRule, setSystem } from '../../AppActions';

import API from '../../Utilities/Api';
import { BASE_URL } from '../../AppConstants';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Checkbox } from '@patternfly/react-core/dist/js/components/Checkbox/Checkbox';
import { Form } from '@patternfly/react-core/dist/js/components/Form/Form';
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';
import PropTypes from 'prop-types';
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput/TextInput';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';

const DisableRule = ({ handleModalToggle, intl, isModalOpen, host, hosts, rule, afterFn, setAck, addNotification, setSystem, setRule,
    selectedTags }) => {
    const [justification, setJustificaton] = useState('');
    const [singleSystem, setSingleSystem] = useState(host !== undefined || hosts.length > 0);

    const bulkHostActions = async () => {
        const data = { systems: hosts, justification };
        try {
            const response = await API.post(`${BASE_URL}/rule/${rule.rule_id}/ack_hosts/`,
                {}, data);
            if (selectedTags.length > 0) {
                afterFn && afterFn();
            } else {
                setSystem({ host_ids: response.data.host_ids });
                setRule({ ...rule, hosts_acked_count: response.data.count + rule.hosts_acked_count });
            }

        } catch (error) {
            addNotification({ variant: 'danger', dismissable: true, title: intl.formatMessage(messages.error), description: `${error}` });
        }
    };

    const disableRule = async () => {
        if (rule.rule_status === 'enabled' && !hosts.length) {
            const options = singleSystem
                ? { type: 'HOST', options: { rule: rule.rule_id, system_uuid: host.id, justification } }
                : { type: 'RULE', options: { rule_id: rule.rule_id, ...(justification && { justification }) } };
            try {
                await setAck(options);
                addNotification({
                    variant: 'success', timeout: true, dismissable: true, title: intl.formatMessage(messages.ruleSuccessfullyDisabled)
                });
                setJustificaton('');
                afterFn && afterFn();
            } catch (error) {
                addNotification({ variant: 'danger', dismissable: true, title: intl.formatMessage(messages.error), description: `${error}` });
            }
        } else {
            bulkHostActions();
        }

        handleModalToggle(false);
    };

    return <Modal
        variant='small'
        title={intl.formatMessage(messages.disableRule)}
        isOpen={isModalOpen}
        onClose={() => { handleModalToggle(false); setJustificaton(''); }}
        actions={[
            <Button key="confirm" variant="primary" onClick={() => disableRule()}
                ouiaId="confirm">
                {intl.formatMessage(messages.save)}
            </Button>,
            <Button key="cancel" variant="link" onClick={() => { handleModalToggle(false); setJustificaton(''); }}
                ouiaId="cancel">
                {intl.formatMessage(messages.cancel)}
            </Button>
        ]}
    >
        {intl.formatMessage(messages.disableRuleBody)}
        <Form>
            <FormGroup fieldId='blank-form' />
            {(host !== undefined || hosts.length > 0) && <FormGroup fieldId='disable-rule-one-system'>
                <Checkbox
                    isChecked={singleSystem}
                    onChange={() => { setSingleSystem(!singleSystem); }}
                    label={hosts.length ? intl.formatMessage(messages.disableRuleForSystems) : intl.formatMessage(messages.disableRuleSingleSystem)}
                    id="disable-rule-one-system"
                    name="disable-rule-one-system" />
            </FormGroup>}
            <FormGroup
                label={intl.formatMessage(messages.justificationNote)}
                fieldId="disable-rule-justification">
                <TextInput
                    type="text"
                    id="disable-rule-justification"
                    aria-describedby="disable-rule-justification"
                    value={justification}
                    onChange={(text) => setJustificaton(text)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), disableRule())}
                />
            </FormGroup>
        </Form>
    </Modal>;
};

DisableRule.propTypes = {
    isModalOpen: PropTypes.bool,
    host: PropTypes.object,
    handleModalToggle: PropTypes.func,
    intl: PropTypes.any,
    rule: PropTypes.object,
    afterFn: PropTypes.func,
    setAck: PropTypes.func,
    hosts: PropTypes.array,
    addNotification: PropTypes.func,
    setRule: PropTypes.func,
    setSystem: PropTypes.func,
    selectedTags: PropTypes.array
};

DisableRule.defaultProps = {
    isModalOpen: false,
    handleModalToggle: () => undefined,
    system: undefined,
    rule: {},
    afterFn: () => undefined,
    host: undefined,
    hosts: []
};

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data)),
    setAck: data => dispatch(setAck(data)),
    setRule: data => dispatch(setRule(data)),
    setSystem: data => dispatch(setSystem(data))
});

export default injectIntl(connect(({ AdvisorStore }) => ({
    selectedTags: AdvisorStore.selectedTags
}), mapDispatchToProps)(DisableRule));
