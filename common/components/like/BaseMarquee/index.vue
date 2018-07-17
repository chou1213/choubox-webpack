<template>
    <div v-if="value">
        <div class="ani-marquee" ref="marqueeWrapper">
            <p id="marquee-1" ref="marquee1" :class="{'active': isScroll}">
                <span v-for="item in value" v-html="item" :key="item"></span>
            </p>
            <p id="marquee-2" ref="marquee2" :class="{'active': isScroll}">
                <span v-for="item in value" v-html="item" :key="item"></span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    props: {
        value: {
            type: Array,
            default: () => []
        },
        duration: Number
    },
    data() {
        return {
            isScroll: false
        }
    },
    watch: {
        'value': {
            handler(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.setScroll()
                    });
                }
            },
            deep: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.setScroll()
        })
    },
    methods: {
        setScroll() {
            const marquee1 = this.$refs.marquee1;
            const marquee2 = this.$refs.marquee2;
            const marqueeWrapper = this.$refs.marqueeWrapper;
            const durations = ['webkitAnimation', 'animation', 'mozAnimation'];
            const timing = this.value.length * 5;

            if (marquee1.offsetWidth < marqueeWrapper.offsetWidth) {
                this.isScroll = false;
                marquee1.style.width = '100%';
                marquee1.style.paddingRight = '0';
            } else {
                marquee1.style.width = 'auto';
                marquee1.style.paddingRight = '80Px';
                durations.forEach((o) => {
                    marquee1.style[o] = `marquee-2 ${this.duration || timing}s linear infinite 2s`;
                    marquee2.style[o] = `marquee-1 ${this.duration || timing}s linear infinite 2s`;
                });
                this.isScroll = true;
            }
        }
    }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
