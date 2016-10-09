/*
 * create by mingming on 2016/09/27 15:08
 */

function $$(){};

$$.prototype={
    //拷贝数据
    //newSource：已经被赋值了的数据   oldSource：旧的数据
    $$extend:function(newSource,oldSource){
		for (var i in oldSource){
			newSource[i]=oldSource[i];	
		};
		return newSource;
	},
};

var $$=new $$();


//用上面的$$.$$extend()方法扩张自己$$  这样方便模块化管理

/*基础框架*/
$$.$$extend($$,{
	
});

/*选择框架*/
$$.$$extend($$,{
	//id选择器
    $$id:function(id){
        return document.getElementById(id);
    },
	//tag选择器   在context内找        context可以忽略  
    $$tag:function(tag,context){
		if(typeof context == 'string'){
			context = $$.$$id(context);
		}

		if(context){
			return context.getElementsByTagName(tag);
		}else{
			return document.getElementsByTagName(tag);
		}
    },
	//class选择器        在context内找                 context为id    context可以忽略
	$$class:function(className,context){
        var i=0,len,dom=[],arr=[];
		//如果传递过来的是字符串 ，则转化成元素对象
		if($$.$$isStringType(context)){
			context = document.getElementById(context);
		}else{
			context = document;
		};
		//如果兼容getElementsByClassName
		if(context.getElementsByClassName){
			return context.getElementsByClassName(className);
		}else{
			//如果浏览器不支持
			dom = context.getElementsByTagName('*');

			for(i;len=dom.length,i<len;i++){
				if(dom[i].className){
					arr.push(dom[i]);
				};
			};
		};
		return arr;
	},
	//对多组元素类型的选择如$$.$$group('div,#div,.li,span')并列关系
	$$group:function(content){
		var result=[],doms=[];
		var arr = $$.$$trim(content).split(',');
		//alert(arr.length);
		for(var i=0,len=arr.length;i<len;i++) {
            var item = $$.$$trim(arr[i]);
			var first= item.charAt(0);
            var index = item.indexOf(first);
            var name=item.slice(index+1);
			if(first === '.') {
				doms=$$.$$class(name)
				//每次循环将doms保存在reult中
				//result.push(doms);//错误来源

				//陷阱1解决 封装重复的代码成函数
				pushArray(doms,result);

			}else if(first ==='#'){
				doms=[$$.$$id(name)];//陷阱：之前我们定义的doms是数组，但是$id获取的不是数组，而是单个元素
				//封装重复的代码成函数
				pushArray(doms,result);
			}else{
				doms = $$.$$tag(item);
				pushArray(doms,result);
			};
		};
		return result;

		//封装重复的代码
		function pushArray(doms,result){
			for(var j= 0, domlen = doms.length; j < domlen; j++){
				result.push(doms[j]);
			};
		};
	},
	//层次选择器  $$.$$level('#ul li span')这种类型  可以只传一个
	$$level:function (select){
		//个个击破法则 -- 寻找击破点
		var sel = $$.$$trim(select).split(' ');
		var result=[];
		var context=[];
		for(var i = 0, len = sel.length; i < len; i++){
			result=[];
			var item = $$.$$trim(sel[i]);
			var first = sel[i].charAt(0)
			var index = item.indexOf(first)
			if(first ==='#'){
				//如果是#，找到该元素，
				pushArray([$$.$$id(item.slice(index + 1))]);
				context = result;
			}else if(first ==='.'){
				//如果是.
				//如果是.
				//找到context中所有的class为【s-1】的元素 --context是个集合
				if(context.length){
					for(var j = 0, contextLen = context.length; j < contextLen; j++){
						pushArray($$.$$class(item.slice(index + 1), context[j]));
					}
				}else{
					pushArray($$.$$class(item.slice(index + 1)));
				}
				context = result;
			}else{
				//如果是标签
				//遍历父亲，找到父亲中的元素==父亲都存在context中
				if(context.length){
					for(var j = 0, contextLen = context.length; j < contextLen; j++){
						pushArray($$.$$tag(item, context[j]));
					}
				}else{
					pushArray($$.$$tag(item));
				}
				context = result;
			}
		}

		return context;

		//封装重复的代码
		function pushArray(doms){
			for(var j= 0, domlen = doms.length; j < domlen; j++){
				result.push(doms[j])
			}
		}
	},
	//html5实现的选择器  获得满足条件的所有元素     $$.$$all('#container div,strong,#btn')
	//支持以上所有类型   得到的都是数组
	$$all:function(selector,context){
		context = context || document;
		return  context.querySelectorAll(selector);
	},
	
});

