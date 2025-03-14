// ==UserScript==
// @name         Minikano 在干嘛
// @namespace    http://tampermonkey.net/
// @version      2025-03-13
// @description  try to take over the world!
// @author       minikano
// @match        *://*/*
// @icon         https://api.kanokano.cn/lotw-status/favicon.ico
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    if (window.top === window.self) {
        const TOKEN = '？？？'
        const DEVICE_NAME = 'MiniKano 的 MacBook Air 💻'
        function debounce(fn, delay) {
            let timer;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(fn, delay);
            };
        }
        const status = {
            name: DEVICE_NAME, //在这里设置你电脑的名称
            type: 'browser',
            isOnline: true,
            detail: {
                isCharging: null,
                battery: null,
                isScreenOn: true,
                wifiStatus: 'connected',
                currentPageTabTitle: null,
                cellularStatus: null
            }
        }
        const getData = async () => {
            //获取标题
            if (document.visibilityState == 'visible') {
                status.detail.currentPageTabTitle = document.title
                //获取电脑数据
                try {
                    //电量数据
                    const batteryStatus = navigator.getBattery && (await navigator.getBattery())
                    if (batteryStatus) {
                        status.detail.isCharging = batteryStatus.charging
                        status.detail.battery = batteryStatus.level * 100
                    }
                    fetch('https://api.kanokano.cn/status/', {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "TOKEN": TOKEN
                        },
                        body: JSON.stringify([status])
                    })
                        .then((res) => res.json())
                        .then((data) => { console.log(data) })
                }
                catch (e) {
                    console.error(e)
                }
            }
        }
        getData()
        document.addEventListener("visibilitychange", debounce(getData, 1000))
        document.addEventListener("focus", debounce(getData, 1000))
        window.addEventListener('focus', debounce(getData, 1000));

    }
})();