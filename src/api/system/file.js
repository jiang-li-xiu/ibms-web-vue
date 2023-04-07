/*
 * @Description: 
 * @Version: 1.0
 * @Author: Chen
 * @Date: 2021-08-25 18:05:43
 * @LastEditors: Chen
 * @LastEditTime: 2021-08-25 18:05:43
 */
import request from '@/utils/request'

// 查询参数列表
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    params: data
  })
}