/*字符串相关框架*/
$$.$$extend($$,{
	//删除左右两边的空格
    $$trim:function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    //删除右两边的空格
    $$rtrim:function(str) {
        return str.replace(/(\s*$)/g,'');
    },
    //删除左两边的空格
    $$ltrim:function(str) {
        return str.replace(/(^\s*)/g,'');
    },
    //简单的数据绑定formateString  str:传入的字符串     data：数据   详情看百度案例
    //返回的是   用data的数据替换了的str里的某些数据的  str 
    $$formateString:function(str,data){
	    return str.replace(/@\((\w+)\)/g, function(match, key){
	        return typeof data[key] === "undefined" ? '' : data[key]});
	},
    //arttemplate语法 数据绑定  结合template.js插件使用
    //dom是容器id  id是 script上的id   datas是数据
    $$bindTemplate:function(dom,id,datas){
		var ocon=document.getElementById(dom);
		var m=template(id,datas);
		ocon.innerHTML=m;
	},
	//arttemplate语法 数据绑定  结合template.js插件使用   链接字符串用法
	//返回来的是用data的数据替换了的str里的某些数据的  str
	//source是字符串   data是数据   id容器id
	$$artTemplate:function(str,data){
		var render=template.compile(str);
		return html=render(data);
	},
	//获取location.search  也就是？后面的内容id=1&name=ming  返回的值是{id:'1',name:'ming'}
    $$getSearch:function(){
    	var search=window.location.search;
    	searchArr=search.substring(1).split('&');
    	var json = {};//定义一个临时对象
        //遍历数组
        for(var i=0;i<searchArr.length;i++) {
            var c = searchArr[i].indexOf("=");//获取每个参数中的等号小标的位置
            if(c==-1) continue;//如果没有发现测跳到下一次循环继续操作


            var d = searchArr[i].substring(0,c);  //截取等号前的参数名称，这里分别是id和name
            var e = searchArr[i].substring(c+1);  //截取等号后的参数值
            json[d] = e;//以名/值对的形式存储在对象中
        };
        return json;//返回对象
    },
    //字符串首个字母大写
    $$firstUppercase:function(str){
        return str.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();
        });
    },
});

/*日期框架*/
$$.$$extend($$,{
	//日期格式      $$.$$dateFormat(new Date(),'yyyy年MM月dd日   hh:mm')
    $$dateFormat:function(date,format) {
        var o = {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (date.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                            ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    },
});

/*事件框架*/
$$.$$extend($$,{
	/*绑定事件*/
    $$on: function (id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.$$isStringType(id)?document.getElementById(id):id;
        //如果支持
        //W3C版本 --火狐 谷歌 等大多数浏览器
        //如果你想检测对象是否支持某个属性，方法，可以通过这种方式
        if(dom.addEventListener ) {
            dom.addEventListener(type, fn, false);
        }else if(dom.attachEvent){
            //如果支持 --IE
            dom.attachEvent('on' + type, fn);
        };
    },
    /*解除事件*/
    $$un:function(id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.$$isStringType(id)?document.getElementById(id):id;
        if(dom.removeEventListener){
            dom.removeEventListener(type, fn);
        }else if(dom.detachEvent){
            dom.detachEvent(type, fn);
        };
    },
    /*点击*/
    $$click : function(id,fn){
        this.$$on(id,'click',fn);
    },
    /*鼠标移上*/
    $$mouseover:function(id,fn){
        this.$$on(id,'mouseover',fn);
    },
    /*鼠标离开*/
    $$mouseout:function(id,fn){
        this.$$on(id,'mouseout',fn);
    },
    /*悬浮*/
    $$hover : function(id,fnOver,fnOut){
        if(fnOver){
            this.$$on(id,"mouseover",fnOver);
        };
        if(fnOut){
            this.$$on(id,"mouseout",fnOut);
        };
    },
    //兼容event对象
    $$getEv: function(ev){
		return ev?ev:window.event;
	},
	$$getEvTarget:function(ev){
		var ev=$$.$$getEv(ev);
		return ev.target || ev.srcElement;
	},
	//兼容阻止默认事件
	$$preventDefault:function(ev){
		var event=$$.$$getEv(ev);
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		};
	},
	//阻止冒泡事件
	$$stopPropagation:function(ev){
		var event=$$.$$getEv(ev);
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		};
	},
	//事件的委托   可以代替for遍历
	$$delegate:function (parentid, eventType, selector, fn) {
        //参数处理
        var parent = $$.$$id(pid);
        function handle(e){
            var target = $$.GetTarget(e);
            if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                // 为什么使用call，因为call可以改变this指向
                // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                fn.call(target);
            };
        };
        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
        //这里是是给元素对象绑定一个事件
        parent[eventType]=handle;
    },
	
});

