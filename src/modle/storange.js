// 封装本地存储方法。模块化文件

var storage={
	set(key,value){
		localStorage.setItem(key,JSON.stringify(value))
	},
	get(key){
		return JSON.parse(localStorage.getItem(key))

	},
	remove(key){
		localStorage.removeItem(key)
	}

}

export default storage