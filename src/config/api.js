import axios from 'axios';

let base = 'http://localhost:8080';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const queryLogListPage = params => { return axios.post(`${base}/logPageList`, params).then(res => res.data); };

export const queryEmployeeListPage = params => { return axios.post(`${base}/userPageList`, params).then(res => res.data); };

export const removeUser = params => { return axios.get(`${base}/delUser`, { params: params }); };

export const editUser = params => { return axios.post(`${base}/editUser`, params).then(res => res.data); };

export const queryTemplateList = () => { return axios.get(`${base}/templateList`); };

export const queryTemplateFolderList = params => { return axios.get(`${base}/templateFoderList`, { params: params }); };

export const insertTemplateFolder = params => { return axios.post(`${base}/insertTemplateFolder`, params).then(res => res.data); };

export const removeTemplateFolder = params => { return axios.get(`${base}/removeTemplateFolder`, { params: params }); };


//export const queryLogListPage = params => { return axios.get(`${base}/logPageList`, { params: params }); };
