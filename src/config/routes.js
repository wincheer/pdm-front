import Login from '../view/Login.vue'
import Todo from '../view/Todo.vue'
import NotFound from '../view/PageNotFound.vue'
import Home from '../view/Home.vue'
import FirstPage from '../view/document/FirstPage.vue'
import SecondPage from '../view/system/SecondPage.vue'
import ActionLogList from '../view/system/ActionLogList.vue'
import EmployeeList from '../view/system/EmployeeList.vue'
import TemplateList from '../view/system/TemplateList.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        hidden: true
    },
    {
        path: '/todo',
        component: Todo,
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '文档操作',
        iconCls: 'fa fa-file',
        children: [
            { path: '/p11', component: FirstPage, name: '我的私人文件' },
            { path: '/p12', component: SecondPage, name: '项目文件' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统配置',
        iconCls: 'fa fa-cog',
        children: [
            { path: '/template', component: TemplateList, name: '项目目录模板配置' },
            { path: '/user', component: EmployeeList, name: '用户及权限管理' },
            { path: '/foo', component: Todo, name: '项目管理' },
            { path: '/log', component: ActionLogList, name: '查看操作日志' }
        ]
    },
    {
        path: '*',
        component: NotFound,
        hidden: true
    },
];

export default routes;