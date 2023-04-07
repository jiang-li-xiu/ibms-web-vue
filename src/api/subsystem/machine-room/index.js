import request from '@/utils/request'

// 查询告警记录
export function getAlarmRecordList(params) {
    return request({
      url: '/powerenv/powerenv/alarmRecord',
      method: 'get',
      params
    })
  }


  // 查询设备信息
export function getDeviceInfoList(params) {
  return request({
    url: '/powerenv/powerenv/allDevice',
    method: 'get',
    params
  })
}
 