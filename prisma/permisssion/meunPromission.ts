const meunPermission = [
  {
    name: 'dashboard',
    url: '',
    apiUrl: '',
    code: 10000,
    parentCode: null,
  },
  {
    name: 'user',
    apiUrl: '',
    url: '',
    code: 10100,
    parentCode: null,
  },
  {
    name: 'role',
    apiUrl: '',
    url: '',
    code: 10200,
    parentCode: null,
  },
  {
    name: 'userInfo',
    apiUrl: '',
    url: '',
    code: 10300,
    parentCode: null,
  },
];

const dashboardMenu = [
  {
    url: '/dashboard',
    method: 'GET',
    code: 10001,
    name: '查询',
    parentCode: 10000,
  },
];

const userMenu = [
  {
    url: '/users',
    method: 'GET',
    code: 10101,
    name: '查询用户',
    parentCode: 10100,
  },
  {
    url: '/user',
    method: 'POST',
    code: 10102,
    name: '新增用户',
    parentCode: 10100,
  },
  {
    url: '/user',
    method: 'PATCH',
    code: 10103,
    name: '更新用户',
    parentCode: 10100,
  },
  {
    url: '/user',
    method: 'DELETE',
    code: 10104,
    name: '删除用户',
    parentCode: 10100,
  },
];

const roleMenu = [
  {
    url: '/roles',
    method: 'GET',
    code: 10201,
    name: '查询角色',
    parentCode: 10200,
  },
  {
    url: '/role',
    method: 'POST',
    code: 10202,
    name: '新增角色',
    parentCode: 10200,
  },
  {
    url: '/role',
    method: 'PATCH',
    code: 10203,
    name: '更新角色',
    parentCode: 10200,
  },
  {
    url: '/role',
    method: 'DELETE',
    code: 10204,
    name: '删除角色',
    parentCode: 10200,
  },
];

const userInfoMenu = [
  {
    url: '/userInfo',
    method: 'GET',
    code: 10301,
    name: '获取用户信息',
    parentCode: 10300,
  },
  {
    url: '/userInfo',
    method: 'PATCH',
    code: 10302,
    name: '更新用户信息',
    parentCode: 10300,
  },
];

const permissions = [
  ...meunPermission,
  ...dashboardMenu,
  ...userMenu,
  ...roleMenu,
  ...userInfoMenu,
];

export { permissions };
