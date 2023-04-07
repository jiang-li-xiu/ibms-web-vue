/*
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2021-07-26 11:05:00
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-03-28 15:10:28
 */
import request from '@/utils/request'

/**
 * @description: 查询岗位列表
 * @param {*} query
 * @return {*}
 */
export function getTableList(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

/**
 * @description: 查询岗位详细
 * @param {*} postId
 * @return {*}
 */
export function getListDetail(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}

/**
 * @description: 新增岗位
 * @param {*} data
 * @return {*}
 */
export function addList(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function editList(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delList(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}
