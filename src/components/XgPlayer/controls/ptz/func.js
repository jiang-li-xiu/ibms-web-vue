/*
 * @Author: Yelucc
 * @Date: 2021-07-01 16:56:59
 * @LastEditors: MJ
 * @LastEditTime: 2021-11-04 16:38:31
 * @Description: 
 */
import { addClass, removeClass, event } from '../utils/util'

import { createDom } from '../utils/util'
import './css/ptz.scss'

let ptz = function() {
    let player = this
    let root = player.root
    let show = false;
    // 自定义配置传入云台配置
    /**ptz
     * {
     *  active:"云台激活状态（true/false）",
     *  deviceId:"本流相机ID",
     *  controlFallback:{
     *      up:(did)=>{
     *          回调函数
     *      },
     *      ...
     *  }
     * }
     */

    // <xg-icon class="xgplayer-icon">
    //     <div class="xgplayer-icon-large">
    //         <svg t="1628474361471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2297" width="28" height="28"><path d="M512 938.4C276.7 938.4 85.3 747 85.3 511.8S276.7 85.1 512 85.1s426.7 191.4 426.7 426.7S747.3 938.4 512 938.4z m0-775.7c-192.5 0-349.1 156.6-349.1 349.1S319.5 860.9 512 860.9s349.1-156.6 349.1-349.1S704.5 162.7 512 162.7z" p-id="2298"></path><path d="M512 205.4l128 128H384l128-128z m0 612.8l128-128H384l128 128zM205.6 511.8l128-128v256l-128-128z m612.8 0l-128-128v256l128-128z" p-id="2299"></path></svg>
    //     </div>
    // </xg-icon>

    // <div class="up">▲</div>
    //                     <div class="left-right-box>
    //                         <div class="left">◀</div>
    //                         <div class="right">▶</div>
    //                     </div>
    //                     <div class="down">▼</div>

    let ptzConfig = player.config.customConfig.ptz;
    let container = createDom('xg-ptz',
        `
            <div class="yt-box">
                <div>
                    <div class="up-left-right-down-box">
                        <div class="up">▲</div>
                        <div class="left-right-box">
                            <div class="left">◀</div>
                            <div class="right">▶</div>
                        </div>
                        <div class="down">▼</div>
                    </div>
                    
                    <div class="zoom-box">
                        <div class="enla">
                            <svg t="1628493556975" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4583" width="28" height="28"><path d="M447.524111 0.49885a476.678923 476.678923 0 0 1 103.483668 7.205612 533.436972 533.436972 0 0 1 78.596595 21.395123 458.942033 458.942033 0 0 1 275.420647 276.141209 577.003208 577.003208 0 0 1 22.171113 91.234129 366.931915 366.931915 0 0 1 1.053128 108.804736c-3.49195 19.787718-4.434223 37.857175-9.090156 55.760348a465.593367 465.593367 0 0 1-57.534038 135.68721c-9.367295 14.632934-19.178012 27.713891-29.48758 41.349125l-14.023229 16.628335 191.890981 188.454458a79.649722 79.649722 0 0 1 12.304968 26.882474 49.885004 49.885004 0 0 1-75.104645 46.781048 111.631552 111.631552 0 0 1-18.956301-17.182613l-32.369825-31.372124-102.097974-99.770007-36.138913-35.473781a33.921802 33.921802 0 0 0-12.24954-10.697562l-16.628335 11.75069-38.799447 23.390524a486.101646 486.101646 0 0 1-127.483898 46.503909c-14.965501 3.658234-30.097286 4.157084-46.282198 6.873045-11.085556 1.829117-22.947102 0.49885-35.085786 2.383394h-31.926402l-14.411223-0.332566-39.630864-4.101656a562.370274 562.370274 0 0 1-90.846135-22.725391 457.611766 457.611766 0 0 1-282.681687-291.328421 473.741251 473.741251 0 0 1-11.584406-233.461816 429.454453 429.454453 0 0 1 43.510809-117.728609A472.02299 472.02299 0 0 1 311.060912 25.884774 520.078876 520.078876 0 0 1 399.468224 4.877645l34.032658-3.436523z m2.438822 96.388913l-37.524608 3.436522a438.877176 438.877176 0 0 0-72.056117 17.958601 368.373038 368.373038 0 0 0-221.045993 219.327733 404.234812 404.234812 0 0 0-16.628335 67.123043 341.656847 341.656847 0 0 0 11.916973 155.197789 356.511492 356.511492 0 0 0 206.967337 227.586472 427.514481 427.514481 0 0 0 75.104645 23.057958c11.085556 2.49425 22.171113 2.49425 34.365224 4.48965a202.255976 202.255976 0 0 0 48.776448 1.718261l30.873275-2.383394a509.49217 509.49217 0 0 0 59.307726-12.083257 364.82566 364.82566 0 0 0 231.854411-200.038864 424.077958 424.077958 0 0 0 25.275069-80.259428 356.012642 356.012642 0 0 0-23.833946-206.579343 362.331409 362.331409 0 0 0-271.208136-213.119821 395.920645 395.920645 0 0 0-82.143973-5.431922z m180.639141 399.080028H509.714082v117.562325a41.847975 41.847975 0 0 1-83.640523 0V495.912363H305.130139a40.683992 40.683992 0 1 1 0-81.367983h120.94342V296.926627a41.847975 41.847975 0 0 1 83.640523 0v116.730908h120.887992a41.127414 41.127414 0 0 1 41.847975 40.683992 41.903403 41.903403 0 0 1-41.847975 41.515409z" p-id="4584" fill="#ffffff"></path></svg>
                        </div>

                        <div class="shrink">
                            <svg t="1628493846957" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5462" width="28" height="28"><path d="M446.725047 0.385638a474.179246 474.179246 0 0 1 103.612431 7.203003 522.328553 522.328553 0 0 1 78.124882 21.331971 458.000193 458.000193 0 0 1 275.376356 276.041249 544.380824 544.380824 0 0 1 22.163087 91.25651 376.273809 376.273809 0 0 1 1.108154 108.76535c-3.324463 19.725147-4.432617 37.843471-8.865235 55.740164a488.086583 488.086583 0 0 1-57.624026 135.638092c-9.419312 14.57223-19.392701 27.703859-29.36609 41.278749-4.986695 5.540772-9.419312 11.081543-14.406007 16.622316q96.409428 94.19312 191.710703 188.386239a77.570804 77.570804 0 0 1 12.743775 26.817335 49.866946 49.866946 0 0 1-75.354496 46.819522 120.345562 120.345562 0 0 1-18.838624-17.231801c-10.527466-10.527466-21.60901-21.11034-32.136476-31.637806-34.352785-33.24463-68.151492-66.489261-101.9502-99.733892l-36.569094-35.460939a30.308021 30.308021 0 0 0-12.189698-10.638282l-16.622315 11.691029-38.231325 23.382057a487.587914 487.587914 0 0 1-127.43775 46.487074c-14.960084 3.656909-29.920167 4.155579-45.988406 6.870557-11.081543 1.883862-23.271241 0.554077-35.460939 2.43794H448.941355l-14.406006-0.332446-39.893557-4.155579a555.739406 555.739406 0 0 1-90.868657-22.717164 457.612339 457.612339 0 0 1-282.579359-291.167556 476.838817 476.838817 0 0 1-11.63562-233.377306 422.262215 422.262215 0 0 1 43.772096-117.741399A469.912852 469.912852 0 0 1 310.422062 25.429926 514.072803 514.072803 0 0 1 399.074409 4.430401l33.798708-3.435278z m2.216308 96.35402l-37.12317 3.435279a442.873886 442.873886 0 0 0-72.58411 17.896693 368.959991 368.959991 0 0 0-221.076793 219.248338 461.21384 461.21384 0 0 0-16.622315 67.154153 339.649308 339.649308 0 0 0 12.189698 155.141609A355.772954 355.772954 0 0 0 320.395451 787.175226a425.974532 425.974532 0 0 0 74.800418 23.04961c11.635621 2.43794 22.717164 2.493347 34.352785 4.488025a203.346323 203.346323 0 0 0 48.758791 1.71764l31.028322-2.43794a476.50637 476.50637 0 0 0 59.286258-12.023475 365.690935 365.690935 0 0 0 232.158336-200.02186 464.150449 464.150449 0 0 0 24.933473-80.174967 354.609392 354.609392 0 0 0-23.825318-206.504563 362.366472 362.366472 0 0 0-270.943739-213.098081 396.774665 396.774665 0 0 0-82.003422-5.319141z m180.629159 398.935566H304.327213a40.669265 40.669265 0 1 1 0-81.338529l325.243301-0.886524a41.27875 41.27875 0 0 1 42.109865 40.669265 42.165273 42.165273 0 0 1-42.109865 41.555788z" p-id="5463" fill="#ffffff"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        `, {},
        'xgplayer-ptz')

    player.once('ready', () => {
        if (player.controls) {
            player.controls.appendChild(container)
        }
    });

    // 取得按钮增加点击事件监听器
    let upBtn = container.querySelector('.up');
    let downBtn = container.querySelector('.down');
    let leftBtn = container.querySelector('.left');
    let rightBtn = container.querySelector('.right');

    let enlaBtn = container.querySelector('.enla');
    let shrinkBtn = container.querySelector('.shrink');

    upBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('upOnClicked')
    })

    function upOnClicked() {
        ptzConfig.controlFallback.up(ptzConfig.deviceId);
    }
    player.on('upOnClicked', upOnClicked)

    downBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('downOnClicked')
    })

    function downOnClicked() {
        ptzConfig.controlFallback.down(ptzConfig.deviceId);
    }
    player.on('downOnClicked', downOnClicked)

    leftBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('leftOnClicked')
    })

    function leftOnClicked() {
        ptzConfig.controlFallback.left(ptzConfig.deviceId);
    }
    player.on('leftOnClicked', leftOnClicked)

    rightBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('rightOnClicked')
    })

    function rightOnClicked() {
        ptzConfig.controlFallback.right(ptzConfig.deviceId);
    }
    player.on('rightOnClicked', rightOnClicked)

    enlaBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('enlaOnClicked')
    })

    function enlaOnClicked() {
        ptzConfig.controlFallback.enla(ptzConfig.deviceId);
    }
    player.on('enlaOnClicked', enlaOnClicked)

    shrinkBtn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        player.userGestureTrigEvent('shrinkOnClicked')
    })

    function shrinkOnClicked() {
        ptzConfig.controlFallback.shrink(ptzConfig.deviceId);
    }
    player.on('shrinkOnClicked', shrinkOnClicked)


    // 图标进入和离开事件
    // let icon = container.querySelector('.xgplayer-icon')

    // icon.addEventListener('click', e => {
    //     console.log(e);
    //     e.preventDefault();
    //     e.stopPropagation();
    //     player.userGestureTrigEvent('ptzPanelShow')
    // });

    function ptzPanelShow() {
        if (!this.show) {
            this.show = true
            addClass(root, 'xgplayer-ptz-active')
            if (container) {
                container.focus()
            }
        } else {
            this.show = false
            removeClass(root, 'xgplayer-ptz-active')
        }
    }
    player.on('ptzPanelShow', ptzPanelShow)
}
export default {
    name: 'Func',
    method: ptz
}