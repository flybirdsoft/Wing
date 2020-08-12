/*
Wing.js
write by wuweiwei

www.flybirdsoft.com/Wing
www.flybirdsoft.com/WUI
www.cnblogs.com/wsoft
www.github.com/flybirdosft

*/
!function(win){"use strict";var wRouter={version:"1.0",route:[],defRouteIndex:0,commonControllerHandler:function(t){},endControllerHandler:function(t){},isFirstLoad:!0,prevControllerName:"",event:{},http:{useMask:!0},template:{},location:{url:"",host:"",fileName:"",port:"",param:"",params:[],action:""},isIE:function(){return 0<navigator.userAgent.indexOf("MSIE 7")||0<navigator.userAgent.indexOf("MSIE 6")},isIE8:function(){return 0<navigator.userAgent.indexOf("MSIE 8")},onLoad:function(){window.onload=function(){-1==window.location.href.indexOf("#")&&(window.location.href=wRouter.location.fileName+"#"+wRouter.route.routes[wRouter.defRouteIndex].url.replace(/\/:\w{1,}/,""),wRouter.isIE()&&wRouter.event.onhashchange())}}};wRouter.location.getURL=function(t){this.url=null!=t?decodeURI(t):decodeURI(location.href),this.convertURL()},wRouter.location.convertURL=function(){var t,e,o,n={key:"",value:""},r=/\/[\u4E00-\u9FFF]+|\w+\.html/;if(r.exec(this.url)&&(this.fileName=r.exec(this.url)[0]),null!=(r=/#\S{0,}/).exec(this.url)&&(this.action=r.exec(this.url)[0],this.action=this.action.replace("#",""),this.action=this.action.replace(/\?\S+/,""),"/"!=this.action.substr(0,1)&&(this.action="/"+this.action),"/"==this.action.substr(this.action.length-1,1)&&(this.action=this.action.substr(0,this.action.length-1))),null!=(r=/\?\S{0,}/).exec(this.url))for(this.params=[],this.param=r.exec(this.url)[0],this.param=this.param.replace("?",""),t=this.param.split("&"),o=0;o<t.length;o++)n={key:"",value:""},e=t[o].split("="),n.key=e[0],n.value=e[1],this.params.push(n);this.param=this.param.replace("?","")},win.$location=wRouter.location,wRouter.config=function(t){this.route=t,wRouter.controlLink(),wRouter.onLoad()},wRouter.addRoute=function(t){var e;if(null==t.length)this.route.routes.push(t);else for(e=0;e<t.length;e++)this.route.routes.push(t[e])},wRouter.commonController=function(t){wRouter.commonControllerHandler=null!=t?t:function(){}},wRouter.endController=function(t){wRouter.endControllerHandler=null!=t?t:function(){}},wRouter.controller=function(t,e){var o,n,r,i=/\/:\w{1,}/;if(0!=this.route.length){for(n=(r=this.route.routes).length,this.route.otherwise,o=0;o<n;o++)if(r[o].controller==t)return r[o].handler=e,this.run(r[o]),void(r[o].url!=this.route.otherwise.redirectTo&&r[o].url.replace(i,"")!=this.route.otherwise.redirectTo||(this.defRouteIndex=o));o==n&&(window.location.href=wRouter.location.fileName+"#"+r[this.defRouteIndex].url.replace(i,""))}},wRouter.callController=function(t,e){for(var o=this.route.routes,n=o.length,r=e,i=0;i<n;i++)o[i].controller==t&&o[i].handler.call(this,r)},wRouter.run=function(t){wRouter.mask.init(),wRouter.location.getURL(),this.compareURL(t),window.onhashchange=function(t){var e=t||event;wRouter.location.getURL(e.newURL),wRouter.compareURLs()},this.event.onhashchange=function(){wRouter.location.getURL(location.href),wRouter.compareURLs()}},wRouter.trigger=function(t){if(0<navigator.userAgent.indexOf("MSIE 7"))wRouter.event[t].call(this);else try{wRouter.event[t].call(this)}catch(t){}},wRouter.compareURL=function(t){var e,o,n=/\/:\w{1,}/g,r="",i={},a=this.route.routes,l=wRouter.location.action,s=t.url;if(0<t.url.indexOf(":"))for(o in r=t.url.replace(n,""),e=this.mapRouteUrlParam(t.url,l.replace(r,"")))i[o]=e[o];if("/"!=s.substr(0,1)&&(s="/"+s),s==l)return wRouter.template.tmpl(t),wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad),wRouter.isFirstLoad=!1,t.handler.call(this,i),wRouter.endControllerHandler.call(this,this.prevControllerName),void(this.prevControllerName=t.controller);0<t.url.indexOf(":")&&r==l.substr(0,r.length)&&(r.length!=l.length&&"/"!=l.substr(r.length,1)&&(window.location.href=wRouter.location.fileName+"#"+a[this.defRouteIndex].url.replace(n,"")),wRouter.template.tmpl(t),wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad),wRouter.isFirstLoad=!1,t.handler.call(this,i),wRouter.endControllerHandler.call(this,this.prevControllerName),this.prevControllerName=t.controller)},wRouter.compareURLs=function(){var t,e,o,n,r=/\/:\w{1,}/g,i="",a={},l=this.route.routes,s=l.length,u=wRouter.location.action;for(e=0;e<s;e++){if(t=l[e].url,0<l[e].url.indexOf(":"))for(n in i=l[e].url.replace(r,""),o=this.mapRouteUrlParam(l[e].url,u.replace(i,"")))a[n]=o[n];if("/"!=t.substr(0,1)&&(t="/"+t),t==u)return wRouter.template.tmpl(l[e]),wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad),wRouter.isFirstLoad=!1,console.log(l),l[e].handler.call(this,a),wRouter.endControllerHandler.call(this,this.prevControllerName),void(this.prevControllerName=l[e].controller);if(0<l[e].url.indexOf(":")&&i==u.substr(0,i.length))return i.length!=u.length&&"/"!=u.substr(i.length,1)&&(window.location.href=wRouter.location.fileName+"#"+l[this.defRouteIndex].url.replace(r,"")),wRouter.template.tmpl(l[e]),wRouter.commonControllerHandler.call(this,wRouter.isFirstLoad),wRouter.isFirstLoad=!1,l[e].handler.call(this,a),wRouter.endControllerHandler.call(this,this.prevControllerName),void(this.prevControllerName=l[e].controller)}e==s&&(window.location.href=wRouter.location.fileName+"#"+l[this.defRouteIndex].url.replace(r,""))},wRouter.mapRouteUrlParam=function(t,e){var o,n=[],r={},i=t.indexOf("/:"),a=(t=t.substr(i)).replace("/:","").split("/:");for(""==(n=("/"==e.substr(0,1)?e.substr(1):e).split("/"))[0]&&(n[0]=void 0),o=0;o<a.length;o++)r[a[o]]=n[o];return r},wRouter.Injection=function(t,e){var o,n,r=t.toString(),i=/\(\S+\)/.exec(r),a=[];if(null!=i&&(i=i[0].replace("(","").replace(")",""),0<(a[0]=i).indexOf(",")&&(a=i.split(",")),"string"==typeof e))for(o=0;o<a.length;o++)for(n=0;n<e.length;n++)a[o],e[n]},wRouter.template.tmpl=function(t){if(null!=wRouter.route.container)if(null!=t.template)try{wRouter.route.container.innerHTML=t.template.innerHTML}catch(t){throw new Error("没有找到模板")}else if(null!=t.templateUrl)try{var e={url:t.templateUrl,data:{},async:!1,success:function(t){},error:function(){}};wRouter.http.getTmpl(e)}catch(t){throw new Error("没有找到模板")}},wRouter.template.loadTmpl=function(t){wRouter.http.getTmpl(t)};var $template={};win.$template=$template,wRouter.http.get=function(options){wRouter.http.useMask&&wRouter.mask.show();var th=wRouter.http;wAjax.ajax({url:options.url,type:"GET",dataType:"text",data:options.param||options.data,success:function(data){var json=eval("("+data+")");null!=options.success&&options.success.call(th,json),setTimeout(wRouter.mask.hide,100)},error:function(){null!=options.error&&(wRouter.mask.hide(),options.error.call(th))}})},wRouter.http.getTmpl=function(e){var o=e.container||wRouter.route.container,n=wRouter.template,t=!0;null!=e.async&&0==e.async&&(t=!1),wAjax.ajax({url:e.url,type:"GET",dataType:"html",data:e.param||e.data,async:t,success:function(t){null!=e.success&&(o.innerHTML=t,e.success.call(n,t))},error:function(){null!=e.success&&e.error.call(n)}})},wRouter.http.postData=function(e){if(null==e.url)throw new Error("参数不足");wAjax.ajax({url:e.url,type:"POST",data:$(e.form).serialize(),success:function(t){null!=e.success&&e.success.call(this,t)},error:function(){null!=e.error&&e.error.call(this,data)}})},wRouter.http.template=function(t){var e="";return wAjax.ajax({url:t,type:"GET",dataType:"html",async:!1,success:function(t){e=t.toString()},error:function(t){e="error"}}),e};var $http={};$http.get=wRouter.http.get,$http.getTmpl=wRouter.http.getTmpl,$http.postData=wRouter.http.postData,$http.template=wRouter.http.template,win.$http=$http,wRouter.controlLink=function(){},wRouter.mask={created:!1},wRouter.mask.init=function(){wRouter.mask.created||(this.created=!0,this.maskDiv=document.createElement("div"),this.maskDiv.id="_mask_",this.maskDiv.style.position="fixed",this.maskDiv.style.width="100%",this.maskDiv.style.height="100%",this.maskDiv.style.top="0",this.maskDiv.style.left="0",this.maskDiv.style["z-index"]="1000",this.maskDiv.style._position="absolute",this.maskDiv.style.background="#CCC",this.maskDiv.style.opacity="0.4",this.maskDiv.style.filter="alpha(opacity=40)",this.maskDiv.style["text-align"]="center",this.maskDiv.style["vertical-align"]="middle",this.maskDiv.style["padding-top"]="100px",this.maskDiv.style.display="none",this.maskDiv.innerHTML="载入中......",document.getElementsByTagName("body")[0].appendChild(this.maskDiv))},wRouter.mask.show=function(){this.maskDiv.style.display="block"},wRouter.mask.hide=function(){document.getElementById("_mask_").style.display="none"};var wAjax={xmlhttp:null,getFormData:function(t){for(var e=new Array,o=0;o<oForm.elements.length;o++){var n=encodeURIComponent(oForm.elements[o].name);n+="=",n+=encodeURIComponent(oForm.elements[o].value),e.push(n)}return e.join("&")},getParamData:function(t){var e,o="?interval=";if(o+=(new Date).getTime(),null==t)return"";for(e in t)o=o+"&"+e+"="+t[e];return o},ajax:function(options){this.options=options;var th=this,data,submitData,async=!0;if(null==options.async||options.async||(async=!1),window.XMLHttpRequest)this.xmlhttp=new XMLHttpRequest;else{var arr=["MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHttp"];for(i=0;i<arr.length;i++)try{return void(this.xmlhttp=new ActiveXObject(arr[i]))}catch(t){}}"GET"==options.type?(this.xmlhttp.open("get",options.url+this.getParamData(options.data),async),this.xmlhttp.onreadystatechange=function(){4==th.xmlhttp.readyState&&200==th.xmlhttp.status?(null==options.dataType||"text"==options.dataType||"html"==options.dataType?data=th.xmlhttp.responseText:"json"==options.dataType.toLowerCase()&&(data=eval("("+th.xmlhttp.responseText+")")),options.success(data)):options.error(data)},this.xmlhttp.send(null)):"POST"==options.type&&(this.xmlhttp.open("post",options.url,async),this.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"),this.xmlhttp.onreadystatechange=function(){4==th.xmlhttp.readyState&&200==th.xmlhttp.status?(null==options.dataType||"text"==options.dataType||"html"==options.dataType?data=th.xmlhttp.responseText:"json"==options.dataType.toLowerCase()&&(data=eval("("+th.xmlhttp.responseText+")")),options.success(data)):options.error(data)},submitData=this.getParamData(options.data),this.xmlhttp.send(submitData))}},template={_startSymbol:"{{",_endSymbol:"}}",templateElement:{},contentNode:null,useES5GetSet:!0,prefix:"_",useEs5DataBind:function(t){(template.useES5GetSet=t)||(template.prefix="")},startSymbol:function(t){for(var e="",o=0;o<t.length;o++)0<="^$*+?{}[]|.".indexOf(t.substr(o,1))&&(e+="\\"),e+=t.substr(o,1);this._startSymbol=e},endSymbol:function(t){for(var e=0;e<t.length;e++)0<="^$*+?{}[]|.".indexOf(t.substr(e,1))&&0,t.substr(e,1);this._endSymbol=t},repeat:function(t){if(null==t.data)throw new Error("参数名称不对,参数是{},缺少data");if(null==t.repeatId&&null==t.repeatElement)throw new Error("参数名称不对,参数是{},缺少repeatElement或repeatId");var e,o,n,r,i,a,l,s,u={string:""},p=[],h=0,c=null,d=function(){},m=null,f="",g=t.repeatElement,w=g.parentNode;for((null==t.type||null!=t.type&&"cover"==t.type)&&template.deleteNode(g),null==t.template&&(t.template=g.innerHTML),null==t.data.length?(h=1,p[0]=t.data):(h=t.data.length,p=t.data),null!=t.count&&t.count<=h&&(h=t.count),null!=t.render&&(d=t.render||t.onrender),r=g,c=w.lastChild,null!=t.onloadBefore&&t.onloadBefore.call(this),e=h-1;0<=e;e--){for(n=p[e],l={index:e,item:p[e]},i=d.call(this,l),m=document.createElement(g.nodeName),o=0;o<g.attributes.length;o++){for(a in f=g.attributes.item(o).value,i)s=this._startSymbol+a+this._endSymbol,reg=new RegExp(s,"g"),f=f.replace(reg,i[a]);for(a in n)s=this._startSymbol+a+this._endSymbol,reg=new RegExp(s,"g"),f=f.replace(reg,n[a]);m.setAttribute(g.attributes.item(o).name,f)}for(a in u.string=t.template,i)"object"!=typeof i[a]?(s=this._startSymbol+a+this._endSymbol,reg=new RegExp(s,"g"),u.string=u.string.replace(reg,i[a])):template.getScope(i,a,u);for(a in n)"object"!=typeof n[a]?(s=this._startSymbol+a+this._endSymbol,reg=new RegExp(s,"g"),u.string=u.string.replace(reg,n[a])):template.getScope(n,a,u);if(m.innerHTML=u.string,null!=t.type&&"append"==t.type){for(;null!=c&&(1!=c.nodeType||"templateItem"!=c.getAttribute("templateItem"));)c=c.previousSibling;w.insertBefore(m,c.nextSibling),m.style.display="",m.setAttribute("templateItem","templateItem"),m.setAttribute("templateItem-index",e),m=c}else w.insertBefore(m,r.nextSibling),m.style.display="",m.setAttribute("templateItem","templateItem"),m.setAttribute("templateItem-index",e)}g.style.display="none",null!=t.onload&&t.onload.call(this),t.bind;var y=this.copyUserData(p);return this.extendData(p),new this.ModelView({innerData:y,data:p,target:g,parentNode:w})},getScope:function(t,e,o,n){var r,i="",a=t[e];if("object"==typeof a)for(r in i=null==n?e:n,a){if(i+="."+r,"object"==typeof a[r])return void this.getScope(a,r,o,i);strV=this._startSymbol+i+this._endSymbol,reg=new RegExp(strV,"g"),o.string=o.string.replace(reg,a[r])}},getES5Scope:function(t,e,o,n){var r,i="",a=t[e];if(console.log(a),"object"==typeof a)for(r in i=null==n?e:n,a){if(i+="."+r,"object"==typeof a[r])return void this.getES5Scope(a,r,o,i);strV=this._startSymbol+i+this._endSymbol,reg=new RegExp(strV,"g"),o.string=o.string.replace(reg,a[template.prefix+r])}},extendData:function(t){for(var e,o=t.length,n=function(t){var e;for(e in t)"object"==typeof t[e]?(t["_"+e]=t[e].constructor===Array?[]:{},t["_"+e]=n(t[e])):t["_"+e]=t[e];return t},r=0;r<o;r++)e=t[r],n(e);console.log("extendData:",t)},copyUserData:function(t){for(var e,o=t.length,n=[],r=function(t){var e,o={};for(e in t)"object"==typeof t[e]?(o[e]=t[e].constructor===Array?[]:{},o[e]=r(t[e])):o[e]=t[e];return o},i=0;i<o;i++)e=t[i],n.push(r(e));return n},deleteNode:function(t){var e,o,n=t.nextSibling;if(null!=n){try{o=1==n.nodeType&&"templateItem"==n.getAttribute("templateItem")||1!=n.nodeType}catch(t){return}for(;null!=n&&(e=n.nextSibling,o&&n.parentNode.removeChild(n),null!=(n=e));)o=1==n.nodeType&&"templateItem"==n.getAttribute("templateItem")}},ModelView:function(t){this.autoReview=!0,this.innerData=t.innerData,this.data=t.data,this.parentNode=t.parentNode,this.target=t.target,this.changedIndexs=[],template.useES5GetSet&&this.es5GetSet()}};template.ModelView.prototype.findNode=function(t){for(var e=0,o=!1,n=this.parentNode.childNodes,r=n.length,i=0;i<r;i++)if(this.target==n[i]&&(o=!(e=0)),1==n[i].nodeType&&e++,o&&e==t+2)return n[i];return null},template.ModelView.prototype.repeatToSingleNode=function(t,e){var o,n,r,i,a,l,s=this.target,u={string:""},p=this.row;for(u.string=s.innerHTML,o=null!=e&&e?document.createElement(s.nodeName):this.findNode(t),r=0;r<s.attributes.length;r++){for(n in i=s.attributes.item(r).value,p)l=template._startSymbol+n+template._endSymbol,a=new RegExp(l,"g"),i=i.replace(a,p[template.prefix+n]);o.setAttribute(s.attributes.item(r).name,i)}for(n in p)"object"!=typeof p[n]?(l=template._startSymbol+n+template._endSymbol,a=new RegExp(l,"g"),u.string=u.string.replace(a,p[template.prefix+n])):template.getES5Scope(p,n,u);return o.innerHTML=u.string,o.style.display="",o},template.ModelView.prototype.doCondition=function(t){var e,o,n,r,i,a,l=this.data.length,s=this.data,u=!1,p=!1,h=-1;for(e in t){for(i=e.split("."),a=t[e],p=u=!1,o=0;o<l;o++){for(r=s[o],n=0;n<i.length;n++)if(null==(r=r[i[n]])){u=!0;break}if(u)break;if(r==a){p=!0,h=o;break}p=!1}if(!p)break}return p?h:-1},template.ModelView.prototype.update=function(t,e,o){var n;this.row=e,-1!=(n=this.doCondition(t))&&(this.repeatToSingleNode(n),this.data[n]=e),o.call(this,-1!=n)},template.ModelView.prototype.delete=function(t,e){var o=this.doCondition(t),n=this.findNode(o);n.parentNode.removeChild(n),this.data.splice(o,1),null!=e&&e.call(this,-1!=o)},template.ModelView.prototype.deleteIndex=function(t,e){var o=this.findNode(t);o.parentNode.removeChild(o),this.data.splice(t,1),null!=e&&e.call(this,-1!=t)},template.ModelView.prototype.add=function(t,e){var o,n=null;for(this.row=t,o=this.repeatToSingleNode(-1,!0),n=this.parentNode.lastChild;null!=n&&(1!=n.nodeType||"templateItem"!=n.getAttribute("templateItem"));)n=n.previousSibling;this.parentNode.insertBefore(o,n.nextSibling),this.data.push(t),null!=e&&e.call(this)},template.ModelView.prototype.insert=function(t,e,o){var n,r,i=null;for(this.row=e,n=this.repeatToSingleNode(-1,!0),i=this.target.nextSibling,r=0;r<t;r++)i=i.nextSibling;this.parentNode.insertBefore(n,i),this.data.splice(t,0,e),null!=o&&o.call(this)},template.ModelView.prototype.destroy=function(){this.data.length=0,this.parentNode=null,this.target=null},template.ModelView.prototype.es5GetSet=function(){var t,e,o,n=this.data.length,r=this;if(null!=Object.defineProperty){this._scopeAr=[];for(var i=0;i<n;i++){var a=i,l=this.data[i];for(e in this._scopeAr.length=0,l)if(!(0<=e.indexOf("_")))if("object"==typeof l[e]){if(0!=this._scopeAr.length)for(o=l,t=0;t<this._scopeAr.length;t++){0<=e.indexOf("_")&&console.log(e);var s=this._scopeAr[t];Object.defineProperty(o,s,{get:function(){return this["_"+s]},set:function(t){this["_"+s]=t,r.changedIndexs.push(a),r.autoReview&&r.viewPage(a)}}),o=o[this._scopeAr[t]]}}else Object.defineProperty(l,e,{get:function(){return this["_"+e]},set:function(t){this["_"+e]=t,r.changedIndexs.push(a),r.autoReview&&r.viewPage(a)},enumerable:!0,configurable:!0})}}},template.ModelView.prototype.viewPage=function(t){this.row=this.data[t],console.log(this.row),this.repeatToSingleNode(t),this.changedIndexs.length=0},template.ModelView.prototype.refresh=function(){for(var t=this.changedIndexs.length,e=0;e<t;e++)this.row=this.data[this.changedIndexs[e]],this.repeatToSingleNode(this.changedIndexs[e]);this.changedIndexs.length=0},template.ModelView.prototype.on=function(t,e,o){var n,r,a=0,l=this,s=this.parentNode.childNodes;2==arguments.length?n=e:3==arguments.length&&(r=e.split(" "),a=r.length,n=o),this.parentNode.addEventListener(t,function(t){var e=t.target||t.srcElement;0==a&&("templateItem"!=e.getAttribute("templateitem")&&!l.parentNode.contains(e)||n.call(l,t))},!1);for(i=0;i<s.length;i++)1==s[i].nodeType&&"templateItem"==s[i].getAttribute("templateitem")&&(s[i].addEventListener(t,function(o){return function(t){var e=t.target||t.srcElement;u(r,e,o)&&(l.item=l.data[o.getAttribute("templateitem-index")],l.itemIndex=o.getAttribute("templateitem-index"),n.call(l,t))}}(s[i]),!1),0);var u=function(t,e,o){for(var n=0,r=t.length,i=0,n=r-1;o.contains(e)&&(0==t[n].indexOf(".")?0<=e.className.indexOf(t[n].replace(".",""))&&(i++,n--):0<t[n].indexOf(".")||e.nodeName==t[n].toUpperCase()&&(i++,n--),!(n<0));)e=e.parentNode;return i==r}};var Wing={version:"1.0.0",wRouter:wRouter,wTemplate:template};win.Wing=Wing}(window);
