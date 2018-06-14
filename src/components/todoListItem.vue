<template>
<div>
  <li @click="handerClick">{{addBind}}</li>
</div>
</template>

<script>
export default {
  props:["addBind","index"],
  methods:{
    handerClick(){
      this.$emit("delite",this.index)
    }
  }
  
}
</script>
<style scoped>
/*scoped   作用域*/

</style>
