<template>
  <div style="width:100%;" ref="elememt" >
  <div class="mengcengImg" v-show="mengcengImgT" @touchend="xiaoshi()" @touchstart="jishi()">
        <img :src="mengcengImg"><span></span>  
      </div>
    <div class="ditails" v-for="(item,index) in details"   >
        <div class="ditails-box">
          <div class="box-left">
            <img :src="item.headimg" :onerror="logo" >
          </div>
          <div class="box-right" >
            <div class="ditail-name">{{item.nickname}}</div>
            <div style="margin-bottom: 10px;">{{item.content}}</div>
            <div class="shaitu" style="width:100%;"  >
              <img :src="item2" v-for="item2 in item.images" v-bind:style="{ height: item.item2Height+ 'px', width: item.item2Width + 'px' }" class="item2Imgp" :onerror="logo" @click="tiaozhuanfangda(item2)">
            </div>
            <div class="ditail-bottom">
              <div style="display:flex;">
              	<div class="ditail-bottom-left">{{item.weibotype}}</div>
              	<div style="color:#9CBDD9;margin-left:10px;" @click="deleteA(item.id)">删除</div>
              </div>
              
              <div class="ditail-bottom-right">
                <div class="ditail-bottom-icon">
                  <img src="../assets/time.png" class="ditail-icon">
                  <div>{{item.pasttime}}</div>
                </div>
                <div class="ditail-bottom-icon">
                  <img :src="item.iszan" class="ditail-icon" @click="dianzan(item.id,index)">
                  <div>{{item.zan}}</div>
                </div>
                <div class="ditail-bottom-icon">
                  <img src="../assets/huifu.png" class="ditail-icon" @click="pinglun(item.id)">
                  <div>{{item.pinglun}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import request from '../modle/request.js'
import storage from '../modle/storange.js'
export default {
  data () {
    return {
    	logo:"this.src='../static/app.png'",
    	details:[],
    	mengcengImg:"../static/app.png",
    	mengcengImgT:false,
    }
  },
  mounted(){
  	this.jiazai()
  },
  methods:{
  	jiazai(){
  		var that = this
  	var userId = storage.get("userId")
  // 获取用户tiezi
      request('POST','weibo.getWeiboList',
      {
        params: {
          userid :userId,
          loginuserid:userId
        },
        success: function (res) {
        	
          
          var heightCss = window.getComputedStyle(that.$refs.elememt).width;

          var details = res.data
            var detailaData =[]
            for (var i = 0; i < details.length; i++) {
                if(details[i].headimg){
                  details[i].headimg =details[i].headimg 
                }else{
                  details[i].headimg  ="../static/app.png"
                }
              if(details[i].pasttime.length>11){
                details[i].pasttime = details[i].pasttime.substr(0,11)
              }
              var msg = {}
              msg.headimg = details[i].headimg
              msg.weibotype = details[i].weibotype
              msg.content = details[i].content
              msg.pasttime = details[i].pasttime
              msg.nickname = details[i].nickname
              msg.zan = details[i].zan
              msg.images = details[i].images
              msg.pinglun = details[i].pinglun
              msg.iszan = details[i].iszan
              msg.id = details[i].id
              
              // 判断赞与否
              if(msg.iszan){
                msg.iszan = "../static/dianzan.png"
              }else{
                msg.iszan = "../static/zan.png"
              }

              // 获取元素宽度
              var aaa = msg.images.length  
              if(aaa==1){
                msg.item2Width = parseFloat(heightCss) - 200
                msg.item2Height = msg.item2Width-50
              }else{
                msg.item2Width = (parseFloat(heightCss) - 100)/3 -5
                msg.item2Height = msg.item2Width
              }
              detailaData.push(msg)
            }
          
              that.details = detailaData

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
	            }, 2000);
	            that.jiazai()
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
  	
  	// 点赞
      dianzan(id,index){
        var that = this
        var userId = storage.get("userId")
            //发起请求
        request('POST','weibo.zanWeibo',
        {
          params: {
            weiboid:id,
            userid:userId
          },
          success: function (res) {
            if(res.code == 200){
              let instance = Toast({
                message: '点赞成功',
                iconClass: 'mintui mintui-success'
              });
              setTimeout(() => {
                instance.close();
              }, 2000);
              that.details[index].iszan  = "../static/dianzan.png"
              that.details[index].zan  = res.data
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
        pinglun(aid){

        // 跳转到评论路由
        this.$router.push({path:"pinglun"+aid})
      },
      tiaozhuanfangda(e){
      this.mengcengImg = e
      $('.mengcengImg').animate({height:"100%",width:"100%",top:"0",left:"0"}, 300)
      this.mengcengImgT=true
    },
        jishi(){
      var num = 0
      this.jishinum = 0
      var that = this
      var interval = setTimeout(function () {
          clearInterval(interval)
          num=num+2
          that.jishinum = num
      }, 1000)
    },
    xiaoshi(){
        if(this.jishinum<2){
          $('.mengcengImg').animate({height:"0%",width:"0%",top:"50%",left:"50%"}, 300)
          setTimeout(() => {
              this.mengcengImgT=false
          }, 200);
        }
    }

  }
}
</script>
<style >
	.ditails{
  padding:20px;
  padding-bottom:10px;
  border-bottom: 1px solid rgba(217, 217, 217,0.5);
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
  height:50px;
  width:50px;
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
.mengcengImg{
  position: fixed;
  top:50%;
  left:50%;
  z-index: 99;
  width:0%;
  background-color: #000;
  height:0%;

  text-align: center;
}
.mengcengImg span{ display:inline-block; height:100%; vertical-align:middle;}  
.mengcengImg img{
  width: 100%;
  vertical-align:middle;

}
</style>