/*数字相关操作*/
$$.$$extend($$,{
	//获取某个区间的随机整数
	$$getRandom:function(begin,end){
		return Math.floor( Math.random()*(end-begin))+begin;
	},
});

/*判断数据类型*/
$$.$$extend($$,{
	//判断数据类型
	$$isNumber:function (val){
        return typeof val === 'number' && isFinite(val);
    },
    $$isBooleanType:function (val) {
        return typeof val ==="boolean";
    },
	$$isStringType:function (val) {
        return typeof val === "string";
    },
    $$isUndefined:function (val) {
        return typeof val === "undefined";
    },
    $$isObj:function (str){
        if(str === null || typeof str === 'undefined'){
            return false;
        }
        return typeof str === 'object';
    },
    $$isNull:function (val){
        return  val === null;
    },
    $$isArray:function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    },
});

/*ajax框架*/
$$.$$extend($$,{
	//自己的ajax
    $$Ajax:function(URL,fn){
        var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                    fn(xhr.responseText);
                }else{
                    alert("错误的文件！");
                }
            }
        };
        xhr.open("get",URL,true);
        xhr.send();
        //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
        function createXHR() {
            //本函数来自于《JavaScript高级程序设计 第3版》第21章
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        };
                    };
                };

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            };
        };
    },
});


/*操作css框架*/
$$.$$extend($$,{
	$$css:function(context,key,value){
		var doms=$$.$$isStringType(context) ? $$.$$all(context) : context;
		//对context判断是否传入多个
		//此时doms为多个
		if (doms.length){
			//有value表示设置  没有表示获取
			//此时表示设置多个
			if(value){
				for (var i=0;i<doms.length;i++){
					setStyle(doms[i],key,value)
				};
			//此时表示获取单个
			}else{
				return getStyle(doms[0],key);
			};
		//此时doms为单个
		}else{
			//此时表示设置一个
			if(value){
				setStyle(doms,key,value);
			//此时表示获取单个
			}else{
				return getStyle(doms,key);
			};
		};
		//设置单个值   方便思路
		function setStyle(dom,key,value){
			dom.style[key]=value; 
		};
		//获取单个值   方便思路
		function getStyle(dom,key){
			if (dom.currentStyle){
				return dom.currentStyle[key];   //兼容IE某些版本
			}else{
				return  window.getComputedStyle(dom,null)[key];
			};
		};
	},
	//元素高度宽度概述
	//计算方式：clientHeight clientWidth innerWidth innerHeight
	//元素的实际高度+border，也不包含滚动条
	$$Width:function (id){
		return $$.$$id(id).clientWidth
	},
	$$Height:function (id){
		return $$.$$id(id).clientHeight
	},


	//元素的滚动高度和宽度
	//当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
	//计算方式 scrollwidth
	$$scrollWidth:function (id){
		return $$.$$id(id).scrollWidth
	},
	$$scrollHeight:function (id){
		return $$.$$id(id).scrollHeight
	},
	//元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
	//计算方式 scrollTop scrollLeft
	$$scrollTop:function (id){
		return $$.$$id(id).scrollTop
	},
	$$scrollLeft:function (id){
		return $$.$$id(id).scrollLeft
	},

    //获取屏幕的高度和宽度
    $$screenHeight:function (){
	    return  window.screen.height
	},
    $$screenWidth:function (){
	    return  window.screen.width
	},
    //文档视口的高度和宽度
    $$wWidth:function (){
	    return document.documentElement.clientWidth
	},
    $$wHeight:function (){
	    return document.documentElement.clientHeight
	},
    //文档滚动区域的整体的高和宽
    $$wScrollHeight:function () {
	    return document.body.scrollHeight
	},
    $$wScrollWidth:function () {
	    return document.body.scrollWidth
	},
    //获取滚动条相对于其顶部的偏移
    $$wScrollTop:function () {
    var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
	    return scrollTop
	},
    //获取滚动条相对于其左边的偏移
    $$wScrollLeft:function () {
	    var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
	    return scrollLeft
	},
	$$show:function(context){
		var doms=$$.$$all(context);
		for (var i=0;i<doms.length;i++){
			$$.$$css(doms[i],'display','block')
		};
	},
	$$hide:function(context){
		var doms=$$.$$all(context);
		for (var i=0;i<doms.length;i++){
			$$.$$css(doms[i],'display','none')
		};
	},
	
});

