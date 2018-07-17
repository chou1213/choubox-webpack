<template>
    <div class="video-box" @click.stop="playVideo"
         :class="{'video-playing': isPlay && !isLoading}">
        <div class="video-poster"
             v-if="!isPlay"
             :style="{backgroundImage: `url(${isPlay ? '' : cover})`}"></div>
        <div class="play-loading" :class="{'hidden': !isLoading}">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </div>
        <div class="play-button" v-show="!isLoading && !isPlay">
            <slot name="play-btn"></slot>
        </div>
        <video id="act-video" ref="video" autobuffer preload="auto"
               x5-playsinline="" playsinline="" webkit-playsinline="" x5-video-player-type="h5" x-webkit-airplay="true"
               :poster="cover"
               :src="value"
               @playing="playingVideo"
               @ended="endPlay"
               @pause="pausePlay"></video>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            value: String,
            cover: String
        },
        data() {
            return {
                isLoading: false,
                isPlay: false,
                isPause: false,
                isVideoShow: false
            }
        },
        mounted() {
            const that = this,
                event = document.visibilityState ? 'visibilitychange' :
                    document.webkitVisibilityState ? 'webkitVisibilitychange' :
                    document.mozVisibilityState ? 'mozVisibilitychange' :
                    document.oVisibilityState ? 'oVisibilitychange' : 'msVisibilitychange';

            this.isVideoShow = true;

            document.addEventListener(event, () => {
                if (document.visibilityState === 'hidden') {
                    that.$refs.video.pause();
                }
            })
        },
        methods: {
            playingVideo() {
                this.isLoading = false;
                this.isPlay = true;
            },
            endPlay() {
                this.isPlay = false;
            },
            pausePlay() {
                this.isPlay = false;
            },
            playVideo() {
                if (this.isPlay) {
                    return false
                }

                this.isLoading = true;
                this.isPlay = true;

                this.$refs.video.play();
                this.$emit('playVideo')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~ASSETS/like/css/_utilities.scss";
    @import "~ASSETS/like/css/_vtransition.scss";
    @import "./index.scss";
</style>
