// import sharePanel from '../vue-components/share/share-vue.vue';
// import alertModal from '../vue-components/modal/modal.vue';

export const shareMixin = {
    // components: {
    //     alertModal,
    //     sharePanel
    // },
    data() {
        return {
            pageText: {},
            isPC: false,
            pageLang: 'en',
            isShareShow: false,
            isTipsShow: false,
            tipsMessage: ''
        };
    },
    methods: {
        showSharePanel() {
            this.isShareShow = true;
        },
        closePanel() {
            this.isShareShow = false;
        },
        setTipsShow(content) {
            this.isTipsShow = true;
            this.tipsMessage = content;

            setTimeout(() => {
                this.isTipsShow = false;
                this.tipsMessage = '';
            }, 2000);
        }
    },
};
