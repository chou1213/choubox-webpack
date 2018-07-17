<template>
    <div>

    </div>
</template>

<style lang="scss">
body {
  color: tan;
}
section {
  display: flex;
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {};
    },
    create() { },
    mounted() {
        axios
            .get('/live/blockapi/getEvent', {
                params: {
                    blob_id: 18
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.defaults.headers['Content-Type'] =
            'application/x-www-form-urlencoded';
        axios.defaults.transformRequest = [
            function (data) {
                let ret = [];
                for (let it in data) {
                    ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
                }
                return ret.join('&');
            }
        ];
        // axios.defaults.headers = {'token': '123'};
        axios.interceptors.response.use(
            function (response) {
                // 对响应数据做点什么
                return response.data;
            },
            function (error) {
                // 对响应错误做点什么
                return Promise.reject(error);
            }
        );
        axios
            .post('/live/act_api/actData', {
                act_id: 'act_8579'
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        axios({
            method: 'post',
            url: '/live/act_api/actData',
            data: {
                act_id: 'act_8579'
            },
            transformRequest: [
                function (data) {
                    let ret = [];
                    for (let it in data) {
                        ret.push(
                            encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
                        );
                    }
                    return ret.join('&');
                }
            ],
            headers: { token: '123' }
        }).then(function (res) {
            console.log('===');
            console.log(res);
        });
    },
    methods: {}
};
</script>
