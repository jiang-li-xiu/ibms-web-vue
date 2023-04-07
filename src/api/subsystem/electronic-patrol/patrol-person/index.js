import request from '@/utils/request'

// 巡更设备列表
export function getDeptDeptTree(id) {
    return request({
        url: `/patrol/dept/deptTree/${id}`,
        method: 'GET',
    })
}

// 巡更部门列表
export function getDeptList(parameter) {
    return request({
        url: `/patrol/people/getOneByDetpId`,
        params: parameter,
        method: 'GET',
    })
}