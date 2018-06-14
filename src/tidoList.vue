<template>
  <div id="app">
    <input  v-model="inputValue">
    <button v-on:click="addValue" >提交</button>
    <ul>
      <todoList-Item 
      v-for="(item,index) of list"
      :key = "index"
      v-bind:addBind="item"
      :index = "index"
      @delite="deliteList"
      ></todoList-Item>
    </ul>
  </div>
  
</template>

<script>
import todoListItem from "./components/todoListItem"
export default {
  components:{
    "todoList-Item":todoListItem
  },
  data () {
    return{
      inputValue:"",
      list:[]
    }
  },
  methods:{
    addValue(){
      this.list.push(this.inputValue) 
      this.inputValue = ""
    },
    deliteList(index){
      this.list.splice(index,1)
    }
  }
}
</script>

<style>

</style>
