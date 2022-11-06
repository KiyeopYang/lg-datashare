import request from './request';

export const login = (body) => request.post('/user/login', body);
export const updateToken = (body) => request.patch('/user/token', body);
export const get = (uuid) => request.get(`/user/${uuid}`);
export const update = (uuid, body) => request.patch(`/user/${uuid}`, body);
export const remove = (uuid) => request.delete(`/user/${uuid}`);
export const create = (body) => request.post('/user', body);
export const getList = () => request.get('/user');
