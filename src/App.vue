<template>
  <div id="app">
  <router-view name="header"></router-view>
  <!-- 路由跳转-->
    <router-view></router-view>
    
  </div>
</template>
<script>
import storage from './modle/storange.js'

export default {
  data () {
    return {
    }
  },
  mounted(){
  },
  methods:{
  }
}
</script>
<style>
#app{
  background-color: #fff;
}
body{
  background-color: #fff;
}


</style>
