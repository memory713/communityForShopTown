<template>
	<div class="body">
		<div class="replay" v-for="item in list" @click="tiao(item.wid)">
			<div class="img">
				<img :src="item.headimg" class="left">
			</div>
			
			<div class="right">
				<div class="right-top">
					<div class="name">{{item.nickname}}</div>
					
				</div>
				<div class="right-word">{{item.content}}</div>
				<div class="time">{{item.pasttime}}</div>
			</div>
		</div>
	</div>
</template>
<script>
import storage from '../modle/storange.js'
import hexMD5 from '../modle/md5.js'
import request from '../modle/request.js'

export default {
  data () {
    return {
    	list:[]
    	
    }
  },
  mounted(){
  	var that = this
   		var userId = storage.get("userId")
	    var newkey = storage.get("newkey")
      	var yanzheng = hexMD5(userId + "webkey")
      	if(newkey !== yanzheng){
       		this.$router.push({path:"login"})
      	}
	      
      	request('POST','weibo.getWeiboMessageList',
    	{
       		params: {
      		   	userid: userId,
      		   	isread:1,
       		},
          	success: function (res) {
          		if(res.code == 200){
          			for (var i = 0; i < res.data.length; i++) {
          				if(res.data[i].pasttime.length>10){
          					res.data[i].pasttime= res.data[i].pasttime.substr(0,11)
          				}
          				if(res.data[i].headimg==null){
          					res.data[i].headimg= "../static/app.png"
          				}
          			}
          			
          			that.list =res.data

          		}

          		
          		
        	},
        	fail: function () {
          		let instance = Toast('您的网络有误，请检查');
				setTimeout(() => {
				  instance.close();
				}, 2000);
          	},
    	})

   },
  methods : {
  	tiao(aid){

  		// 跳转到评论路由
        this.$router.push({path:"pinglun"+aid})

  	}
   
  }
}
</script>
<style scoped>
.body{
	background-color: #F3F3F5;
	margin:15px;
	padding-left:10px;
	padding-right:10px;
	box-sizing: border-box;
}
.replay{
	display: flex;
	padding-top:10px;
	padding-bottom:15px;
	box-sizing: border-box;
	border-bottom:1px solid #CFCFD0;
	
}
.img{
	width:20%;
}
.img img{
	height:40px;
	width: 40px;
}
.right{
	width:80%;
}
.right-top{
	display: flex;
	justify-content: space-between;
}
.right-top{
	color:#808080;
}

.time{
  font-size: 0.7rem;
  
	text-align: right;
	color:#808080;
}
</style>