/*操作属性框架*/
$$.$$extend($$,{
	$$attr:function(context,key,value){
		var doms=$$.$$all(context);
		if (value){
			for (var i=0;i<doms.length;i++){
				doms[i].setAttribute(key,value);
			};
		}else{
			return doms[0].getAttribute(key);
		};
	},
	$$addClass:function(context,name){
		var doms=$$.$$all(context);
		for (var i=0;i<doms.length;i++){
			doms[i].className=doms[i].className+' '+name;
		};
	},
	$$removeClass:function (context,name){
		var doms=$$.$$all(context);
		for (var i=0;i<doms.length;i++){
			doms[i].className=doms[i].className.replace(name,'');
		};
	},
	//判断是否有
    $$hasClass:function (context,name){
        var doms = $$.$$all(context)
        var flag = true;
        for(var i= 0,len=doms.length;i<len;i++){
            flag = flag && check(doms[i],name)
        };
        return flag;
        //判定单个元素
        function check(element,name){
            return -1<(' '+element.className+' ').indexOf(' '+name+' ')
        };
    },
    //获取
    $$getClass:function (id){
        var doms = $$.$$all(id)
        return $$.$$trim(doms[0].className).split(' ');
    },
    $$html:function (context,value){
		var doms=$$.$$all(context);
		if (value){
			for (var i=0;i<doms.length;i++){
				doms[i].innerHTML=value;
			};
		}else{
			return doms[0].innerHTML
		};
	},
})


//缓存框架 - 内存篇
$$.cache = {
    data:[],
    $$get:function(key){
        console.log('111')
        var value = null;
        console.log(this.data)
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (key == item.key) {
                value = item.value;
            }
        }
        console.log('get'+value)
        return value;
    },
    $$add:function(key,value){
        var json= { key: key, value: value};
        this.data.push(json);
    },
    $$delete:function(key){
        var status = false;
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            // 循环数组元素
            if (item.key.trim() == key) {
                this.data.splice(i, 1);//开始位置,删除个数
                status = true;
                break;
            }
        }
        return status;
    },
    $$update:function(key,value){
        var status = false;
        // 循环数组元素
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (item.key.trim() === key.trim()) {
                item.value = value.trim();
                status = true;
                break;
            }
        }
        return status;
    },
    $$isExist:function(key){
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (key === item.key) {
                return true;
            }else{
                return false;
            }
        }
    }
};

//cookie框架
$$.cookie = {
    //设置cookie
    $$setCookie: function (name,value,days,path){
	    var name = escape(name);
	    var value = escape(value);
	    var expires = new Date();
	    expires.setTime(expires.getTime() + days*24*60*60*1000);
	    path = path == "" ? "" : ";path=" + path;
	    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
	    document.cookie = name + "=" + value + _expires + path;
	},
    //获取cookie值
    $$getCookie:function (name){
	    var name = escape(name);
	    //读cookie属性，这将返回文档的所有cookie
	    var allcookies = document.cookie;
	
	    //查找名为name的cookie的开始位置
	    name += "=";
	    var pos = allcookies.indexOf(name);
	    //如果找到了具有该名字的cookie，那么提取并使用它的值
	    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
	        var start = pos + name.length;                  //cookie值开始的位置
	        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
	        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
	        var value = allcookies.substring(start,end);  //提取cookie的值
	        return unescape(value);                           //对它解码
	    }
	    else return "";                                             //搜索失败，返回空字符串
	},
    //删除cookie
    $$deleteCookie:function (name,path){
	    var name = escape(name);
	    var expires = new Date(0);
	    path = path == "" ? "" : ";path=" + path;
	    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
	}
};


