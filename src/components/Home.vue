<template>
	<div  style="position:relative;" class="body"  >
      <div class="gudong">
      <div class="shuaxin" @click="shuaxin()" >
       <img src="../assets/shuaxin.png">
      </div>
        <div class="fabu" @click="fabu()">
          <img src="../assets/write.png">
        </div>
        
      </div>
      <v-touch v-on:tap="jishi()">
      <div class="mengcengImg" v-show="mengcengImgT" @touchmove.prevent >
        <mt-swipe :auto="0" style="height:100%;">
          <mt-swipe-item v-for="item in lunboSrc" class="mengcengImgnei">
              <img :src="item"><span></span>
          </mt-swipe-item>
        </mt-swipe>
      <!--   <img :src="mengcengImg"><span></span>   -->
      </div></v-touch>




	    <div class="bgc">
	      <div class="user" @click="headChange()">
	        <div class="user-name" @click="getData()" style="color: rgb(0,0, 0);font-weight: 550;">{{nickname}}</div>
	        <div class="user-img" >
	          <img :src="headimgZ" :onerror="logo" style="box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.4);">
	        </div>
	      </div>
	    </div>
      <div class="fenlei" ref="elememt">
        <div class="type-box">
          <div class="type-boxes" @click = "chooseType()" :class="{ active:isActive0 }" >全部消息</div>
        </div>
        <div class="type-box"  v-for="item in typeList">
          <div class="type-boxes" @click = "chooseType(item.id)" :class="{ active: item.isActive }">{{item.type}}</div>
        </div>
      </div>
      <div  class="message-user" v-show="cunzai" @click="messageList()">
          <img :src="messageHeadimg">
          <div class="message-user-word">{{numMessage}}条新消息</div>
      </div>
      <div class="ditails-wai" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
      <div class="ditails" v-for="(item,index) in details"   >
        <div class="ditails-box">
          <div class="box-left" @click="pinglun(item.id)">
            <img :src="item.headimg" :onerror="logo" >
          </div>
          <div class="box-right" >
            <div class="ditail-name">{{item.nickname}}</div>
            <div style="margin-bottom: 10px;" @click="pinglun(item.id)">{{item.content}}</div>
            <div class="shaitu" style="width:100%;"  >
              <img :src='item2+"?imageView2/1/w/150/h/150/q/75|imageslim"' v-lazy="item2" v-for="item2 in item.images" v-bind:style="{ height: item.item2Height+ 'px', width: item.item2Width + 'px' }" class="item2Imgp" :onerror="logo" @click="tiaozhuanfangda(item.images)">
            </div>
            <div class="ditail-bottom">
              <div class="ditail-bottom-left">{{item.weibotype}}</div>
              <div class="ditail-bottom-right">
                <div class="ditail-bottom-icon">
                  <img src="../assets/time.png" class="ditail-icon">
                  <div>{{item.pasttime}}</div>
                </div>
                <div class="ditail-bottom-icon">
                  <img :src="item.iszan" class="ditail-icon" @click="dianzan(item.id,index)">
                  <div>{{item.zan}}</div>
                </div>
                <div class="ditail-bottom-icon" @click="pinglun(item.id)">
                  <img src="../assets/huifu.png" class="ditail-icon" >
                  <div>{{item.pinglun}}</div>
                </div>
              </div>
              
          </div>
<!-- 评论 -->
          <div v-show="item.replayListNone" style="padding: 8px;background-color: #F0F0F0;margin-top:5px;font-size:0.68rem;">
            <div class="replay-line" v-for="item3 in item.replylist" >
              <div style="display:flex;justify-content:space-between;width:100%;">
                <div>
                  <span class="name-color" >{{item3.nickname}}</span> <span v-show="item3.replynickname" >回复 <span class="name-color">{{item3.replynickname}}</span></span>：<span>{{item3.content}}</span>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
      </div>
      <div v-show="!loading" class="loading">
        <mt-spinner type="fading-circle"></mt-spinner>
        <div>加载中...</div>
      </div>
      <div v-show="loading" style="width:100%;height:50px;line-height:50px;text-align:center;color:#ccc;">没有更多信息了</div>
