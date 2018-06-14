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
		<!-- 验证码 -->
		<div class="yanzhengma box">
			<!-- <img src="../assets/mima2.png"> -->
			<input type="text" 
			placeholder="请输入验证码" 
			style="width:50%;" 
			v-model="yanzhengmaValue"  
			@focus="focusYanzhengma($event)"
			
			>
			<div class="get-message" @click="send()">{{time}}</div>
		</div>
		<!-- 密码 -->
		<div class="password box">
			<!-- <img src="../assets/mima2.png"> -->
			<input type="password" 
			placeholder="请输入密码" 
			v-model="passwordValue"  
			@focus="focusPassword($event)"
			
			>
		</div>
		<!-- 确认密码 -->
		<div class="passwordAgain box">
			<!-- <img src="../assets/mima2.png"> -->
			<input type="password" 
			placeholder="请确认密码" 
			v-model="passwordAgainValue"  
			@focus="focusPasswordAgain($event)"
		
			>
		</div>
		<div class="denglu"   @click="zhuce()">注册</div>
		<div class="bottom">
			<div @click="yanzhengma()">未收到验证码？</div>
		</div>
	</div>
</template>
<script >
import { Toast } from 'mint-ui';
import request from '../modle/request.js'
import storage from '../modle/storange.js'


export default {
	data () {
	    return {
	    	phoneValue:"",
	    	passwordValue:"",
	    	yanzhengmaValue:"",
	    	passwordAgainValue:"",
	    	time: "获取验证码",
	        currentTime: 61,
	        disabled:true,
	        value0:''
		    }
	},
	methods:{
		yanzhengma(){
			let instance = Toast("请联系客服 4008-123-337");
			setTimeout(() => {
			  instance.close();
			}, 8000);
		},
		focusPhone(){
			this.phoneValue=""
		},
		focusYanzhengma(){
			this.yanzhengmaValue=""
		},

		focusPassword(){
			this.passwordValue=""
		},
		focusPasswordAgain(){
			this.passwordAgainValue=""
		},

		// blurPhone(value){
		// 	if(value==""){
		// 		this.phoneValue="请输入手机号码"
		// 	}
		// },
		// blurYanzhengma(value){
		// 	if(value==""){
		// 		this.yanzhengmaValue="请输入验证码"
		// 	}
		// },
		// blurPassword(value){
		// 	if(value==""){
		// 		this.passwordValue="请输入密码"
		// 	}
		// },
		// blurPasswordAgain(value){
		// 	if(value==""){
		// 		this.passwordAgainValue="请确认密码"
		// 	}
		// },
		// 发送验证码
		send(){
			var that = this
			// 验证手机格式
			that.phoneValue = that.phoneValue.replace(/\s+/g, '')
			if(that.phoneValue.length!==11){

				let instance = Toast('请输入有效的手机号码');
				setTimeout(() => {
				  instance.close();
				}, 2000);
			}else{
				if(that.disabled){
				// 发送验证码
		      	request('POST','system.sendUserSms',
	        	{
	           		params: {
	          		   	telphone: that.phoneValue,
	          		   	sendtype:1,
	           		},
		          	success: function (res) {
		          		if(res.code == 200){
		          			let instance = Toast(res.message);
							setTimeout(() => {
							  instance.close();
							}, 2000);
							var interval = setInterval(function () {
				                that.currentTime--
				                that.time= that.currentTime + '秒'
				                that.disabled=false
				                if (that.currentTime <= 0) {
				                    clearInterval(interval)
				                    that.time='重新发送'
				                    that.currentTime= 61
				                    that.disabled=true
				                }
				            }, 1000)
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
		},

		zhuce(){
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
			}else if(this.passwordValue!== this.passwordAgainValue){//确认密码验证
				let instance = Toast('两次密码不一致');
				setTimeout(() => {
				  instance.close();
				}, 2000);
			}else{
				var that = this
				// 通过验证 请求登录接口
		      	request('POST','user.register',
	        	{
	           		params: {
	          		   	username: that.phoneValue,
	          		   	password:that.passwordValue,
	          		   	smscode:that.yanzhengmaValue,
	          		   	confirmpassword:that.passwordAgainValue
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
		            		// 跳转至登录
		            		that.$router.push({path:"login"})
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
	justify-content: space-between;
	padding:10px;
	box-sizing: border-box;
	color:#999;
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
.get-message{
	text-align: center;
	/*width:100px;*/
	border:1px solid #ccc;
	border-radius: 3px;
	padding-left: 5px;
	padding-right: 5px;
	line-height: 30px;
	height:30px;
	font-size: 0.8rem;
	box-sizing: border-box;
	color:#ccc;
}
	
</style>