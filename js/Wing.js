/*
Wing.js
write by wuweiwei

www.flybirdsoft.com/Wing
www.flybirdsoft.com/WUI
www.cnblogs.com/wsoft
www.github.com/flybirdosft

*/


(function(win){
	
	"use strict";

	var wRouter={
		version:"1.0",
		route:[],
		defRouteIndex:0,
		commonControllerHandler:function(isFirst){},         
		endControllerHandler   :function(controllerName){},
		isFirstLoad:true ,                                   
		prevControllerName:""
	};

	wRouter.event={};                    
	wRouter.http={useMask:true};        
	wRouter.template={};                 
	
	/*浏览器URL存储管理*/
	wRouter.location={
		url:"",
		host:"",
		fileName:"",    
		port:"",
		param:"",     
		params:[],    
		action:""    
	};


	wRouter.isIE=function(){
		/*
		if(navigator.userAgent.indexOf("MSIE 8")>0)
		{return true;}
		*/
		if(navigator.userAgent.indexOf("MSIE 7")>0)
		{return true;}
		if(navigator.userAgent.indexOf("MSIE 6")>0)
		{return true;}
		return false;
	}

	wRouter.isIE8=function(){
		if(navigator.userAgent.indexOf("MSIE 8")>0)
		{return true;}
		return false;
	}

	wRouter.onLoad = function(){
		window.onload=function(){
			var reg=/\/:\w{1,}/;
			if(window.location.href.indexOf("#")==-1)
			{
				window.location.href=wRouter.location.fileName+"#"+wRouter.route.routes[wRouter.defRouteIndex].url.replace(reg,"");
				if(wRouter.isIE())
				{
					wRouter.event.onhashchange();
				}		
			}
		}
	}


	wRouter.location.getURL=function(url){
		if(url!=undefined)
		{
			this.url=decodeURI(url);
		}
		else
		{
			this.url=decodeURI(location.href);
		}
		this.convertURL();
	}


	wRouter.location.convertURL=function(){
		var r,ar,arSub,i,pItem={key:"",value:""};
		r=/\/[\u4E00-\u9FFF]+|\w+\.html/;
		if(r.exec(this.url))
		{
			this.fileName=r.exec(this.url)[0];
		}
		r=/#\S{0,}/;
		if(r.exec(this.url)!=null)
		{
			this.action = r.exec(this.url)[0];
			this.action = this.action.replace("#","");
			this.action = this.action.replace(/\?\S+/,"");
			if(this.action.substr(0,1)!="/")
			{
				this.action = "/"+this.action;
			}
			if(this.action.substr(this.action.length-1,1)=="/")
			{
				this.action = this.action.substr(0,this.action.length-1);
			}		
		}
		r=/\?\S{0,}/;
		if(r.exec(this.url)!=null)
		{
			this.params=[];
			this.param = r.exec(this.url)[0];
			this.param = this.param.replace("?","");
			ar = this.param.split("&");
			for(i=0;i<ar.length;i++)
			{
				pItem={key:"",value:""};
				arSub = ar[i].split("=");
				pItem.key = arSub[0];
				pItem.value = arSub[1];		
				this.params.push(pItem);
			}
		}
		this.param = this.param.replace("?","");
	}


	win.$location = wRouter.location;

	
	

	wRouter.config=function(routes){
		this.route = routes;
		wRouter.controlLink();
		wRouter.onLoad();
	}


	wRouter.addRoute=function(routes){

		var i;
		if(routes.length==undefined)
		{
			this.route.routes.push(routes);
		}
		else
		{
			for(i=0;i<routes.length;i++)
			{
				this.route.routes.push(routes[i]);
			}
		}
	}



	wRouter.commonController=function(f){
		if(f!=undefined)
		{
			wRouter.commonControllerHandler=f;
		}
		else
		{
			wRouter.commonControllerHandler=function(){};
		}
	}


	wRouter.endController=function(f){
		if(f!=undefined)
		{
			wRouter.endControllerHandler=f;
		}
		else
		{
			wRouter.endControllerHandler=function(){};
		}
	}


	wRouter.controller=function(controllerName,f){
		var i,rLen,routes,otherwise;
		var reg=/\/:\w{1,}/;
		if(this.route.length==0)
		{return;}
		routes = this.route.routes;
		rLen = routes.length;

		otherwise = this.route.otherwise;
		
		for(i=0;i<rLen;i++)
		{
			if(routes[i].controller==controllerName)
			{
				routes[i].handler = f;
				this.run(routes[i]);
				if(routes[i].url==this.route.otherwise.redirectTo || routes[i].url.replace(reg,"")==this.route.otherwise.redirectTo)
				{
					this.defRouteIndex=i;
				}	
				return;
			}		
		}
		if(i==rLen)
		{
			window.location.href=wRouter.location.fileName+"#"+routes[this.defRouteIndex].url.replace(reg,"");
		}	
	}


	wRouter.callController=function(controllerName,json){
		/*
		controllerName=需要调用的controller名称
		json=是传给这个controller函数的的参数
		*/
		var i,rLen,routes;
		var args={};
		routes = this.route.routes;
		rLen = routes.length;
		args = json;
		for(i=0;i<rLen;i++)
		{
			if(routes[i].controller==controllerName)
			{
				routes[i].handler.call(this,args);
			}
		}
	}


	wRouter.run=function(router){
		wRouter.mask.init();
		wRouter.location.getURL();
		this.compareURL(router);

		window.onhashchange = function(e){
			var evt;
			evt = e ||event;
			wRouter.location.getURL(evt.newURL);
			wRouter.compareURLs();
		};
		
		this.event.onhashchange=function(){
			wRouter.location.getURL(location.href);
			wRouter.compareURLs();
		}
	}

	wRouter.trigger=function(eventStr){
		if(navigator.userAgent.indexOf("MSIE 7")>0)
		{
			wRouter.event[eventStr].call(this);
			return;
		}
		try
		{
			wRouter.event[eventStr].call(this);
		}
		catch(e)
		{;}
	}


	wRouter.compareURL=function(router){
		var action,rAction;
		var reg=/\/:\w{1,}/g , rAction2=""; 
		/*reg是去掉rAction中的 /:xx */
		var args={},mapParam={},v,pos;
		var routes = this.route.routes;
		router = router;
		action = wRouter.location.action; 
		rAction =router.url;
		if(router.url.indexOf(":")>0)
		{
			rAction2=router.url.replace(reg,"");
			/*args[reg.exec(router.url)[0].replace("/:","")] = action.replace(rAction2,"");*/
			mapParam = this.mapRouteUrlParam(router.url , action.replace(rAction2,""));
			for(v in mapParam)
			{
				args[v] = mapParam[v];
			}
		}
		
		if(rAction.substr(0,1)!="/")
		{
			rAction = "/" + rAction;
		}

		if(rAction==action)
		{
			wRouter.template.tmpl(router);
			wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad);
			wRouter.isFirstLoad=false;
			router.handler.call(this,args);
			wRouter.endControllerHandler.call(this,this.prevControllerName);
			this.prevControllerName = router.controller;
			return;
		}
		else if(router.url.indexOf(":")>0)
		{
			if(rAction2==action.substr(0,rAction2.length))
			{
				if(rAction2.length!=action.length&&action.substr(rAction2.length,1)!="/")
				{
					window.location.href=wRouter.location.fileName+"#"+routes[this.defRouteIndex].url.replace(reg,"");
				}
				wRouter.template.tmpl(router);
				wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad);
				wRouter.isFirstLoad=false;
				/*wRouter.Injection(router.handler);*/
				router.handler.call(this,args);	
				wRouter.endControllerHandler.call(this,this.prevControllerName);
				this.prevControllerName = router.controller;
			}
		}
	}


	wRouter.compareURLs=function(){
		var i, action,rAction,i,rLen,routes;
		var reg=/\/:\w{1,}/g , rAction2=""; /*如果router是/action/action2/:xx，存储去掉:/xx的结果 */
		/*reg是去掉rAction中的 /:xx */
		var args={},mapParam={},v,pos;
		
		routes = this.route.routes;
		rLen = routes.length;
		action = wRouter.location.action; /*格式是：/action/action2 */
		
		for(i=0;i<rLen;i++)
		{
			rAction = routes[i].url;
			if(routes[i].url.indexOf(":")>0)
			{
				rAction2=routes[i].url.replace(reg,"");
				/*args[reg.exec(routes[i].url)[0].replace("/:","")] = action.replace(rAction2,"");*/
				mapParam = this.mapRouteUrlParam(routes[i].url , action.replace(rAction2,""));
				for(v in mapParam)
				{
					args[v] = mapParam[v];
				}
			}
			
			if(rAction.substr(0,1)!="/")
			{
				rAction = "/" + rAction;
			}
			
			if(rAction==action)
			{
				wRouter.template.tmpl(routes[i]);
				wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad);
				wRouter.isFirstLoad=false;
				console.log(routes);
				routes[i].handler.call(this,args);
				wRouter.endControllerHandler.call(this,this.prevControllerName);
				this.prevControllerName = routes[i].controller;
				return;
			}
			else if(routes[i].url.indexOf(":")>0)
			{
				if(rAction2==action.substr(0,rAction2.length))
				{
					if(rAction2.length!=action.length&&action.substr(rAction2.length,1)!="/")
					{
						window.location.href=wRouter.location.fileName+"#"+routes[this.defRouteIndex].url.replace(reg,"");
					}				
					wRouter.template.tmpl(routes[i]);
					wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad);
					wRouter.isFirstLoad=false;
					routes[i].handler.call(this,args);
					wRouter.endControllerHandler.call(this,this.prevControllerName);
					this.prevControllerName = routes[i].controller;
					return;				
				}
			}
		}
		if(i==rLen)
		{
			window.location.href=wRouter.location.fileName+"#"+routes[this.defRouteIndex].url.replace(reg,"");
		}
	}


	wRouter.mapRouteUrlParam = function(routeUrl,url){

		var routeAr = [] , ar = [] ,routeUrlParam="",urlParam="",i,object={},pos=-1;
		
		pos = routeUrl.indexOf("/:");
		routeUrl = routeUrl.substr(pos);
		routeUrlParam = routeUrl.replace("/:","");

		routeAr = routeUrlParam.split("/:");
		urlParam = url.substr(0,1)=="/" ? url.substr(1) : url;
		ar = urlParam.split("/");
		if(ar[0]==""){ar[0]=undefined;}
		for(i=0;i<routeAr.length;i++)
		{
			object[routeAr[i]] = ar[i];
		}
		return object;
	}
	

	wRouter.Injection=function(fun,injectionObj){
		/*fun即函数名传递进来,injectionObj是字符串数组依赖注入的对象名*/
		var i,j;
		var reg = /\(\S+\)/;
		var funStr = fun.toString();
		var argstr = (reg.exec(funStr));
		var args = [];
		var injectionArgs="";
		if(argstr!=null)
		{
			argstr = argstr[0].replace("(","").replace(")","");
			args[0] = argstr;
			if(argstr.indexOf(",")>0)
			{
				args = argstr.split(",");
			}
			if(typeof(injectionObj)=="string")
			{
				for(i=0;i<args.length;i++)
				{
					for(j=0;j<injectionObj.length;j++)
					{
						if(args[i]==injectionObj[j])
						{
							;
						}
					}
				}
			}
		}
	}




	wRouter.template.tmpl=function(router){
		if(wRouter.route.container!=undefined)
		{
			if(router.template!=undefined)
			{
				try
				{
					wRouter.route.container.innerHTML = router.template.innerHTML;
				}
				catch(e)
				{
					throw new Error("没有找到模板");
				}
			}
			else if(router.templateUrl!=undefined)
			{
				try
				{
					var options={
							url:router.templateUrl,/*请求模板的页面*/
							data:{},
							async:false,
							success:function(data){},
							error:function(){}
						};
					wRouter.http.getTmpl(options);/*异步请求模板*/				
				}
				catch(e)
				{
					throw new Error("没有找到模板");
				}			
			}
		}	
	}


	wRouter.template.loadTmpl=function(options){
		wRouter.http.getTmpl(options);
	}

	var $template={};
	win.$template = $template;




	

	wRouter.http.get=function(options){
		/*
		options={
		url:"xxx",
		param:{},
		success:function(){},
		error:function(){}
		} 
		*/
		if(wRouter.http.useMask)
		{
			wRouter.mask.show();
		}
		var th = wRouter.http;
		wAjax.ajax({
			url:options.url, 
			type:'GET', 
			dataType:'text', 
			data:options.param||options.data,
			success:function(data){
				var json=eval("("+data+")");
				if(options.success!=undefined)
				{
					options.success.call(th,json);
				}
				setTimeout(wRouter.mask.hide,100);
			},
			error:function(){
				if(options.error!=undefined)
				{
					wRouter.mask.hide();
					options.error.call(th);
				}
			}
	     });
	}


	wRouter.http.getTmpl=function(options){
		/*
		options={
		async:true|false,
		templateContentId:"xxx",
		url:"xxx",
		param:{},
		success:function(){},
		error:function(){}
		} 
		*/
		var container = options.container||wRouter.route.container;
		var th = wRouter.template;
		var async=true;
		if(options.async!=undefined&&options.async==false)
		{
			async=false;
		}
		wAjax.ajax({
			url:options.url, 
			type:'GET', 
			dataType:'html', 
			data:options.param||options.data,
			async:async,
			success:function(data){
				if(options.success!=undefined)
				{
					container.innerHTML = data;
					options.success.call(th,data);
				}
			},
			error:function(){
				if(options.success!=undefined)
				{
					options.error.call(th);
				}
			}
	     });
	}

	wRouter.http.postData=function(options){

		if(options.url==undefined)
		{
			throw new Error("参数不足");
			return;
		}
	    wAjax.ajax({
	        url:options.url,
	        type:"POST",
	        data:$(options.form).serialize(),
	        success: function(data) {
	        	if(options.success!=undefined)
	            {
	        		options.success.call(this,data);
	            }
	        },
	        error:function(){
	        	if(options.error!=undefined)
	        	{
	        		options.error.call(this,data);
	        	}
	        }
	    });	
	}


	wRouter.http.template = function(url){
		var result="";
	    wAjax.ajax({
	        url:url,
	        type:"GET",
	        dataType:"html",
	        async:false ,
	        success: function(data) {
	        	result = (data).toString();
	        	return;
	        },
	        error:function(e){
	        	result = "error";
	        }
	    });
	    return result;
	}
	
	var $http={};
	$http.get = wRouter.http.get;
	$http.getTmpl=wRouter.http.getTmpl;
	$http.postData = wRouter.http.postData;
	$http.template = wRouter.http.template;
	win.$http = $http;


	wRouter.controlLink=function(){
		/*注意：页面上的链接方式应为 <a href="#/action/action2" route=""></a>*/
		var r=/#\S+/;
		var href="";
		/*
		$("a[route]").click(function(){
			href=this.href.replace("file://","");
			href=href.replace("http://","");
			href=r.exec(href);
			if(href!=null)
			{
				href=href[0].replace("#","/");
				window.location.href=wRouter.location.fileName+"#"+href;
			}
			if(wRouter.isIE())
			{
					wRouter.event.onhashchange(window.location.href);
			}
			return false;
		});
		*/
	}



	wRouter.mask={created:false};
	wRouter.mask.init=function(){
		if(wRouter.mask.created){return;}
		this.created=true;
		this.maskDiv = document.createElement("div");
		this.maskDiv.id="_mask_";
		this.maskDiv.style["position"]="fixed";
		this.maskDiv.style["width"]="100%";
		this.maskDiv.style["height"]="100%";
		this.maskDiv.style["top"]="0";
		this.maskDiv.style["left"]="0";
		this.maskDiv.style["z-index"]="1000";
		this.maskDiv.style["_position"]="absolute";
		this.maskDiv.style["background"]="#CCC";
		this.maskDiv.style["opacity"]="0.4";
		this.maskDiv.style["filter"]="alpha(opacity=40)";
		this.maskDiv.style["text-align"]="center";
		this.maskDiv.style["vertical-align"]="middle";
		this.maskDiv.style["padding-top"]="100px";
		this.maskDiv.style.display="none";
		this.maskDiv.innerHTML="载入中......";
		document.getElementsByTagName("body")[0].appendChild(this.maskDiv);
	}
	wRouter.mask.show = function(){
		this.maskDiv.style.display="block";
	}
	wRouter.mask.hide = function(){
		document.getElementById("_mask_").style.display="none";
	}

	
	

	var wAjax = {
		xmlhttp : null,

		getFormData : function(form){
			var aParams = new Array();
			for (var i=0 ; i < oForm.elements.length; i++)
			{
				var sParam = encodeURIComponent(oForm.elements[i].name);
				sParam += "=";
				sParam += encodeURIComponent(oForm.elements[i].value);
				aParams.push(sParam);
			}
			return aParams.join("&");
		},

		getParamData : function(json){
			var i,v,result = "?interval=";
			var now = new Date();
			result += now.getTime();
			if(json==undefined)
			{
				return "";
			}
			for(v in json)
			{
				result = result + "&" + v + "=" + json[v];
			}
			return result;
		},

		ajax : function(options){
			this.options = options;
			/*
			options.url
			options.type
			options.data
			options.dataType
			options.success
			options.error
			*/
			var th = this;
			var data;/*返回的数据*/
			var submitData;/*提交的数据*/
			var async = true;
			if(options.async!=undefined&&!options.async)
			{
				async = false;
			}
		    if(window.XMLHttpRequest)
		    {
		        this.xmlhttp = new XMLHttpRequest();
		    }
		    else
		    {
		        var arr = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
		        for (i = 0; i < arr.length; i++) 
		        {
		            try
		            {
		                this.xmlhttp = new ActiveXObject(arr[i]);
		                return;
		            }
		            catch(e)
		            {}
		        }
		    }

		    if(options.type=="GET")
		    {
			    this.xmlhttp.open("get", options.url + this.getParamData(options.data), async);
			    this.xmlhttp.onreadystatechange = function(){
			    	if(th.xmlhttp.readyState == 4 && th.xmlhttp.status == 200)
			    	{
			    		if(options.dataType==undefined||options.dataType=="text"||options.dataType=="html")
			    		{
			    			data = th.xmlhttp.responseText;
			    		}
			    		else if(options.dataType.toLowerCase()=="json")
			    		{
			    			data = eval("(" + th.xmlhttp.responseText + ")");
			    		}
			    		options.success(data);
			    	}
			    	else
			    	{
			    		options.error(data);
			    	}
			    }
			    this.xmlhttp.send(null);
		    }
		    else if(options.type=="POST")
		    {
		    	this.xmlhttp.open("post", options.url, async);
		    	this.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			    this.xmlhttp.onreadystatechange = function(){
			    	if(th.xmlhttp.readyState == 4 && th.xmlhttp.status == 200)
			    	{
			    		if(options.dataType==undefined||options.dataType=="text"||options.dataType=="html")
			    		{
			    			data = th.xmlhttp.responseText;
			    		}
			    		else if(options.dataType.toLowerCase()=="json")
			    		{
			    			data = eval("(" + th.xmlhttp.responseText + ")");
			    		}
			    		options.success(data);
			    	}
			    	else
			    	{
			    		options.error(data);
			    	}
			    }
			    submitData = this.getParamData(options.data);
			    this.xmlhttp.send(submitData);
		    }
		} /*end ajax*/
	};



	var template={
		_startSymbol:"\{\{",
		_endSymbol:"\}\}",
		templateElement:{},
		contentNode:null
	};

	template.useES5GetSet = true; 
	template.prefix = "_";         

	template.useEs5DataBind = function(bool){
		template.useES5GetSet = bool;
		if(!bool)
		{
			template.prefix = "";
		}
	}

	template.startSymbol=function(symbol){
		var _symbol="",i;
		var regx="\^$*+?{}[]|.";
		for(i=0;i<symbol.length;i++)
		{
			if(regx.indexOf(symbol.substr(i,1))>=0)
			{
				_symbol = _symbol + '\\' ;
			}
			_symbol = _symbol + symbol.substr(i,1);
		}
		this._startSymbol = _symbol;
	};
	template.endSymbol=function(symbol){
		var _symbol="",i;
		var regx="\^$*+?{}[]|.";
		for(i=0;i<symbol.length;i++)
		{
			if(regx.indexOf(symbol.substr(i,1))>=0)
			{
				_symbol = _symbol + '\\' ;
			}
			_symbol = _symbol + symbol.substr(i,1);
		}
		this._endSymbol = symbol;
	};


	template.repeat = function(options){


		if(options.data==undefined)
		{
			throw new Error("参数名称不对,参数是{},缺少data");
			return;
		}
		if((options.repeatId==undefined&&options.repeatElement==undefined))
		{
			throw new Error("参数名称不对,参数是{},缺少repeatElement或repeatId");
			return;
		}

		var tmpl={string:""},all="";            
		var data =[];                         
		var i,j,len=0,item,subItem;             
		var v,subv,jsonStr="";               
		var target;                         
		var nextNode=null,lastNode=null;       
		var parent;                       
		var fun=function(){},result,v;     
		
		var resultObject={};
		var json={};
		var node=null;                         
		
		var strV                         
		var attrValue="";                
		
		target = options.repeatElement;
		parent = target.parentNode;

		if(options.type==undefined ||(options.type!=undefined && options.type=="cover"))
		{
			template.deleteNode(target);          
		}
		
		if(options.template==undefined)
		{
			options.template = target.innerHTML;
		}
		
		if(options.data.length==undefined)
		{
			len=1;
			data[0]=options.data;
		}
		else
		{
			len=options.data.length;
			data=options.data;
		}
		
		if(options.count!=undefined)
		{
			if(options.count<=len)
			{
				len = options.count;
			}
		}
		
		if(options.render!=undefined)
		{
			fun=options.render||options.onrender;
		}

		nextNode = target;
		lastNode = parent.lastChild;

		if(options.onloadBefore!=undefined)
		{
			options.onloadBefore.call(this);
		}

		for(i=len-1;i>=0;i--)  
		{
			item = data[i];

			resultObject={index:i,item:data[i]};

			result = fun.call(this,resultObject);      

			node = document.createElement(target.nodeName); 

			for(j=0;j<target.attributes.length;j++)     
			{
				attrValue = target.attributes.item(j).value;
				for(v in result)
				{
					strV = this._startSymbol+v+this._endSymbol;
					reg = new RegExp(strV,"g");				
					attrValue = attrValue.replace(reg,result[v]);
				}
				for(v in item)
				{
					strV = this._startSymbol+v+this._endSymbol;
					reg = new RegExp(strV,"g");	
					attrValue = attrValue.replace(reg,item[v]);
				}
				node.setAttribute(target.attributes.item(j).name , attrValue);			
			}

			tmpl.string=options.template;

			for(v in result)
			{
				if(typeof(result[v])!="object")
				{
					strV = this._startSymbol+v+this._endSymbol;
					reg = new RegExp(strV,"g");
					tmpl.string = tmpl.string.replace(reg,result[v]);
				}
				else
				{
					template.getScope(result,v,tmpl);
				}
				/*
				strV = this._startSymbol+v+this._endSymbol;
				reg = new RegExp(strV,"g");	
				tmpl.string = tmpl.string.replace(reg,result[v]);
				*/
			}
			for(v in item)
			{
				if(typeof(item[v])!="object")
				{
					strV = this._startSymbol+v+this._endSymbol;
					reg = new RegExp(strV,"g");
					tmpl.string = tmpl.string.replace(reg,item[v]);
				}
				else
				{
					template.getScope(item,v,tmpl);
				}
			}
			
			node.innerHTML = tmpl.string;
			if(options.type!=undefined&&options.type=="append")
			{
				while(lastNode!=null)
				{
					if(lastNode.nodeType==1 && lastNode.getAttribute("templateItem")=="templateItem")
					{
						break;
					}
					lastNode = lastNode.previousSibling;
				}
				parent.insertBefore(node,lastNode.nextSibling);
				node.style.display="";
				node.setAttribute("templateItem","templateItem");
				node.setAttribute("templateItem-index",i);   /*为DOM列表生成顺序索引,base 0*/
				node = lastNode;
			}
			else
			{
				parent.insertBefore(node,nextNode.nextSibling);
				node.style.display="";
				node.setAttribute("templateItem","templateItem");
				node.setAttribute("templateItem-index",i);
			}

		} 

		target.style.display="none";

		if(options.onload!=undefined)
		{
			options.onload.call(this);
		}

		if(options.bind!=undefined)
		{

		}

		var innerData = this.copyUserData(data); 
		this.extendData(data); 

		return new this.ModelView({
			innerData : innerData,
			data : data,
			target : target,
			parentNode : parent
		});
		

	}/*end function repeat*/




	template.getScope = function(item,v,tmpl,scopeStr){
		var jsonStr="",subv,subItem;
		subItem = item[v];
		if(typeof(subItem)=="object")
		{
			if(scopeStr==undefined)
			{
				jsonStr = v;
			}
			else
			{
				jsonStr = scopeStr;
			}
			for(subv in subItem)
			{
				jsonStr += "."+subv;
				if(typeof(subItem[subv])=="object")
				{
					this.getScope(subItem,subv,tmpl,jsonStr);
					return;
				}
				strV = this._startSymbol+jsonStr+this._endSymbol;
				reg = new RegExp(strV,"g");
				tmpl.string = tmpl.string.replace(reg , subItem[subv]);
			}				
		}
		return ;
	}

	template.getES5Scope = function(item,v,tmpl,scopeStr){
		var jsonStr="",subv,subItem;
		subItem = item[v];
		console.log(subItem);
		if(typeof(subItem)=="object")
		{
			if(scopeStr==undefined)
			{
				jsonStr = v;
			}
			else
			{
				jsonStr = scopeStr;
			}
			for(subv in subItem)
			{
				jsonStr += "."+subv;
				if(typeof(subItem[subv])=="object")
				{
					this.getES5Scope(subItem,subv,tmpl,jsonStr);
					return;
				}
				strV = this._startSymbol+jsonStr+this._endSymbol;
				reg = new RegExp(strV,"g");
				tmpl.string = tmpl.string.replace(reg , subItem[template.prefix + subv]);
			}				
		}
		return ;
	}



	template.extendData = function(data){
		var i,v,item;
		var len = data.length;

		var deepCopy = function(item){
			var v;

			for(v in item)
			{
				if(typeof item[v] === 'object')
				{
					item["_"+v] = (item[v].constructor === Array) ? [] : {};
					item["_"+v] = deepCopy(item[v]);
				}
				else
				{
					item["_"+v] = item[v];
				}
				
			}
			return item;
		}

		for(i=0;i<len;i++)
		{
			item = data[i];
			deepCopy(item);
		}
		console.log("extendData:",data);
	}


	template.copyUserData = function(data){
		var i,v,item;
		var len = data.length;
		var newData = []; /*最终生成的 用户数据*/

		var deepCopy = function(item){
			var v,newItem = {};

			for(v in item)
			{
				if(typeof item[v] === 'object')
				{
					newItem[v] = (item[v].constructor === Array) ? [] : {};
					newItem[v] = deepCopy(item[v]);
				}
				else
				{
					newItem[v] = item[v];
				}
				
			}
			return newItem;	
		}

		for(i=0;i<len;i++)
		{
			item = data[i];
			newData.push(deepCopy(item));
		}
		return newData;
	}



	/*删除DOM节点*/
	template.deleteNode=function(target){
		var node = target.nextSibling;
		if(node ==null)/*如果options.data is [] ,node is null*/
		{
			return;
		}
		var nextNode,ife;
		try
		{
			ife = (node.nodeType==1&&node.getAttribute("templateItem")=="templateItem")||node.nodeType!=1;
		}
		catch(e)
		{
			return;
		}
		while(node!=null)
		{
			nextNode = node.nextSibling;
			if(ife)
			{
				node.parentNode.removeChild(node);
			}
			node = nextNode;
			if(node==null)/*如果没有要删除的节点推出循环*/
			{
				break;
			}
			ife = (node.nodeType==1&&node.getAttribute("templateItem")=="templateItem");
		}
		return;
		for(i=0;i<len;i++)
		{
			if(childNodes[i].nodeType==1&&childNodes[i].getAttribute("templateItem")=="templateItem")
			{
				parentNode.removeChild(childNodes[i]);
			}
		}
	}




	template.ModelView = function(options){
	
		this.autoReview = true;

		this.innerData = options.innerData;
		this.data = options.data;
		this.parentNode = options.parentNode;
		this.target = options.target;
		this.changedIndexs = [];

		if(template.useES5GetSet)
		{
			this.es5GetSet();
		}
	}


	template.ModelView.prototype.findNode = function(itemIndex){
		var i , index = 0 , isStart = false;
		var childs = this.parentNode.childNodes;
		var len = childs.length;
		for(i=0;i<len;i++)
		{
			if(this.target == childs[i])
			{
				index = 0;
				isStart = true;
			}
			if(childs[i].nodeType == 1)
			{
				index++;
			}
			if(isStart && index == itemIndex+2)
			{
				return childs[i];
			}
		}
		return null;
	}


	template.ModelView.prototype.repeatToSingleNode = function(itemIndex,isNew){

		var node ,v ,j;
		var target = this.target;
		var tmpl = {string:""};
		var item = this.row; 
		var attrValue,reg,strV;
		tmpl.string = target.innerHTML;
		if(isNew!=undefined&&isNew)
		{
			node = document.createElement(target.nodeName);
		}
		else
		{
			node = this.findNode(itemIndex);
		}
		for(j=0;j<target.attributes.length;j++)         
		{
			attrValue = target.attributes.item(j).value;
			for(v in item)
			{
				strV = template._startSymbol+v+template._endSymbol;
				reg = new RegExp(strV,"g");	
				attrValue = attrValue.replace(reg,item[template.prefix + v]);
			}
			node.setAttribute(target.attributes.item(j).name , attrValue);
		}
		for(v in item)
		{
			if(typeof(item[v])!="object")
			{
				strV = template._startSymbol+v+template._endSymbol;
				reg = new RegExp(strV,"g");
				tmpl.string = tmpl.string.replace(reg , item[template.prefix + v]);
			}
			else
			{
				template.getES5Scope(item,v,tmpl);
			}
		}
		node.innerHTML = tmpl.string;
		node.style.display = "";
		return node;
	}


	template.ModelView.prototype.doCondition = function(condition){


		var v,i,j;
		var len = this.data.length;
		var data = this.data;
		var item;
		var keyArr , value;
		var isUndefined = false;
		var isFound = false;      /*根据参数condition找到匹配的数据*/
		var isFail = false;       /*如果isFail=true表示最终没找到*/
		var itemIndex = -1;

		for(v in condition)
		{
			keyArr = v.split(".");
			value = condition[v];
			isUndefined = false;
			isFound = false;

			for(i=0;i<len;i++)
			{
				item = data[i];
				for(j=0;j<keyArr.length;j++)
				{
					item = item[keyArr[j]];
					if(item==undefined)
					{
						isUndefined = true;
						break;
					}
				}

				if(isUndefined)
				{
					break;
				}
				else if(item == value)
				{
					isFound = true;
					itemIndex = i;
					break;
				}
				else
				{
					isFound = false;
				}
			}/*end for i*/
			if(!isFound)
			{
				break;
			}
		}

		if(isFound)
		{
			return itemIndex; /*itemIndex是在this.data中的位置,从0开始*/
		}
		else
		{
			return -1;
		}
	}


	template.ModelView.prototype.update = function(condition,row,callback){
		/*
		condition,data is json
		condition = {"app.title.num":"100"}
		*/
		this.row = row;  /*repeatToSingleNode()用到this.row*/

		var itemIndex;
		itemIndex = this.doCondition(condition);
		if(itemIndex!=-1)
		{
			this.repeatToSingleNode(itemIndex);
			this.data[itemIndex] = row;
		}
		callback.call(this,itemIndex==-1?false:true);
		/*
		callback(p);返回一个参数为bool型,该参数说明更新是否成功
		*/
	}


	template.ModelView.prototype.delete = function(condition,callback){
		var itemIndex;
		var node;
		itemIndex = this.doCondition(condition);
		node = this.findNode(itemIndex);
		node.parentNode.removeChild(node);
		this.data.splice(itemIndex,1);
		if(callback!=undefined)
		{
			callback.call(this,itemIndex==-1?false:true);
		}
	}


	template.ModelView.prototype.deleteIndex = function(itemIndex,callback){

		var node;
		node = this.findNode(itemIndex);
		node.parentNode.removeChild(node);
		this.data.splice(itemIndex,1);
		if(callback!=undefined)
		{
			callback.call(this,itemIndex==-1?false:true);
		}
	}


	template.ModelView.prototype.add = function(row,callback){
		var itemIndex;
		var node,prevNode = null;
		this.row = row;
		node = this.repeatToSingleNode(-1,true);
		prevNode = this.parentNode.lastChild;
		while(prevNode!=null)
		{
			if(prevNode.nodeType==1 && prevNode.getAttribute("templateItem")=="templateItem")
			{
				break;
			}
			prevNode = prevNode.previousSibling;
		}
		this.parentNode.insertBefore(node,prevNode.nextSibling);
		this.data.push(row);
		if(callback!=undefined)
		{
			callback.call(this);
		}
	}


	template.ModelView.prototype.insert = function(rowIndex,row,callback){
		/*
		rowIndex is this.data index
		*/
		var node , posNode = null ,i;
		this.row = row;
		node = this.repeatToSingleNode(-1,true);
		posNode = this.target.nextSibling;
		for(i=0;i<rowIndex;i++)
		{
			posNode = posNode.nextSibling;
		}
		this.parentNode.insertBefore(node,posNode);
		this.data.splice(rowIndex,0,row);
		if(callback!=undefined)
		{
			callback.call(this);
		}
	}

	template.ModelView.prototype.destroy = function(){
		this.data.length = 0;
		this.parentNode = null;
		this.target = null;
	}




	template.ModelView.prototype.es5GetSet = function(){
		var len = this.data.length;
		var i ,j  , v , item , result;
		var th = this;
		var _scopeObj;
		if(Object.defineProperty==undefined) /*不支持ES5新特性*/
		{
			return;
		}
		this._scopeAr = [];
		var isObject = function(v,obj,item){
			/*v is key; obj is value*/
			var vv;
			var object;
			if(typeof(obj)=="object")
			{
				th._scopeAr.push(v);
				for(vv in obj)
				{
					if(typeof(obj[vv])=="object")
					{
						return isObject(vv,obj[vv]);
					}
					else
					{
						th._scopeAr.push(vv);
						return {
							attrName : vv,
							scope : th._scopeAr
						};
						return vv;
					}	
				}
			}
			else
			{
				return {
					attrName : v,
					scope : null 
				};/*here obj is not object*/
				return v;
			}

		}

		for(i=0;i<len;i++)
		{
			let n = i;
			item = this.data[i];
			this._scopeAr.length = 0;
			for(v in item)
			{
				if(v.indexOf("_")>=0)
				{
					continue;
				}
				//let result = isObject(v,item[v]);
				
				if(typeof(item[v])!="object")
				{
					Object.defineProperty(item , v, {
					 	get: function() {
					 		return this["_"+v];
					    },
					 	set: function(o) {
					     	this["_"+v] = o;
					     	th.changedIndexs.push(n);
					     	th.autoReview && th.viewPage(n);
					    },
					    enumerable: true,  
	    				configurable: true
					});
					continue;
				}
				
				if(this._scopeAr.length!=0)
				{
					_scopeObj = item;
					for(j=0;j<this._scopeAr.length;j++)
					{
						if(v.indexOf("_")>=0)
						{
							console.log(v);
							//continue;
						}
						//console.log(_scopeObj);

						var attrName = this._scopeAr[j];
						//console.log(attrName);
						Object.defineProperty(_scopeObj, attrName, {
							get: function() {
						    	return this["_"+attrName];
						    },
							set: function(o) {
						    	this["_"+attrName] = o;
						    	th.changedIndexs.push(n);
						    	th.autoReview && th.viewPage(n);
						    }
						});
						_scopeObj = _scopeObj[this._scopeAr[j]];
					}
				}
			}
		}
	}



	template.ModelView.prototype.viewPage = function(n){
		var i,len;
		this.row = this.data[n];
		console.log(this.row);
		//console.log("title:",this.row.title);
		//console.log("url:",this.row.url);
		//console.log("count:",this.row.numbers.app.count);
		this.repeatToSingleNode(n);
		this.changedIndexs.length = 0;
	}


	template.ModelView.prototype.refresh = function(){
		var i,len;
		len = this.changedIndexs.length;
		for(i=0;i<len;i++)
		{
			this.row = this.data[this.changedIndexs[i]];
			this.repeatToSingleNode(this.changedIndexs[i]);
		}
		this.changedIndexs.length = 0;
	}


	/*on()方法还没有写完*/
	template.ModelView.prototype.on = function(eventName,target,f){
		/*
		参数说明:
		eventName is string;target is string example("div a")
		*/
		var fun;
		var queryAr,queryArLen=0;
		var th = this;
		var childs = this.parentNode.childNodes;
		if(arguments.length==2)
		{
			fun = target;
		}
		else if(arguments.length==3)
		{
			queryAr = target.split(" ");
			queryArLen = queryAr.length;
			fun = f;
		}

		this.parentNode.addEventListener(eventName,function(e){
			var target = e.target||e.srcElement;
			if(queryArLen==0)
			{
				if(target.getAttribute("templateitem") == "templateItem" || th.parentNode.contains(target))
				{
					fun.call(th,e);
				}
			}
		},false);

		var i_n = 0;
		for(i=0;i<childs.length;i++)
		{
			if(childs[i].nodeType == 1 && childs[i].getAttribute("templateitem") == "templateItem")
			{
				childs[i].addEventListener(eventName,function(i_n,targetParent){
					return function(e){
						var target = e.target||e.srcElement;
						if(isTarget(queryAr,target,targetParent))
						{
							th.item = th.data[targetParent.getAttribute("templateitem-index")];
							th.itemIndex = targetParent.getAttribute("templateitem-index");
							fun.call(th,e);
						}					
					}
				}(i_n,childs[i]),false);
				i_n++;	
			}
		}
		/*判断是否符合on()中第二个参数*/
		var isTarget = function(ar,target,targetParent){
			/*ar is param target array*/
			//console.log(ar);
			//console.log(target);
			//console.log(targetParent);
			//console.log("-----------")
			var i=0;
			var len = ar.length, count = 0;
			var isContinue = false;
			i = len - 1;

			while(targetParent.contains(target))
			{
				if(ar[i].indexOf(".")==0)/* is .xxx*/
				{
					if(target.className.indexOf(ar[i].replace(".",""))>=0)
					{
						count++;
						i--;
					}
				}
				else if(ar[i].indexOf(".")>0) /*is xx.yy example div.red*/
				{

				}
				else
				{
					if(target.nodeName==ar[i].toUpperCase())
					{
						count++;
						i--;
					}
				}
				if(i<0)
				{
					break;
				}
				target = target.parentNode;
			}

			if(count == len)
			{
				return true;
			}
			else
			{
				return false;
			}

		}
	}

	
	var Wing = {
		version:"1.0.0",
		wRouter:wRouter,
		wTemplate:template
	};
	win["Wing"] = Wing;
})(window);
