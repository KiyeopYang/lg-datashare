import request from './request';

export const get = (uuid) => request.get(`/room/${uuid}`);
export const remove = (uuid) => request.delete(`/room/${uuid}`);
export const create = (body) => request.post('/room', body);
export const getList = () => request.get('/room');
