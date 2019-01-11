<template>
    <div>
        hello world!
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
.viewFlag {
  font-size: 12px;
}
</style>
