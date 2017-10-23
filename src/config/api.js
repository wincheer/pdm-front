import axios from 'axios';

let base = 'http://localhost:8080';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const queryLogListPage = params => { return axios.post(`${base}/logPageList`, params).then(res => res.data); };

//export const queryLogListPage = params => { return axios.get(`${base}/logPageList`, { params: params }); };
