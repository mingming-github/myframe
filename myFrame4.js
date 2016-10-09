(function(w){
	var $$=function(doms){
		this.Elements=[];
		return this.$all(doms);
	};
	$$.prototype={
		$all:function(doms,context){
			context = context || document;
			this.Elements=context.querySelectorAll(doms);
			return this;
		},
		hide:function(){
			for (var i=0;i<this.Elements.length;i++){
				this.Elements[i].style.display='none';
			};
			return this;
		},
		show:function(){
			for (var i=0;i<this.Elements.length;i++){
				this.Elements[i].style.display='block';
			};
			return this;
		},
//css/////////////////////////////////////////////////////////////////////////////
		css:function(key,value){
			var doms=this.Elements;
			//对context判断是否传入多个
			//此时doms为多个
			if (doms.length){
				//有value表示设置  没有表示获取
				//此时表示设置多个
				if(value){
					for (var i=0;i<doms.length;i++){
						setStyle(doms[i],key,value);
						return this;
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
					return this;
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
		Width:function (){
			return this.Elements[0].clientWidth
		},
		Height:function (){
			return this.Elements[0].clientHeight
		},
		//元素的滚动高度和宽度
		//当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
		//计算方式 scrollwidth
		scrollWidth:function (){
			return this.Elements[0].scrollWidth
		},
		scrollHeight:function (){
			return this.Elements[0].scrollHeight
		},
		//元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
		//计算方式 scrollTop scrollLeft
		scrollTop:function (){
			return this.Elements[0].scrollTop
		},
		scrollLeft:function (){
			return this.Elements[0].scrollLeft
		},
	    //获取屏幕的高度和宽度
	    screenHeight:function (){
		    return  window.screen.height
		},
	    screenWidth:function (){
		    return  window.screen.width
		},
	    //文档视口的高度和宽度
	    wWidth:function (){
		    return document.documentElement.clientWidth
		},
	    wHeight:function (){
		    return document.documentElement.clientHeight
		},
	    //文档滚动区域的整体的高和宽
	    wScrollHeight:function () {
		    return document.body.scrollHeight
		},
	    wScrollWidth:function () {
		    return document.body.scrollWidth
		},
	    //获取滚动条相对于其顶部的偏移
	    wScrollTop:function () {
	    var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
		    return scrollTop
		},
	    //获取滚动条相对于其左边的偏移
	    wScrollLeft:function () {
		    var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
		    return scrollLeft
		},
	
//ajax/////////////////////////////////////////////////////////////////////////////////////	
		//自己的ajax
	    Ajax:function(URL,fn){
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

//操作属性框架/////////////////////////////////////////////////////////////////////////////////////	
		attr:function(key,value){
			var doms=this.Elements;
			if (value){
				for (var i=0;i<doms.length;i++){
					doms[i].setAttribute(key,value);
					return this;
				};
			}else{
				return doms[0].getAttribute(key);
			};
		},
		addClass:function(name){
			var doms=this.Elements;
			for (var i=0;i<doms.length;i++){
				doms[i].className=doms[i].className+' '+name;
				return this;
			};
		},
		removeClass:function (name){
			var doms=this.Elements;
			for (var i=0;i<doms.length;i++){
				doms[i].className=doms[i].className.replace(name,'');
				return this;
			};
		},
		//判断是否有
	    hasClass:function (name){
	        var doms = this.Elements;
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
	    getClass:function (){
	        var doms = this.Elements;
	        return $$.$$trim(doms[0].className).split(' ');
	    },
	    html:function (value){
			var doms=this.Elements;
			if (value){
				for (var i=0;i<doms.length;i++){
					doms[i].innerHTML=value;
					return this;
				};
			}else{
				return doms[0].innerHTML
			};
		},

////字符串操作/////////////////////////////////////////////////////////////////////////////////////////
		//删除左右两边的空格
	    trim:function(str) {
	        return str.replace(/(^\s*)|(\s*$)/g, '');
	    },
	    //删除右两边的空格
	    rtrim:function(str) {
	        return str.replace(/(\s*$)/g,'');
	    },
	    //删除左两边的空格
	    ltrim:function(str) {
	        return str.replace(/(^\s*)/g,'');
	    },
	    //简单的数据绑定formateString  str:传入的字符串     data：数据   详情看百度案例
	    //返回的是   用data的数据替换了的str里的某些数据的  str 
	    formateString:function(str,data){
		    return str.replace(/@\((\w+)\)/g, function(match, key){
		        return typeof data[key] === "undefined" ? '' : data[key]});
		},
	    //arttemplate语法 数据绑定  结合template.js插件使用
	    //dom是容器id  id是 script上的id   datas是数据
	    bindTemplate:function(dom,id,datas){
			var ocon=document.getElementById(dom);
			var m=template(id,datas);
			ocon.innerHTML=m;
		},
		//arttemplate语法 数据绑定  结合template.js插件使用   链接字符串用法
		//返回来的是用data的数据替换了的str里的某些数据的  str
		//source是字符串   data是数据   id容器id
		artTemplate:function(str,data){
			var render=template.compile(str);
			return html=render(data);
		},
		//获取location.search  也就是？后面的内容id=1&name=ming  返回的值是{id:'1',name:'ming'}
	    getSearch:function(){
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
	    firstUppercase:function(str){
	        return str.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();
	        });
	    },


///事件框架//////////////////////////////////////////////////////////////////////////////////////////
		/*绑定事件*/
	    on: function (type, fn) {
	        //var dom = document.getElementById(id);
	        var dom = this.Elements[0];
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
	    un:function(type, fn) {
	        //var dom = document.getElementById(id);
	        var dom = this.Elements[0];
	        if(dom.removeEventListener){
	            dom.removeEventListener(type, fn);
	        }else if(dom.detachEvent){
	            dom.detachEvent(type, fn);
	        };
	    },
	    /*点击*/
	    click : function(fn){
	        this.on('click',fn);
	    },
	    /*鼠标移上*/
	    mouseover:function(fn){
	        this.on('mouseover',fn);
	    },
	    /*鼠标离开*/
	    mouseout:function(fn){
	        this.on('mouseout',fn);
	    },
	    /*悬浮*/
	    hover : function(fnOver,fnOut){
	        if(fnOver){
	            this.on("mouseover",fnOver);
	        };
	        if(fnOut){
	            this.on("mouseout",fnOut);
	        };
	    },
	    //兼容event对象
	    getEv: function(ev){
			return ev?ev:window.event;
		},
		getEvTarget:function(ev){
			var ev=this.getEv(ev);
			return ev.target || ev.srcElement;
		},
		//兼容阻止默认事件
		preventDefault:function(ev){
			var event=this.getEv(ev);
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;
			};
		},
		//阻止冒泡事件
		stopPropagation:function(ev){
			var event=this.getEv(ev);
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			};
		},
		//事件的委托   可以代替for遍历
		delegate:function (parentid, eventType, selector, fn) {
	        //参数处理
	        var parent = this.Elements[0];
	        function handle(e){
	            var target = this.getEvTarget(e);
	            if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
	                // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
	                // 为什么使用call，因为call可以改变this指向
	                // 函数中的this默认指向window，而我们希望指向当前dom元素本身
	                fn.call(target);
	            };
	        };
	        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
	        //这里是是给元素对象绑定一个事件
	        parent[eventType]=handle;
	    },
		
		
		
		
	
	};
	w.$=function(doms){
		return new $$(doms)
	};
	
})(window)
