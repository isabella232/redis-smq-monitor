import axios from 'axios';
import { API_URL } from './index';

export const requeueDeadLetteredMessage = async (
    ns: string,
    queueName: string,
    messageId: string,
    sequenceId: number
) => {
    return axios.post(
        `${API_URL}/api/queues/${queueName}/ns/${ns}/dead-lettered-messages/${messageId}/requeue?sequenceId=${sequenceId}`
    );
};

export const requeueAcknowledgedMessage = async (
    ns: string,
    queueName: string,
    messageId: string,
    sequenceId: number
) => {
    return axios.post(
        `${API_URL}/api/queues/${queueName}/ns/${ns}/acknowledged-messages/${messageId}/requeue?sequenceId=${sequenceId}`
    );
};

export const requeueDeadLetteredMessageWithPriority = async (
    ns: string,
    queueName: string,
    messageId: string,
    sequenceId: number,
    priority: number
) => {
    return axios.post(
        `${API_URL}/api/queues/${queueName}/ns/${ns}/dead-lettered-messages/${messageId}/requeue?sequenceId=${sequenceId}&priority=${priority}`
    );
};

export const requeueAcknowledgedMessageWithPriority = async (
    ns: string,
    queueName: string,
    messageId: string,
    sequenceId: number,
    priority: number
) => {
    return axios.post(
        `${API_URL}/api/queues/${queueName}/ns/${ns}/acknowledged-messages/${messageId}/requeue?sequenceId=${sequenceId}&priority=${priority}`
    );
};