</div>
	</div>
</template>
<script>
import $ from 'jquery'
import storage from '../modle/storange.js'
import { Toast } from 'mint-ui';
import request from '../modle/request.js'
import hexMD5 from '../modle/md5.js'
import { Lazyload } from 'mint-ui';

export default {
  data () {
      return {
        mengcengImg:"../static/app.png",
        headimgZ:"../static/app.png",
        typeList:[],
        details:[],
        isActive:true,
        nickname:"游客",
        id:1,
        loading: false,
        mengcengImgT:false,
        lunboSrc:[],
        page:1,
        logo:"this.src='../static/app.png'",
        item2Height:50,
        item2Width:50,
        isActive:false,
        userId:"",
        numMessage:"1",
        cunzai:false,
        messageHeadimg:'../static/app.png',
        jishinum:0,
        isActive0:true,
        numWaiting:true,
        replayList:[]
        // iszan:"../static/zan.png"
        // loading2:true
      }
  },
  mounted(){     /*请求数据，操作dom , 放在这个里面  mounted*/
  
 this.lifeBegin()

  },
  beforeDestroy () {
      clearInterval(this.interval)
     
    },
  methods:{

    lifeBegin(){

          // http://sq.emjiayuan.com/#/Home?userid=1&token=abc&app=1
    var useridNew = this.$route.query.userid
    var token = this.$route.query.token
    var app = this.$route.query.app
    if((useridNew == undefined)||(useridNew == null)||(useridNew == "")){
      storage.set("app",2)
    }else{
      storage.set("userId",useridNew)
      storage.set("newkey",token)
      storage.set("app",1)
    }


    var that = this
     var userId = storage.get("userId")
    if(userId!==null){
      var newkey = storage.get("newkey")
      var yanzheng = hexMD5(userId + "webkey")
      if(newkey !== yanzheng){
        this.$router.push({path:"login"})
      }
      // 获取用户信息
      request('POST','user.getUserInfo',
      {
        params: {
          userid :userId
        },
        success: function (res) {
          that.userId = res.data.id
          
          if (res.data.headimg == null) {
            that.headimgZ = that.headimgZ
          }else{
            that.headimgZ=res.data.headimg
          }
          that.nickname=res.data.nickname
          that.username=res.data.username
          if(that.nickname.length == 0){
            that.nickname == that.username
          }
        },
        fail: function () {
          let instance = Toast('您的网络有误，请检查');
          setTimeout(() => {
            instance.close();
          }, 2000);
        },
      })

       // 获取消息列表
      request('POST','weibo.getWeiboMessage',
      {
        params: {
          userid:userId,
          
        },
        success: function (res) {
          that.numMessage = res.data.num
          if(that.numMessage!=="0"){
            that.cunzai=true
            that.messageHeadimg = res.data.user.headimg
            if(that.messageHeadimg == null){
              that.messageHeadimg = "../static/app.png"
            }
          }else{
            that.cunzai=false
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

     //发起请求
    request('POST','weibo.getWeiboTypeList',
    {
      params: {},
      success: function (res) {

        // that.typeList = res.data
        for (var i = 0; i < res.data.length; i++) {
          var msg = []
          msg.id = res.data[i].id
          msg.type = res.data[i].type
          msg.isActive = false
          that.typeList.push(msg)
        }
        // 初始化数据
        that.chooseType()
      },
      fail: function () {
        let instance = Toast('您的网络有误，请检查');
        setTimeout(() => {
          instance.close();
        }, 2000);
      },
    })
     
      this.dingshishuaWEB()
    // 获取用户名和头像昵称


    },
    dingshishuaWEB(){
          var that = this


var userId = storage.get("userId")
if(userId!==null){
 
    this.interval = setInterval(function () {

          if(that.numWaiting){
            that.numWaiting = false
            // 获取消息列表
      request('POST','weibo.getWeiboMessage',
      {
        params: {
          userid:userId,
          
        },
        success: function (res) {

          that.numWaiting = true
          that.numMessage = res.data.num
          if(that.numMessage!=="0"){
            that.cunzai=true
            that.messageHeadimg = res.data.user.headimg
            if(that.messageHeadimg == null){
              that.messageHeadimg = "../static/app.png"
            }
          }else{
            that.cunzai=false
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
    }, 2500)
            
      


        
   
  }

    },
    messageList(){
      this.$router.push({path:"father"})
    },
    panduan(targetPath){
      var app = storage.get("app")
      var userId = storage.get("userId")
      if (!userId) {
        this.$router.push({path:"login"})
      }else{
          var newkey = storage.get("newkey")
          var yanzheng = hexMD5(userId + "webkey")
          if(newkey !== yanzheng){
            this.$router.push({path:"login"})
          }else{
            if (targetPath=="header") {
              // 传参跳转
              
              if(app == 1){
                this.$router.push({path:"headerNew"})
              }else{
                this.$router.push({path:"header"})
              }
             
            }else{
              this.$router.push({path:targetPath})
            }
            
          }
      }


    },
  	fabu(){
      // 判断是否登录
      this.panduan("details")
  	},

    chooseType(id){
      if(id == undefined){
        this.isActive0=true
      }else{
        this.isActive0=false
      }
      var that = this
      this.id = id
      // 改变点击后的样式
      for (var i = 0; i < this.typeList.length; i++) {
        if(this.typeList[i].id == id){
          this.typeList[i].isActive = true
        }else{
          this.typeList[i].isActive = false
        }
      }
      this.requireData(this.id,1)
    },
      // 获取数据
    requireData(id,pageindex){
        var userId = storage.get("userId")
        var that = this
        var heightCss = window.getComputedStyle(that.$refs.elememt).width;

            //请求微博列表
      request('POST','weibo.getWeiboList',
      {
        params: {
          type:id,
          loginuserid:userId,
          pageindex:pageindex,
          pagesize:20
        },
        success: function (res) {
          console.log(res)
          that.loading = true;
          if(res.code == 200){
            var details = res.data
            var detailaData =[]
            for (var i = 0; i < details.length; i++) {
              
              // 判断是否有用户对用户的评论
              that.replayList=details[i].replylist
              
                if(details[i].headimg){
                  details[i].headimg =details[i].headimg 
                }else{
                  details[i].headimg  ="../static/app.png"
                }
              if(details[i].pasttime.length>11){
                details[i].pasttime = details[i].pasttime.substr(0,8)
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
              msg.replylist = details[i].replylist
              

              // 判断评论条数
              if(details[i].replylist.length==0){
                msg.replayListNone=false
              }else{
                msg.replayListNone=true
              }

             
              
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
            if(pageindex==1){
              that.details = detailaData
            }else{
              that.details = that.details.concat(detailaData)
            }
            if(details.length<20){
              that.loading = true;
            }else{
              that.loading = false;
            }

          }else{
            that.loading = true;
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
        var newkey = storage.get("newkey")
        var yanzheng = hexMD5(userId + "webkey")
          if(newkey !== yanzheng){
            var dianzanyufou = false
          }else{
            var dianzanyufou = true
          }
        this.panduan("home")
        if(dianzanyufou){
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
        }

      },
      // 换头像
      headChange(){
        this.panduan("header")
      },
      pinglun(aid){

        // 跳转到评论路由
        this.$router.push({path:"pinglun"+aid})
      },
    loadMore(){
    // this.loading=true,
      var that  = this
      setTimeout(() => {
        this.page = this.page+1
        that.requireData(that.id,that.page)
        
      }, 2500);
    },
    tiaozhuanfangda(e){
  
      console.log(e)
      this.lunboSrc = e
      // this.mengcengImg = e
       $('.mengcengImg').animate({height:"100%",width:"100%",top:"0",left:"0"}, 300)
      this.mengcengImgT=true

   
    },

    jishi(){

        this.mengcengImgT=false
    },
  
  
    shuaxin(){
      $('html,body').animate({scrollTop: '0px'}, 800)
      setTimeout(() => {
        this.requireData(this.id,1)
      }, 1000);
    }


  },
  created(){

    var vm=this;
    window.onscroll=function(){
        if (document.documentElement.scrollTop>60) {
            vm.isActive=true;
        }else {
            vm.isActive=false;
        }
    }
}
}
</script>
<style scoped >
.ovfHiden{overflow: hidden;height: 100%;}
.top{
  background-color: #4BC754;
  height:40px;
  position: relative;
  text-align: center;
  color:#fff;
}
.message{
  position: absolute;
  display: table-cell;
  right: 0;
  top: 0;
  height: 100%;
  width: 4rem;
  text-align: center;

}
.message img{
  margin-top:10px;
  width: 20px;
  height: 20px;

}
.top-word{
  font-size: 1rem;
  line-height: 40px;

}
image[lazy=loading] {
  width: 40px;
  height: 40px;
  margin: auto;
}
.bgc{
  height:160px;
  background-image:url(../assets/quanzitop.jpg); 
  background-repeat:no-repeat; 
  background-size:100% 100%;
  padding-top:50px;
  box-sizing: border-box;
}
.user{
  height:60px;
  display: flex;
  justify-content: flex-end;
  padding-left: 60px;
  padding-right: 20px;
}
.user div{display: inline-block;}
.user-img{
  height: 60px;
  width: 100px;
  border-radius:50%;
  text-align: center;
}
.user-img img{height: 100%;width: 60px;}
.user-name{
  color:#fff;
  line-height: 60px;
  font-size: 1rem;

box-sizing: border-box;
}
.fenlei{
  padding:10px;
  padding-top:5px;
  padding-bottom:5px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(217, 217, 217,0.5);
}
.type-box{
  width: 19%;
  display: inline-block;
  text-align: center;
  color: #808080;
  padding:5px;
  box-sizing: border-box;
  font-size: 0.8rem;
}
.type-boxes{
  font-size: 0.7rem;
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  display: inline-block;
  height:100%;
  width: 100%;
  line-height:20px;
}
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
.active{

  background-color: #48C251;
  color:#fff;
  border:1px solid #48C251;
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
.gudong{
  position: fixed;
  z-index:10;
  bottom:30px;
  right:15px;
}
.shuaxin{
  margin-left: 10px;
  margin-bottom: 5px;
  /*transform: rotate(90deg);*/
}
.shuaxin img{width: 25px;height: 25px;}
.fabu img{width: 45px;height: 45px;}
.loading{
  margin-top:5px;
  margin-bottom:5px;
  width:100%;
  text-align: center;
  color:#ccc;
}
.loading span{
  display: inline-block;
}
.message-user{
  height:40px;
  width:50%;
  margin:0 auto;
  position: relative;
  background-color: #5C5C5C;
  margin-top:20px;
  color:#fff;
  text-align: center;
  line-height: 40px;
  border-radius: 8px;
}
.message-user img{
  position: absolute;
  top:5px;
  left: 10px;
  height:30px;
  width:30px;
}
.mengcengImg{
  position: fixed;
  top:50%;
  left:50%;
  z-index: 99;
  width:0%;
  background-color: #000;
  height:0%;

  
}
.mengcengImgnei span{ display:inline-block; height:100%; vertical-align:middle;}  

.mengcengImgnei{
display: table-cell;
        
}
.mengcengImgnei img{
  width: 100%;
  vertical-align:middle;

}

/*评论*/
.replay-line{
  display: flex;
  
}

.replay{
  padding:8px;
  background-color: #F0F0F0;
}
.name-color{
  color:#417AAF;
}


</style>
