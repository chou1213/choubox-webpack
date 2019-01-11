<template>
    <div>
        hello world!11
        <test-a></test-a>
    </div>
</template>

<script>
import '@assets/css/main.scss';
import TestA from 'COMPONENTS/TestA'
export default {
  name: 'app',
  data: () => ({

  }),
  methods: {

  },
  components: {
    TestA
  }
}
</script>

<style lang='scss'>
.createFlag {
  font-size: 12px;
}
</style>
