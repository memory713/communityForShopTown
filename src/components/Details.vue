<template>
    <div >
        <!-- <mt-header title="发布圈子" style="background-color: #fff;color:#48C251;border-bottom: 1px solid #CCCCCC;">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <router-link to="/" slot="right">
                <mt-button >发布</mt-button>
            </router-link>
        </mt-header> -->
        <div class="ideas">
            <mt-field  placeholder="这一刻的想法...(不少于6个字)" type="textarea" rows="8" v-model="introduction"></mt-field>
        </div>
        <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>
        <div class="add-img" ref="elememt" >
            <span class="font14" v-show="imgList.length" >图片(最多9张，还可上传<span v-text="9-imgList.length"></span>张)</span>
            <ul class="img-list">
                <li v-for="(url,index) in imgList">
                    <img class="del"   src="../assets/shanchu.png" @click.stop="delImg(index)"/> 
                    <div class="img-chuang-div" >
                        <img :src="url.file.src" class="img-chuang" v-bind:style="{ height:item2Height+ 'px', width:item2Width + 'px' }" >
                        
                    </div>

                </li>
                <img class="add" src="../assets/add.png" @click="chooseType" v-bind:style="{ height:item2Height-5+ 'px', width:item2Width-5+ 'px', }">
            </ul>
        </div>

        <div class="choose">
            <div class="choose-nei">
                <div>选择标签</div>
                <div class="choose-box" v-for="item in typeList" :class="{ active: item.isActive }" @click="chooseTypeA(item.id)">{{item.type}}</div>
            </div>
        </div>
         <div  class="shangchuan" style="" @click="shangchuan()">立刻发布</div>
    </div>
    
</template>
<script>
import storage from '../modle/storange.js'
import imgSrc from '../modle/imgSrc.js'
import { Toast } from 'mint-ui';
import request from '../modle/request.js'
import { Header } from 'mint-ui';
import hexMD5 from '../modle/md5.js'

