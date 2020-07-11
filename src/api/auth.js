import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/auth/user',
    method: 'get',
    params
  })
}

export function getRolesList(params) {
  return request({
    url: '/auth/roles',
    method: 'get',
    params
  })
}
