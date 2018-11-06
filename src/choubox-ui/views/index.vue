<template>
    <div class="index">
        <h1 class="index__title">choubox-ui</h1>
        <ul class="index__list">
            <router-link to="/layout"
                tag="li">layout</router-link>
            <router-link to="/flex"
                tag="li">flex</router-link>
        </ul>
    </div>
</template>

<script>
export default {
    data: () => ({
    }),
    components: {

    }
}
</script>

<style lang='scss' scoped>
.index__title {
  margin: 30px 0;
  text-align: center;
  color: #41b883;
}
.index__list {
  margin: 0 auto;
  padding: 0 32px;
  list-style-type: none;
  li {
    height: 80px;
    line-height: 80px;
    padding: 0 32px;
    margin-bottom: 30px;
    font-size: 30px;
    background-color: #fff;
    border-radius: 8px;
  }
}
</style>
