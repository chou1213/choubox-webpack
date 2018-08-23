import xhr from 'XHR';
(process.env.NODE_ENV === 'production') && (xhr.defaults.baseURL = 'https://h5.dayanweb.cn');
/**
 * 获取作品图片
 * @param {参数} request
 */
export const getData = (request) => {
    return xhr({
        method: 'POST',
        url: '/duode/api/data.php',
        data: request
    })
};
