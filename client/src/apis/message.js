import request from './request';

export const upload = (body) => request.post('/upload', { data: body });
export const send = (body) => request.post('/message', { data: body });
