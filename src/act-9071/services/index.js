import xhr from 'XHR'

/**
 * 获取通用接口配置的数据
 * @param {object} requestDatas
 */
export const getStartList = (requestDatas) => {
    return xhr({
        method: 'post',
        url: '/activity_2018/act_9071/actInit',
        data: requestDatas
    })
}
export const getData = (requestDatas) => {
    return xhr({
        method: 'post',
        url: '/live/act_api/actData',
        data: requestDatas
    })
}
