
//直接放在命名空间里  有分块
(function(w){
	var $$={};
	//公共模块
	$$.common={
		$$extend:function(newSource,oldSource){
			for (var i in oldSource){
				newSource[i]=oldSource[i];	
			};
			return newSource;
		},
	};
	
	//选择模块
	$$.getDom={
		//id选择器
	    $$id:function(id){
	        return document.getElementById(id);
	    },
		//tag选择器   在context内找        context可以忽略  
	    $$tag:function(tag,context){
			if(typeof context == 'string'){
				context = $$.getDom.$$id(context);
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
			if($$.Is.$$isStringType(context)){
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
			var arr = $$.Str.$$trim(content).split(',');
			//alert(arr.length);
			for(var i=0,len=arr.length;i<len;i++) {
	            var item = $$.Str.$$trim(arr[i]);
				var first= item.charAt(0);
	            var index = item.indexOf(first);
	            var name=item.slice(index+1);
				if(first === '.') {
					doms=$$.getDom.$$class(name)
					//每次循环将doms保存在reult中
					//result.push(doms);//错误来源
	
					//陷阱1解决 封装重复的代码成函数
					pushArray(doms,result);
	
				}else if(first ==='#'){
					doms=[$$.getDom.$$id(name)];//陷阱：之前我们定义的doms是数组，但是$id获取的不是数组，而是单个元素
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
			var sel = $$.Str.$$trim(select).split(' ');
			var result=[];
			var context=[];
			for(var i = 0, len = sel.length; i < len; i++){
				result=[];
				var item = $$.Str.$$trim(sel[i]);
				var first = sel[i].charAt(0)
				var index = item.indexOf(first)
				if(first ==='#'){
					//如果是#，找到该元素，
					pushArray([$$.getDom.$$id(item.slice(index + 1))]);
					context = result;
				}else if(first ==='.'){
					//如果是.
					//如果是.
					//找到context中所有的class为【s-1】的元素 --context是个集合
					if(context.length){
						for(var j = 0, contextLen = context.length; j < contextLen; j++){
							pushArray($$.getDom.$$class(item.slice(index + 1), context[j]));
						}
					}else{
						pushArray($$.getDom.$$class(item.slice(index + 1)));
					}
					context = result;
				}else{
					//如果是标签
					//遍历父亲，找到父亲中的元素==父亲都存在context中
					if(context.length){
						for(var j = 0, contextLen = context.length; j < contextLen; j++){
							pushArray($$.getDom.$$tag(item, context[j]));
						}
					}else{
						pushArray($$.getDom.$$tag(item));
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
	};
	
	//字符串操作模块
	$$.Str={
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
	}
	
	//判断字符串类型
	$$.Is={
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
	};

	w.$$=$$
})(window);




