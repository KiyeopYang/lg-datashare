import request from './request';

export const get = (uuid) => request.get(`/invite/${uuid}`);
export const remove = (body) => request.delete('/invite', { data: body });
export const create = (body) => request.post('/invite', body);
