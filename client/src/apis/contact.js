import request from './request';

export const update = (body) => request.patch('/contact', body);
export const remove = (body) => request.delete('/contact', { data: body });
export const create = (body) => request.post('/contact', body);
export const getList = (uuid) =>
  request.get(uuid ? `/contact/${uuid}` : '/contact');
