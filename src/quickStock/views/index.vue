<template>
    <div>
        <section v-for="(item,index) in arr" :key="index">
            {{item}}
        </section>
        <button v-on:click="quickBtn">快速排序</button>
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
export default {
    data() {
        return {
            // arr: [100, 3, 102, 80, 1, 50, 8, 100]
            arr: [
                '1.0.0',
                '1.0.1',
                '2.0.0',
                '0.0.9',
                '1.0.3',
                '2.0.1',
                '3.0.0',
                '2.0.5'
            ]
        };
    },
    create() { },
    methods: {
        quickStock(arr) {
            let that = this;
            let left = [];
            let right = [];
            let index = parseInt(arr.length / 2, 10);
            let middle = arr.splice(index, 1);
            console.log('------', index, middle[0]);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] <= middle[0]) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            console.log(left, middle, right);
            if (left.length > 1) {
                left = that.quickStock(left);
            }
            if (right.length > 1) {
                right = that.quickStock(right);
            }
            console.log(left.concat(middle, right))
            return left.concat(middle, right);
        },
        quickBtn() {
            this.arr = this.quickStock(this.arr);
        }
    }
};
</script>
