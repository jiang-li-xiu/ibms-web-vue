/*
 * @Author       : Humility
 * @Date         : 2020-11-18 20:50:00
 * @LastEditTime : 2021-08-25 17:29:03
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\controller\ibmsAPI.js
 * @Description  : IBMS接口
 */
import axios from "axios"
// let ibmsHost = "10.92.1.24";
const ibmsHostPort = "120.78.178.12:8081/mock/12";
// const ibmsHostPort = "192.168.1.23:8082";
// const ibmsExHost = "10.92.1.22:8082";
const ibmsExHost = "192.168.1.220:7777";
export default {
  doControlDoorpoint(device3DCode, controlType) {
    let cmd = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/acs/v1/doControlDoorpoint?device3DCode=" + device3DCode + "&controlType=" + controlType;
    axios.post(cmd).then(res => {
      let content = res.body
      if (content.code == 200) {
        if (content.data.controlCode == 0) {
          return
        } else {
          return
        }
      } else {
        console.log(content.message);
      }
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * @description: 监控（球机）控制
   * @param {*} monId 监控ID
   * @param {*} ctrlCode 控制码
   * @return {void}
   */
  monitoringControl(monId, ctrlCode) {
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/montoring/v1/cloudOp?device3DCode=" + monId + "&command=" + ctrlCode + "&status=0";
    console.log("[INFO] requtst host:", url);
    axios.get(url).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      return -1;
    });
  },
  // 视频url请求视频流地址
  async getVideoStream(cameraIndexCode) {
    let flvStream;
    let closeVideoCode;
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/montoring/v1/getPreviewURL?device3DCode=" + cameraIndexCode;
    console.log("[INFO] requtst host:", url);
    await axios.post(url).then(response => {
      console.log("[INFO] request successed.")
      if (response.data.data.code == 200) {
        console.log('[INFO] Successed get video stream.')
        console.log(response);
        flvStream = response.data.data.url;
        closeVideoCode = response.data.data.closeVideoCode;
      } else {
        console.error("[ERROR] ", response.data.data.code, response.data.data.message)
        console.log(cameraIndexCode);
      }
    }).catch(err => {
      console.log(err);
      return -1;
    });
    return [flvStream, closeVideoCode];
  },
  async dropVideoStream(closeVideoCode) {
    let flvStream;
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/montoring/v1/closeVideoStream?tokens=" + closeVideoCode;
    console.log("[INFO] requtst host:", url);
    await axios.post(url).then(response => {
      console.log('[INFO] Successed drop video stream.')
      console.log(response);
    }).catch(err => {
      console.log(err);
      return -1;
    });
    return flvStream;
  },
  //广播-音乐
  async playVoice() {
    let voice;
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/jusbe/v1/playMusic";
    console.log("[INFO] requtst host:", url);
    await axios.get(url).then(response => {
      console.log(response);
      voice = response.data.data;
    }).catch(err => {
      console.log(err);
      return -1;
    });
    return voice;
  },
  //关闭-音乐
  async dropVoice(voice) {
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/jusbe/v1/stopMusic?streamId=" + voice;
    console.log("[INFO] requtst host:", url);
    await axios.get(url).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
      return -1;
    });
    // return voice;
  },
  //广播-喊话
  async startTalk() {
    let voice;
    let url = "http://" + ibmsHostPort + "/ibmsDeviceOptionApi/jusbe/v1/getAndPlayCardMusic";
    console.log("[INFO] requtst host:", url);
    await axios.get(url).then(response => {
      console.log(response);
      voice = response.data.data;
    }).catch(err => {
      console.log(err);
      return -1;
    });
    return voice;
  },
  ibmsHostPort: ibmsHostPort,
  ibmsExHost: ibmsExHost,
}