# Wing
This is simple SPA framework

引用wing.js

## 引用方式

wing.js

下载地址：http://www.flybirdsoft.com/wing/libs/wing.js 

示例：http://www.flybirdsoft.com/wing/demo

## 页面+路由+控制器 配置示例

wRouter对象用于设置路由和控制器

var wRouter = Wing.wRouter; //下面用到wRouter对象


##### 路由配置
			
	wRouter.config({
		container : document.getElementById("view"),          /*设置单页应用的容器,用于载入单页面*/
		routes:[
			{
				url:"/index",                         /*页面路由*/
				controller:"index",                   /*路由的名称,根据含义起名*/
				templateUrl:"tpls/index/index.html"   /*载入的页面,当在浏览器执行"#/index"后,会自动载入此页面*/
			},
			{
				url:"/project/:projectId/:versionId/:projectName/:folderId",
				//浏览器地址URL例如: www.x.com/project/2018/123456/abc/myforder
				controller:"project",
				templateUrl:"tpls/projects/projectFileList.html"
			},
			{
				url:"/flow",
				controller:"flow",
				templateUrl:"tpls/flow/flow.html"
			}
		],
		otherwise:{
			redirectTo:"/index"
		}
	});
			
		
##### 控制器配置

	wRouter.controller("index",function(args){

	});
	wRouter.controller("project",function(args){
		/*
		以下四个参数对应上面第二个路由的url参数
		args.projectId => 对应 :projectId
		args.versionId => 对应 :versionId
		args.projectName => 对应 :projectName
		args.folderId => 对应 :folderId
		*/
	});
	wRouter.controller("flow",function(args){

	});
		
上述三个操作配置好,程序就能跑起来,是不是很简单！


## 路由控制器API

	wRouter.config(config);
	
#### 配置路由信息

	wRouter.config({
		container : document.getElementById("view"),          /*设置单页应用的容器,用于载入单页面*/
		routes:[
			{
				url:"/index",                         /*页面路由*/
				controller:"index",                   /*路由的名称,根据含义起名*/
				templateUrl:"tpls/index/index.html"   /*载入的页面,当在浏览器执行"#/index"后,会自动载入此页面*/
			},
			{
				url:"/project/:projectId/:versionId/:projectName/:folderId",
				//浏览器地址URL例如: www.x.com/project/2018/123456/abc/myforder
				controller:"project",
				templateUrl:"tpls/projects/projectFileList.html"
			},
			{
				url:"/flow",
				controller:"flow",
				templateUrl:"tpls/flow/flow.html"
			}
		],
		otherwise:{
			redirectTo:"/index"
		}
	});

参数说明：

	container
		模板容器

	routes
		url
			设置页面路由
		controller
			控制器名字,wRouter.controller()用到这个名字
		templateUrl
			配置模板页面,当路由触发时,会自动调用模板页面并载入container容器里
	otherwise
		redirectTo
			默认路由配置

#### 配置控制器(controller)

	wRouter.controller(controllerName,callback)
	配置控制器,当路由被触发会调用callback函数

	wRouter.controller("index",function(args){
		//args 是路由url动态参数
		//coding here
	});

	wRouter.commonController(callback)
	配置通用控制器,不管触发哪个路由都会调用callback函数;

	wRouter.commonController(function(isFirst){
		//isFirst is boolean ,是否首次加载
		//coding here
	})

	wRouter.callController(controllerName,objectJSON)
	调用某个controller;

	wRouter.callController(“myController”，{key:value});

	wRouter.endController(callback)
	档切换路由后会触发endController;

	wRouter.endController(function (controllerName) {

	});

## 辅助功能
	$http.template(path)
载入模板页面

$http是全局变量
	var html = $http.template("tpls/resource.html");
	docment.getElementById("myId").innerHTML = html;
		
	$location
	$location是全局对象,封装了url信息,目前对象是只读功能

	$location.url
	$location.host
	$location.fileName
	$location.port
	$location.param      /*?后面的get字符串*/
	$location.params   
	/*格式是?key=value&key=value ， 然后转换成{key:"xx",value:"ddd"}存入params*/
	$location. action      /*url中#号后面的/xx/xxx */

		
## 模板渲染应用
##### 获取模板引擎对象
var template = Wing.wTemplate; //下面用到template对象
设置模板标记

    template.startSymbol("{{"); //可选项 startSymbol 默认{{
    template.endSymbol("}}"); //可选项endSymbol 默认}}
		
##### HTML

	<div id= "repeatDOM" class="app-myappfl {{bgcolor}}">
	    <div class="app-myapp-shared">{{numbers.app.count}}</div>
	    <div class="app-myapp-photo icons"></div>
	    <div class="app-myapp-caption">{{title}}</div>
	    <div class="app-myapp-op">
		<a target="_blank" href="http://{{url}}">{{url}}</a>
	    </div>
	</div>

		
##### 模板数据渲染

	var data = [
	    {
		title:"我的应用",
		url:“www.xx.com",
		numbers:{
		    app:{
			count:50
		    }
		}
	    }
	]

	template.repeat({
	    repeatElement:document.getElementById("repeatDOM"),
	    data : data
	});

	或

	template.repeat({
	    repeatElement:document.getElementById("repeatDOM"),
	    data : data,
	    render:function(object){
		var item = object.item;
		return{
		    "title":"自定义字段值"
		}
	    }
	});

		
##### 模板数据渲染参数说明

	template.repeat({
	    type : "cover",
	    /*
	    数据渲染方式;默认cover,
	    type=insert 是把data添加到现有DOM元素前边
	    type=append 是把data数据添加到DOM元素后边
	    */
	    repeatElement:$("#repeatDOM")[0],
	    /*被渲染的元素即模板*/
	    data : data,
	    /*渲染的数据 is array*/
	    render:function(object){
		var item = object.item;
		var index = object.index;
		return{
		    “title”:“自定义字段值”,
		    “url”  :”http://”+item.url
		}
	    }
	    /*
	    render 函数是data数据处理函数,用于自定义字段值
	    */
	});
