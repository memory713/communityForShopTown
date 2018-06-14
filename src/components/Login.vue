<template>
	<div class="body">
		<div class="phone box">
			<!-- <img src="../assets/phone.png"> -->
			<input type="text" 
			placeholder="请输入手机号码"
			v-model="phoneValue" 
			@focus="focusPhone($event)"
			>
		</div>
		<div class="password box" >
			<!-- <img src="../assets/mima2.png"> -->
			<input type="password" 
			placeholder="请输入密码"
			v-model="passwordValue"  
			@focus="focusPassword($event)"
			>
		</div>
		<div class="denglu"   @click="denglu">登录</div>
		<div class="bottom">
			<div @click="register()">立即注册</div>
			<div @click="find()">找回密码</div>
		</div>
		<div style="margin-top:30px;font-size:0.7rem;color:#48C251;">*若您已经注册伊穆家园APP，请用伊穆家园APP账号密码登录</div>
	</div>
</template>
<script >
import { Toast } from 'mint-ui';
import request from '../modle/request.js'
import storage from '../modle/storange.js'
import hexMD5 from '../modle/md5.js'



export default {
	data () {
	    return {
	    	phoneValue:"",
	    	passwordValue:""
	    }
	},
	methods:{
		// 跳转到find
		find(){
			this.$router.push({path:"find"})
		},
		register(){
			this.$router.push({path:"register"})
		},
		focusPhone(){
			this.phoneValue=""
		},
		focusPassword(){
			this.passwordValue=""
		},
		// blurPhone(value){
		// 	if(value==""){
		// 		this.phoneValue="请输入手机号码"
		// 	}
		// },
		// blurPassword(value){
		// 	if(value==""){
		// 		this.passwordValue="请输入密码"
		// 	}
		// },
		denglu(){
			// 手机号码验证
			if(this.phoneValue.length!==11){
				let instance = Toast('请输入正确的手机号码');
				setTimeout(() => {
				  instance.close();
				}, 2000);
			}else if(this.passwordValue.length<6){//密码位数验证
				let instance = Toast('密码不能少于6位');
				setTimeout(() => {
				  instance.close();
				}, 2000);
			}else{
				var that = this
				// 通过验证 请求登录接口
		      	request('POST','user.login',
	        	{
	           		params: {
	          		   	username: this.phoneValue,
	          		   	password:this.passwordValue,
	           		},
		          	success: function (res) {
		            	if(res.code!==200){
		            		let instance = Toast(res.message);
							setTimeout(() => {
							  instance.close();
							}, 2000);
		            	}else{
		            		let instance = Toast(res.message);
							setTimeout(() => {
							  instance.close();
							}, 2000);
		            		storage.set("userId",res.data.id)

		            		// MD5加密
		            		var newkey = hexMD5(res.data.id+"webkey")
		            		storage.set("newkey",newkey)
		            		
		            	
		            		// 跳转至HOME
		            		that.$router.push({path:"home"})
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
}

	
</script>
<style scoped>
.body{
	padding:30px;
	padding-top:0px;
	box-sizing: border-box;
	margin-top:100px;
}

.box{
	margin-top:20px;
	border-bottom: 1px solid #CCCCCC;
	height:50px;
	display: flex;
	padding:10px;
	box-sizing: border-box;
	color:#999;
	background-color: #fff;
}
.box img{
	height:20px;
	width: 20px;
	margin-right: 10px;
}

input{
	border:none;
	outline:none;
	font-size: 1rem;
	color:#999;
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
.denglu{
	height: 40px;
	margin-top:20px;
	width: 100%;
	background-color: #48C251;
	text-align: center;
	line-height: 40px;
	color:#fff;
}
.bottom{
	margin-top:30px;
	width:100%;
	display: flex;
	justify-content: space-between;
}
	
</style>