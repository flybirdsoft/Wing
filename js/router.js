/*
write by wuweiwei
*/
(function(win){
	var $ID = function(id){
		return document.getElementById(id);
	}
	/*
	Wing is global object
	*/
	var wRouter = Wing.wRouter;          /*路由控制器组件*/
	window.wTemplate = Wing.wTemplate;   /*模板渲染组件*/

	var routerCfg = {
		container:document.getElementById("App"),
		routes:[
			{
				url:"/index",
				controller:"Index",
				templateUrl:"tpls/index.html" /*载入模板到container指定的DOM里*/
			},
			{
				url:"/project/:id",
				controller:"project",
				templateUrl:"tpls/second.html"
			},
			{
				url:"/info",
				controller:"info",
				templateUrl:"tpls/third.html"
			}
		],
		otherwise:{
			redirectTo:"/index"
		}
	} //每个routes里的controller名字对应下面的 wRouter.controller

	wRouter.config(routerCfg); //配置路由


	wRouter.controller("Index",function(args){
		//当浏览器触发 www.x.com/index.html#/index 执行此方法
		var news = [
			{
				title:"热烈庆祝十九大召开",
				author:"中央电视台记者",
				date:"2018-1-12",
				resource:1
			},
			{
				title:"热烈庆祝十九大召开",
				author:"中央电视台记者",
				date:"2018-1-12",
				resource:2
			},
			{
				title:"热烈庆祝十九大召开",
				author:"中央电视台记者",
				date:"2018-1-12",
				resource:2
			},
			{
				title:"热烈庆祝十九大召开",
				author:"中央电视台记者",
				date:"2018-1-12",
				resource:1
			}
		];
		/*模板渲染*/
		wTemplate.repeat({
			repeatElement : $ID("myNews"), //页面id="myNews"DOM
			data : news,                   //对应页面模板里的{{title}}等字段
			render : function(object){
				item = object.item;
				index = object.index;
				return {
					"resource" : item.resource ==1 ? "内站" : "外站"
				}
			}
		});
	});


	wRouter.controller("project",function(args){
		wTemplate.repeat({
			repeatElement : $ID("param"),
			data : {id:args.id}
		});
	});



	wRouter.controller("info",function(args){
		var loadPage = function(){
			var html = $http.template("tpls/third_child.html");   //载入third_child.html页面
			var childrenContainer = $ID("childrenContainer");
			childrenContainer.innerHTML = html;  //把模板载入到trird.html指定区里

			//渲染数据
			wTemplate.repeat({
				repeatElement : $ID("repeatElement"), //third_child.html中的DOM
				data : [
					{
						col1:"this is row1 col1",
						col2:"this is row1 col2",
						col3:"this is row1 col3",
						col4:"this is row1 col4"
					},
					{
						col1:"this is row2 col1",
						col2:"this is row2 col2",
						col3:"this is row2 col3",
						col4:"this is row2 col4"
					},
					{
						col1:"this is row3 col1",
						col2:"this is row3 col2",
						col3:"this is row3 col3",
						col4:"this is row3 col4"
					}
				]
			});				
		}

		$ID("btn_load").onclick = function(){
			loadPage();
		}

	});


})(window);
