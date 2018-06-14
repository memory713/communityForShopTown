<template>
	<div>
	<div class="ditails"  >
        <div class="ditails-box">
          <div class="box-left">
            <img :src="list.headimg" :onerror="logo">
          </div>
          <div class="box-right" ref="elememt" >
            <div class="ditail-name">{{list.nickname}}</div>
            <div style="margin-bottom: 10px;">{{list.content}}</div>
            <div class="shaitu" style="width:100%;"  >
              <img :src="item" v-for="item in images" v-bind:style="{ height: item2Height+ 'px', width: item2Width + 'px' }" class="item2Imgp" :onerror="logo" @click="tiaozhuanfangda(item2)">
            </div>
            <div class="ditail-bottom">
              

              <div style="display:flex;">
              	<div class="ditail-bottom-left">{{list.weibotype}}</div>
              	<div style="color:#9CBDD9;margin-left:10px;" @click="deleteA(list.id)" v-show="benren0">删除</div>
              </div>


              <div class="ditail-bottom-right">
                <div class="ditail-bottom-icon">
                  <img src="../assets/time.png" class="ditail-icon">
                  <div>{{list.pasttime}}</div>
                </div>
                <div class="ditail-bottom-icon">
                  <img :src="list.iszan" class="ditail-icon" >
                  <div>{{list.zan}}</div>
                </div>
                <div class="ditail-bottom-icon">
                  <img src="../assets/huifu.png" class="ditail-icon" >
                  <div>{{list.pinglun}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
		</div>
		<div class="bottom-list">
		<div class="zanhead" v-show="zanlistNone">
    		<img src="../assets/dianzan.png">
    		<img :src="item.headimg" :onerror="logo2" v-for="item in zanlist">
        </div>
        <div class="replay" v-show="replayListNone">
	      	<div class="replay-line" v-for="item in replayList">
	      		<div style="display:flex;justify-content:space-between;width:100%;">
	      		<div>
	      		<span class="name-color" @click="sendUserZ(item.userid,item.nickname)">{{item.nickname}}</span> <span v-show="item.replyridNone" >回复 <span class="name-color" @click="sendUserF(item.replyrid,item.replynickname)">{{item.replynickname}}</span></span>：<span>{{item.content}}</span>
	      		</div>
	      		<div style="color:#9CBDD9;width:35px;float:right;text-align:right;font-size:0.7rem;" @click="shanchuComment(item.id)" v-show="item.benren">删除</div>
	      		</div>
	      	</div>
	      </div>
	      </div>

	      <!-- 留言 -->
	      <div class="give-message">
	      	<div class="message-nei">
	      		<input type="text" name="" :placeholder="placeholderValue" v-model="sendInputValue" >
	      		<div class="send" @click="sendMessage()">发送</div>
	      	</div>
	      </div>
      </div>
      
</template>
<script >
import storage from '../modle/storange.js'
import request from '../modle/request.js'
import hexMD5 from '../modle/md5.js'
import { Toast } from 'mint-ui';


export default {
  data () {
  	 return {
  	 	list:[],
  	 	benren0:true,
  	 	logo:"../static/app.png",
  	 	replayList:[],
  	 	logo2:"../static/app.png",
  	 	replayListNone:true,
  	 	zanlistNone:true,
  	 	sendUser:"",
  	 	sendInputValue:"",
  	 	zanlist:[],
  	 	placeholderValue:"可以留言哦~",
  	 	item2Height:50,
        item2Width:50,
        isActive:false,
        images:[],
        userId:'',
        benren:false

  	 }
  },
  mounted(){
  	this.getData()
			

  },
  methods:{
  	sendUserF(e,a){
  		this.sendUser = e
  		this.placeholderValue = "回复"+a+"："
  	},
  	sendUserZ(e,a){
  		this.sendUser = e
  		this.placeholderValue = "回复"+a+"："
  	},
  	shanchuComment(id){
  		var that = this
  		// 删除评论
  		request('POST','weibo.removeWeiboReply',
        {
          params: {
            replyid:id
          },
          success: function (res) {
            if(res.code == 200){
              let instance = Toast('删除成功');
	            setTimeout(() => {
	              instance.close();
	              // 更新评论
	              that.getData()
	            }, 2000);
	            
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
  	deleteA(id){
  		var userId = storage.get("userId")
  		var that = this
  		// 删除微博
  		request('POST','weibo.removeWeibo',
        {
          params: {
            weiboid:id,
            userid:userId
          },
          success: function (res) {
            if(res.code == 200){
              let instance = Toast('删除成功');
	            setTimeout(() => {
	              instance.close();
	              // 跳转到shouye
        		that.$router.push({path:"home"})
	            }, 2000);
	            
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

  	sendMessage(){
  		if(this.userId == this.sendUser){
			this.sendUser=""
  		}
  		if(this.sendInputValue.length==0){
  			let instance = Toast("请输入内容");
			setTimeout(() => {
			  instance.close();
			}, 2000);
  		}else{
  			var that = this
  			var aid = this.$route.params.aid
  			request('POST','weibo.addWeiboReply',
	        	{
	           		params: {
	          		   	weiboid: aid,
	          		   	userid:that.userId,
	          		   	content:that.sendInputValue,
	          		   	rid:that.sendUser
	           		},
		          	success: function (res) {
		          		if(res.code == 200){
		          			let instance = Toast(res.message);
							setTimeout(() => {
							  instance.close();
							}, 2000);
							that.getData()
							that.sendInputValue=""
		          		}
		        	},
		        	fail: function () {
		          		let instance = Toast('您的网络有误，请检查');
						setTimeout(() => {
						  instance.close();
						}, 2000);
		          	},
	        	})
  		}
  	},
  	getData(){
  		var that = this
	  	var aid = this.$route.params.aid
	  	var userId = storage.get("userId")
	  	this.userId = userId
	  	if(!userId){
	  		this.$router.push({path:"login"})
	  	}else{
	  		var newkey = storage.get("newkey")
	        var yanzheng = hexMD5(userId + "webkey")
	      	if(newkey !== yanzheng){
	        	this.$router.push({path:"login"})
	      	}
	  	}
        
	  	// 获取微博详情
	  	request('POST','weibo.getWeiboDetail',
		{
	   		params: {
	  		   	weiboid: aid,
	  		   	loginuserid:userId,
	   		},
	      	success: function (res) {
	      		if(res.code == 200){


		      		if((res.data.headimg==null)||(res.data.headimg=="")){
		      			res.data.headimg = "../static/app.png"
		      		}
		      		if(res.data.iszan){
		              res.data.iszan = "../static/dianzan.png"
		            }else{
		              res.data.iszan = "../static/zan.png"
		            }
		            if(res.data.userid == userId){
		            	that.benren0=true
		            }else{
		            	that.benren0=false
		            }


		      		that.list = res.data
		      		that.replayList = that.list.replylist//评论列表 
		      		that.zanlist = that.list.zanlist//点赞列表 
		      		that.images = that.list.images//图片列表 
		      		// 获取图片个数
		            var aaa = that.images.length  
		            var heightCss = window.getComputedStyle(that.$refs.elememt).width;
		            if(aaa==1){
		              that.item2Width = parseFloat(heightCss) - 100
		              that.item2Height = that.item2Width-50
		            }else{
		              that.item2Width = parseFloat(heightCss)/3 -5
		              that.item2Height = that.item2Width
		            }
		           
		      		
		      		if(that.replayList.length==0){
		      			that.replayListNone = false
		      		}else{
		      			that.replayListNone = true
		      		}

		      		if(that.zanlist.length==0){
		      			that.zanlistNone = false
		      		}else{
		      			that.zanlistNone = true
		      		}

		      		for (var i = 0; i < that.replayList.length; i++) {
		      			if(that.replayList[i].userid ==userId ){
		      				that.replayList[i].benren = true
		      			}else{
		      				that.replayList[i].benren = false
		      			}
		      			
		      			if(that.replayList[i].replyrid == 0){
			              that.replayList[i].replyridNone = false
			            }else{
			            	that.replayList[i].replyridNone = true
			            }
		      		}

		      		for (var i = 0; i < that.zanlist.length; i++) {
			            if((that.zanlist[i].headimg==null)||(that.zanlist[i].headimg=="")){
			            	that.zanlist[i].headimg = "../static/app.png"
			            }
		      		}
	      		}

	        	
	      	},
	      	fail: function () {
	      		let instance = Toast('您的网络有误，请检查');
				setTimeout(() => {
				  instance.close();
				}, 2000);
	      	},
		})
  	}
  }
}
</script>
<style scoped >

.ditails{
  padding:20px;
  padding-bottom:10px;
}
.ditails-box{
  display: flex;
}
.box-left{
  margin-right:10px;
}
.box-right{
  width: 100%;
}
.box-left img{
  height:40px;
  width:40px;
}
.ditail-name{
  height:30px;
  font-size:1rem;
  color:#808080;
}
.ditail-bottom{
  display: flex;
  justify-content: space-between;
  width:100%;
  font-size: 0.7rem;
  margin-top:10px;
}
.ditail-bottom-right{
  display: flex;
}
.ditail-bottom-left{
  background-color: #48C251;
  color:#fff;
  padding-left:8px;
  padding-right:8px;
  border-radius: 3px;
}
.ditail-icon{
  height:13px;
  width:13px;
  margin-left: 10px;
  margin-right: 5px;
}
.ditail-bottom-icon{
  display: flex;
}

.shaitu{
  display: flex;
  flex-wrap:wrap;
}
.shaitu img{

}
.item2Imgp{
  padding-right:5px;
  padding-bottom:5px;
}


.replay-line{
	display: flex;
	
}
.name-color{
	color:#417AAF;
}
.replay{
	padding:8px;
	background-color: #F0F0F0;
}
.zanhead{
	display: flex;
	padding:10px;
	padding-left:0px;
	padding-right:0px;
}
.zanhead img{
	height: 20px;
	width:20px;
	margin-right:5px;
	border-radius: 50%;
}
.bottom-list{
	margin-left:70px;
	margin-right: 20px;
	font-size:0.8rem;
	margin-bottom: 100px;
}
.give-message{
	position: fixed;
	bottom: 0;
	background-color: #F0F0F0;
	padding:10px;
	width:100%;
	box-sizing: border-box;

}
.message-nei{
	display: flex;
	justify-content: space-between;
}
.give-message input{
	width:80%;
	border-radius: 8px;
	font-size: 0.9rem;
	padding-left: 5px;
}
.send{
	padding:5px;
	width:15%;
	border-radius: 5px;
	margin-left: 10px;
	box-sizing: border-box;
	background-color: #48C251;
	text-align: center;
	color:#fff;
}
input{
	border:none;
	outline:none;
	font-size: 1rem;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
color: #CCCCCC; 
} 
input:-moz-placeholder, textarea:-moz-placeholder { 
color: #CCCCCC; 
} 
input::-moz-placeholder, textarea::-moz-placeholder { 
color: #CCCCCC; 
} 
input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
color: #CCCCCC; 
} 

</style>