export default {
    name: "Feedback",
    data () {
        return {
            introduction:"",
            typeList:[],
            showFace: false,
            imgList: [],
            size: 0,
            limit:9, //限制图片上传的数量
            tempImgs:[],
            aaa:[],
            item2Height:80,
            item2Width:80,
            typeId:"",
            // active:true
        }
    
    },
    methods:{
        chooseTypeA(e){
            for (var i = 0; i < this.typeList.length; i++) {
                if(this.typeList[i].id == e){
                    this.typeList[i].isActive = true
                }else{
                    this.typeList[i].isActive = false
                }
            }
            this.typeId=e

        },
        

    chooseType() {
    document.getElementById('upload_file').click();
   },
   fileChange(el) {
    if (!el.target.files[0].size) return;
    this.fileList(el.target);
    el.target.value = ''
   },
   fileList(fileList) {
    let files = fileList.files;
    for (let i = 0; i < files.length; i++) {
     //判断是否为文件夹
     if (files[i].type != '') {
      this.fileAdd(files[i]);
     } else {
      //文件夹处理
      this.folders(fileList.items[i]);
     }
    }
   },
   //文件夹处理
   folders(files) {
    let _this = this;
    //判断是否为原生file
    if (files.kind) {
     files = files.webkitGetAsEntry();
    }
    files.createReader().readEntries(function (file) {
     for (let i = 0; i < file.length; i++) {
      if (file[i].isFile) {
       _this.foldersAdd(file[i]);
      } else {
       _this.folders(file[i]);
      }
     }
    });
   },
   foldersAdd(entry) {
    let _this = this;
    entry.file(function (file) {
     _this.fileAdd(file)
    })
   },
   fileAdd(file) {

     var widthCss = window.getComputedStyle(this.$refs.elememt).width;
      this.item2Width =(parseFloat(widthCss)-100) /4
      this.item2Height = this.item2Width


    if (this.limit !== undefined) this.limit--;
    if (this.limit !== undefined && this.limit < 0) return;
    //总大小
    this.size = this.size + file.size;
    //判断是否为图片文件
    if (file.type.indexOf('image') == -1) {
     this.$dialog.toast({mes: '请选择图片文件'});
    } else {
     let reader = new FileReader();
     let image = new Image();
     let _this = this;
     reader.readAsDataURL(file);
     reader.onload = function () {
      file.src = this.result;
      image.onload = function(){
       let width = image.width;
       let height = image.height;
       file.width = width;
       file.height = height;
       _this.imgList.push({ file });
      };
      image.src= file.src;

     
      // 上传图片
    request('POST','system.uploadImgFor64',
    {
      params: {
        imagedata:image.src
      },
      success: function (res) {
        if(res.code == 200){
            // res.data.imgurl
            _this.aaa = _this.aaa.concat(res.data.imgurl)           
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
   delImg(index) {
    var that = this
        this.size = this.size - this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);
        if (this.limit !== undefined) this.limit = 9-this.imgList.length;
        // 删除
    request('POST','system.deleteImg',
    {
      params: {
        imgurl:that.aaa[index],
      },
      success: function (res) {
        let instance = Toast(res.message);
        setTimeout(() => {
          instance.close();
        }, 2000);
      },
      fail: function () {
        let instance = Toast('您的网络有误，请检查');
        setTimeout(() => {
          instance.close();
        }, 2000);
      },
    })
        
   },
   shangchuan(){
    var that = this
    var aaaa = ""
    for (var i = 0; i < this.aaa.length; i++) {
        aaaa= aaaa+this.aaa[i]+","
    }
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

     // 上传微博 不能全英文  字数大于6个
     if(that.introduction.length < 6){
          let instance = Toast("发布字数不能少于六个字");
          setTimeout(() => {
            instance.close();
          }, 2000);
     }else if(that.typeId == ""){

      let instance = Toast('请选择发布类型');
        setTimeout(() => {
          instance.close();
        }, 2000);

     }else{
      request('POST','weibo.addWeibo',
    {
      params: {
        type:that.typeId,
        userid:userId,
        content:that.introduction,
        images:aaaa
      },
      success: function (res) {
        if(res.code==200){
          let instance = Toast(res.message);
          setTimeout(() => {
            instance.close();
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

     }
    
   }

    },
    // 生命周期函数  vue页面刷新就会触发
    mounted(){
        var that = this
        // 获取列表
    request('POST','weibo.getWeiboTypeList',
    {
      params: {},
      success: function (res) {
        if(res.code == 200){
            for (var i = 0; i < res.data.length; i++) {
                var msg={}
                msg.id = res.data[i].id
                msg.type = res.data[i].type
                msg.isActive = false
                that.typeList.push(msg)
            }
            // that.typeList[5].isActive = true
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
</script>
<style scoped>
.search_input::-webkit-input-placeholder{
    color:#CFCFCF;
}
.search_input:-moz-placeholder{
    color:#CFCFCF;
}
.search_input::-moz-placeholder{
    color:#CFCFCF;
}
.search_input:-ms-input-placeholder{
    color:#CFCFCF;
}
.ideas{
    border-bottom: 1px solid #CFCFCF;
}
.add-img{
    padding:10px;
    box-sizing: border-box;
}
.choose{
    padding:20px;
    box-sizing: border-box;
    background-color: #F0F0F0;
    border-top:1px solid #CCCCCC;
    border-bottom:1px solid #CCCCCC;
}
.add{
    margin-left: 10px;
    text-align: center;
    color:#ccc;
}
.choose-nei{
    margin-left: 10px;
}
.choose-box{
    width:22%;
    display: inline-block;
    padding-top:4px;
    padding-bottom:5px;
    box-sizing: border-box;
    margin-right:3%;
    border-radius: 5px;
    margin-top:10px;
    text-align: center;
    color:#808080;
    border:1px solid #CCCCCC;
    background-color: #fff;
}
.active{
    background-color: #48C251;
    color:#fff;
    border:1px solid #48C251;
}
.del{
    height:20px;
    width:20px;
    position: absolute;
    top:0;
    right:0;
    z-index: 2;
}
.img-chuang-div{
    padding:10px;
    box-sizing: border-box;
}
/*.img-chuang{
    height:80px;
    width:80px;
}*/
.img-list{
    padding:0;
    margin:0;
}
.img-list li{
    position: relative;
}
li{
    list-style-type:none;
    display: inline-block;
}
.shangchuan{
    width:80%;
    height:40px;
    background-color: #4BC854;
    margin-left:10%;
    margin-top:20px;
    border-radius: 5px;
    line-height: 40px;
    text-align: center;
    color:#fff;
    margin-bottom: 100px;


}
.font14{
    display: inline-block;
    margin-left: 10px;
    color:#ccc;
}

    
</style>