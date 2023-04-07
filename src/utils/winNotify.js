/*
 * @Author: Yelucc
 * @Date: 2021-08-13 14:18:07
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-08-13 15:06:18
 * @Description: 桌面通知
 */

/**
 * 桌面通知
 * @param {*} title 标题
 * @param {*} msg 消息
 * @param {*} iconurl 图片地址
 * @param {*} timeout 超时关闭
 * @param {*} onClicked 点击回调
 */
let winNotify = (title,msg,iconurl,timeout,onClicked) =>{
    if(undefined === window.Notification){
        console.log("[winNotify] 消息通知失败,请检查浏览器或操作系统是否支持桌面通知。");
    }
    // 默认询问用户是否同意本页通知
    if(Notification.permission === "default"){
        Notification.requestPermission();
    }
    // 用户同意
    if(Notification.permission === "granted"){
        let n = new Notification(
            title,
            {
                body:msg,
                icon:iconurl
            }
        )
        setTimeout(()=>{
            n.close()
        },timeout)
        n.onclick = onClicked
    }
    
}

export default winNotify;