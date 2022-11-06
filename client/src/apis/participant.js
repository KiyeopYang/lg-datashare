import request from './request';

export const get = (uuid) => request.get(`/participant/${uuid}`);
export const remove = (body) => request.delete('/participant', { data: body });
export const create = (body) => request.post('/participant', body);
