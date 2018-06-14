<template>
	<div>
		<div class="top">
			<div class="top-middle" id="" @click="tiao()">
				<img :src="headimgZ" id="img"  :onerror="logo" >
				<!-- <div class="top-word">点击修改头像</div> -->
			</div>
		</div>
		<div class="body">
			<div class="mine" @click="tiao()">
        <img src="../assets/name0.png" style="height:20px;width:20px;margin-right:10px;">
				<div class="body-left">用户名</div>
				<div class="body-right">{{username}}</div>
        <img src="../assets/right.png" class="right">
			</div>
			<div class="mine" @click="tiao()">
        <img src="../assets/name.png" style="height:20px;width:20px;margin-right:10px;">
				<div class="body-left">昵称</div>
				<div class="body-right">{{value}}</div>
        <img src="../assets/right.png" class="right">
			</div>
          <div class="myTie mine" @click="mytie()">
            <div class="mine-nei">
              <img src="../assets/tieziM.png">
              <div>我的帖子</div>
            </div>
            <img src="../assets/right.png" class="right">
          </div>
        <div class="myMes mine" style="border-right:none;" @click="myMessage()">
          <div class="mine-nei" >
            <img src="../assets/messageM.png">
            <div>我的消息</div>
          </div>
          <img src="../assets/right.png" class="right">
        </div>
		</div>

		<div class="tuichu" @click="tuichu()">
			<div>退出登录</div>
		</div>

		
        
	
	</div>
</template>
<script>
import request from '../modle/request.js'
import { Toast } from 'mint-ui';
import storage from '../modle/storange.js'
import hexMD5 from '../modle/md5.js'

 export default {
  name: "Feedback",
  data() {
   return {
   	value:'伊穆家园',
   	introduction:"",
    typeList:[],
    showFace: false,
    imgList: [],
    headimgZ:"../assets/app.png",
    logo:"this.src='../static/app.png'",
    username:"",
    userId:'',
    value2:""
   
   }
  },
  mounted(){  
      var that  = this   
     var userId = storage.get("userId")
      if(!userId){
        this.$router.push({path:"login"})
      }else{
        var newkey = storage.get("newkey")
        var yanzheng = hexMD5(userId + "webkey")
        if(newkey !== yanzheng){
          this.$router.push({path:"login"})
        }
      }
     // 获取用户信息
      request('POST','user.getUserInfo',
      {
        params: {
          userid :userId
        },
        success: function (res) {
          if (res.data.headimg == null) {
            that.headimgZ = that.headimgZ
          }else{
            that.headimgZ=res.data.headimg
          }
          
          that.value=res.data.nickname
          that.username=res.data.username
          that.userId = res.data.id
          
        },
        fail: function () {
          let instance = Toast('您的网络有误，请检查');
          setTimeout(() => {
            instance.close();
          }, 2000);
        },
      })
  },
  methods: {
     tuichu(){
      // 退出登录
      storage.set("userId",null)
      this.$router.push({path:"home"})
     },
     tiao(){
      this.$router.push({path:"HeaderChange"})
    },
    myMessage(){
      this.$router.push({path:"father"})
    },

    mytie(){
      this.$router.push({path:"BigImg"})
    },
    
  }	

 }
</script>
<style >
input{
	border:none;
	outline:none;
	color:#999;

}
.top{
	padding:50px;
	box-sizing: border-box;
	text-align: center;
	border-bottom: 10px solid #F4F4F4;
}
.top-middle{
	height:80px;
	text-align: center;

}
.top-middle img{
	margin:0 auto;
	height:80px;
	width:80px;
	border-radius: 50%;
}
.top-word{
	text-align: center;
	color:#808080;
	margin-top:10px;
}
.body{
	padding:20px;
  padding-bottom: 0px;
	padding-top:0px;

	box-sizing: border-box;
}
.input{
  display: flex;
	padding-top:15px;
	padding-bottom:15px;
	box-sizing: border-box;
	border-bottom: 1px solid #D9D9D9;
  background-color: #fff;
}
.input div{
	display:inline-block;
}
.body-left{
	width:30%;
}
.body-right{
	width:55%;
	font-size: 0.8rem;
}
.tuichu{
	width:100%;
	position:fixed;
	bottom:20px;
	padding:20px;
	box-sizing: border-box;
}
.tuichu div{
	/*background-color: #4BC653;*/
	width:100%;
	height:50px;
	line-height: 50px;
	text-align: center;
	border-radius: 5px;
  color:#808080;
  border:1px solid #808080;
}



input[type='file']{
  outline: none;
  margin-top: 20px;
}
*{
  margin: 0;
  padding: 0;
}
#clip_button {
  position: absolute;
  right: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border:none;
  border-radius: 2px;
  background: #1AAD19;
  color: #fff;
}
#cancel_clip{
  position: absolute;
  left: 10%;
  bottom: 20px;
  width: 80px;
  height: 40px;
  border:none;
  border-radius: 2px;
  color: #fff;
  background:#E64340;
}
#clip_container.container {
  z-index: 99;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,1);
}
#clip_container.container > div{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
#clip_image {
  max-width: 100%;
}

.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}
.crop_loading , .crop_success {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.crop_loading .crop_content{
  position: absolute;
  top: 50% ;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  height: 100px;
  width: 100px;
  vertical-align: middle;
  color: #fff;
  padding-top: 20px;
  font-size: 16px;
  -webkit-border-radius:3px;
  border-radius:3px;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
.crop_loading .crop_content img{
  margin-top: 15px;
  margin-bottom: 10px;
}
.crop_success .crop_success_text{
  position: absolute;
  top: 50% ;
  left: 50%;
  text-align: center;
  background: #000;
  opacity: 0.9;
  width: 120px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  font-size: 16px;
  -webkit-border-radius:3px;
  border-radius:3px;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
.cropper-container img {
  /* Avoid margin top issue (Occur only when margin-top <= -height) */
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: .5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;

  width: 100%;
  height: 100%;

  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;

  display: block;

  opacity: .5;
  border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;

  display: block;

  width: 0;
  height: 0;

  opacity: .75
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;

  display: block;

  width: 100%;
  height: 100%;

  opacity: .1;
}

.cropper-face {
  top: 0;
  left: 0;

  background-color: #fff;
}

.cropper-line {
  background-color: #39f
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}

.cropper-point {
  width: 5px;
  height: 5px;

  opacity: .75;
  background-color: #39f
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}

@media (min-width: 768px) {

  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}

@media (min-width: 992px) {

  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}

@media (min-width: 1200px) {

  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  position: absolute;

  display: block;

  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
.mine-nei{
  display: flex;
}
.mine-nei img{
  height:20px;
  width:20px;
  margin-right:10px;
}
.mine{
  display: flex;
  justify-content: space-between;
  padding:8px;
  padding-top:15px;
  padding-bottom:15px;
border-bottom: 1px solid #D9D9D9;
}
.bottom{
  display: flex;

  box-sizing: border-box;
  
  background-color: #fff;
  padding:5px;
  
}
.right{
  margin-top:2.5px;
  height:15px;
  width:10px;
}
/*.shuxian{
  height:80px;
  width:1px;
  background-color: #ccc;
}
	*/
</style>