//本地存储框架    $$.store.get("name");
$$.store = (function () {
    var api               = {},
        win               = window,
        doc               = win.document,
        localStorageName  = 'localStorage',
        globalStorageName = 'globalStorage',
        storage;
	
    api.set    = function (key, value) {};
    api.get    = function (key)        {};
    api.remove = function (key)        {};
    api.clear  = function ()           {};

    if (localStorageName in win && win[localStorageName]) {
        storage    = win[localStorageName];
        api.set    = function (key, val) { storage.setItem(key, val) };
        api.get    = function (key)      { return storage.getItem(key) };
        api.remove = function (key)      { storage.removeItem(key) };
        api.clear  = function ()         { storage.clear() };

    } else if (globalStorageName in win && win[globalStorageName]) {
        storage    = win[globalStorageName][win.location.hostname];
        api.set    = function (key, val) { storage[key] = val };
        api.get    = function (key)      { return storage[key] && storage[key].value };
        api.remove = function (key)      { delete storage[key] };
        api.clear  = function ()         { for (var key in storage ) { delete storage[key] } };

    } else if (doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) { return storage }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }
        api.set = function (key, val) {
            var storage = getStorage();
            storage.setAttribute(key, val);
            storage.save(localStorageName);
        };
        api.get = function (key) {
            var storage = getStorage();
            return storage.getAttribute(key);
        };
        api.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        }
        api.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;;
            storage.load(localStorageName);
            for (var i=0, attr; attr = attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        }
    }
    return api;
})();



/*动画框架*/
function Animate(){
	this._timer;
	this._interval=16;
	this.queen=[];
};
//将每一个部分细分
Animate.prototype={
	//不断的循坏形成运动3
	_run:function(){
		var that=this;
		that._timer=setInterval(function(){that._loop()},that._interval)
	},
	
	//每次循环要做的事情4
	_move:function(_obj){
		var that=this;
		var div=_obj.id;
		var now= _obj.now;
		var pass= +new Date();
		var shijian=_obj.shijian;
		var jinchen=this._getjinchen(pass,now,shijian);
		var styles=_obj.styles;
		this._manyProperty(div,styles,jinchen);
		if(jinchen>1){
			that._stop(div,styles);
		};
	},
	
	_stop:function(div,styles){
		this._manyProperty(div,styles,1)
		clearInterval(this._timer);
	},
	
	//循环this.queen=[];这个数组
	_loop:function(){
		var that=this;
		for (var i=0;i<that.queen.length;i++){
			var _obj=that.queen[i];
			that._move(_obj)
		};
		
	},
	
	//获得进程   跟着4
	_getjinchen:function (pass,now,zongshijian){
		var yongshi=pass-now;
		var jinchen=yongshi/zongshijian;
		return jinchen; 
	},
	
	//对一个属性进行操作    跟着4
	_oneProperty:function (dom,property,start,julii,jinchen){
		//单个属性
		if (property=='opacity'){
			$$.$$css(dom,property,(start+julii*jinchen));
		}else{
			$$.$$css(dom,property,(start+julii*jinchen)+'px');
		};
	},
	
	//对适配器转化了的多个进行操作    跟着4
	_manyProperty:function(div,styles,jinchen){
		for (var i=0;i<styles.length;i++){
			//console.log(styles[i])
			this._oneProperty(div,styles[i].name,styles[i].start,styles[i].juli,jinchen);
		};
	},
	
	//接收用户传递的参数2
	add:function(id,json,duration){
		//执行需要调用其他的子函数7
		this._adapterMany(id,json,duration);
		this._run();
	},
	
	//处理数据5
	_adapter:function(id,json,duration){
		var _obj={}
		_obj.id=$$.$$all(id);
		_obj.now= +new Date();
		_obj.shijian=duration;
		//console.log(this._obj.shijian)
		_obj.styles=this._getstyles(_obj.id,json);
		
		return _obj
	},
	
	//用户传过来的数据放在数组内
	_adapterMany:function(id,json,duration){
		var _obj=this._adapter(id,json,duration);
		this.queen.push(_obj);
	},
	
	//适配器 将用户传过来的数据进行转化为自己编程方便的形式      跟着5
	_getstyles:function(obj,source){
		var styles=[];
		for (var item in source){
			var j={};   //不能放在外面
			j.name=item;
			j.start=parseFloat($$.$$css(obj,item));
			j.juli=parseFloat(source[item])-j.start;
			styles.push(j);
		};
		return styles;
	}
};
var $$animate=new Animate();



