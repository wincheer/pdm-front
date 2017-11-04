import axios from 'axios';

let base = 'http://localhost:8080';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const queryLogListPage = params => { return axios.post(`${base}/logPageList`, params).then(res => res.data); };

export const queryEmployeeList = () => { return axios.get(`${base}/userList`); };
export const queryEmployeeListPage = params => { return axios.post(`${base}/userPageList`, params).then(res => res.data); };
export const removeUser = params => { return axios.get(`${base}/delUser`, { params: params }); };
export const editUser = params => { return axios.post(`${base}/editUser`, params).then(res => res.data); };

export const queryTemplateList = () => { return axios.get(`${base}/templateList`); };
export const queryTemplateFolderList = params => { return axios.get(`${base}/templateFoderList`, { params: params }); };
export const insertTemplateFolder = params => { return axios.post(`${base}/insertTemplateFolder`, params).then(res => res.data); };
export const removeTemplateFolder = params => { return axios.get(`${base}/removeTemplateFolder`, { params: params }); };

export const queryProjectPageList = params => { return axios.post(`${base}/projectPageList`, params).then(res => res.data); };
export const insertProject = params => { return axios.post(`${base}/insertProject`, params).then(res => res.data); };

export const queryFolderList = params => { return axios.get(`${base}/folderList`, { params: params }); };
export const insertFolder = params => { return axios.post(`${base}/insertFolder`, params).then(res => res.data); };
export const removeFolder = params => { return axios.get(`${base}/removeFolder`, { params: params }); };

export const queryProjectEmployeeList = params => { return axios.get(`${base}/projectEmployeeList`, { params: params }); };
export const editProjectEmployee = params => { return axios.post(`${base}/editEmployeeProject`, params).then(res => res.data); };
export const removeProjectEmployee = params => { return axios.get(`${base}/removeProjectEmployee`, { params: params }); };

export const queryMyProjectList = params => { return axios.get(`${base}/myProjectList`, { params: params }); };

export const quickUpload = params => { return axios.post(`${base}/quickUpload`, params).then(res => res.data); };

//export const queryLogListPage = params => { return axios.get(`${base}/logPageList`, { params: params }); };
