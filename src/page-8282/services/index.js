import xhr from 'XHR'
/**
 * 7天成长轨迹明细
 * @param {object} requestDatas 
 */
export const last7dayIncome = (requestDatas) => {
    return xhr({
        method: 'post',
        url: '/app/paike_growth/last7dayIncome',
        data: requestDatas
    })
}


/**
 * 用户信息 
 * @param {object} requestDatas 
 */
export const useInfo = (requestDatas) => {
    return xhr({
        method: 'post',
        url: '/app/app_user/info',
        data: requestDatas
    })
}



/**
 * 昨天成长轨迹
 * @param {object} requestDatas 
 */
export const paikeGrowth = (requestDatas) => {
    return xhr({
        method: 'post',
        url: '/app/paike_growth/index',
        data: requestDatas
    })
}
