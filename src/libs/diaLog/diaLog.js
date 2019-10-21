/*
作者:罗炫铭
日期:2019.4.26
功能：弹窗插件:提供三款弹窗效果

布局：按钮点击即可调用

var d1=new DiaLog();
	d1.init({
		'iNow': 1,//当出现多个弹窗是，则需要定义数字,如果一个页面只有一个弹窗的时候可忽略
		'widht':300,
		'height':400,
		'position':'center',
		'title':'登录框', 
		'icon':'fa fa-question-circle-o',//可输入类名的icon
		'iconText':null,//需要输入提示内容时会出现icon和提示内容
		'content':'', //内容
		'confirm':function(){}, //确认回调 返回是实例
		'cancle':function(){}, //取消回调
		'layer':true, //是否显示layer
		'opacity':0.7, //layer层的透明度
		'closeBtn':'×', //关闭按钮,可传入节点或文字
		'duration':2000,//弹窗出现的时间，默认false，以秒为单位
		'footer': true, //是否需要回调按钮
		'btnText': '',//有文字输入的时候，只显示一个按钮
		'msgText':{ 
			'type' :undefined, //这里取值可以为 success del ，duration必须输入时间才能自动关闭
			'result':"创建成功 !",
			'msg':"请在3~5分钟后查看报告"
		}
	});
* */

//弹窗开发

function DiaLog() {
	this.oDiv = null;
	this.oLayers = null;
	this.oMsg = null;
	this.defaults = {
		//默认参数
		'width': 460,
		'height': 202,
		'position': 'center',
		'closeBtn': '<i class="fa fa-close"></i>',
		'title': '提示',
		'icon':'fa fa-question-circle-o',
		'iconText':null,
		'content': '',
		'confirm': function (res) { },
		'cancle': function (res) { },
		'layer': true,
		'opacity': 0.5,
		'duration': false,
		'footer': true,
		'btnText': '',
		'msgText':{
			'type' :undefined,
			'icon':'fa  fa-check-circle-o',
			'result':"创建成功 !",
			'msg':"请在3~5分钟后查看报告"
		}
	}
}

//2.使用继承函数实现：配置函数和默认参数的设置
function extend(obj1, obj2) {
	for (var attr in obj2) {
		obj1[attr] = obj2[attr];
	}
}

DiaLog.prototype.status = function () {

}

//3.初始化方法的构造
DiaLog.prototype.init = function (opt) {
	extend(this.defaults, opt);//能够实现，有配置参数用配置参数

	//创建节点
	if (this.status[opt.iNow] == undefined) {
		this.status[opt.iNow] = true;
	}
	if (this.status[opt.iNow]) {
		this.Create();
		this.SetData();
		this.Close();
		this.Confirm();
		this.Cancle();
		this.Resize();
		this.Autoff();
		this.status[opt.iNow] = false;
	}
}

//4.创建节点
DiaLog.prototype.Create = function () {
	this.oLayers = $('<div class="diaLog-layer"></div>');
	this.oDiv = $('<div></div>');
	this.oDiv.attr('class', 'box');
	if (this.defaults.layer) {
		//是否添加遮罩层
		$('body').append(this.oLayers, this.oDiv);
	} else {
		$('body').append(this.oDiv);
	}

	if(this.defaults.msgText.type){
		if(this.defaults.msgText.type=='success'){
			this.oDiv.append( `<dl class="msg-text-dl"><dt><i class="${this.defaults.msgText.icon}"><span><span></i>${this.defaults.msgText.result}</dt><dd>${this.defaults.msgText.msg}</dd></dl>`);
		}else{
			this.oDiv.append( `<dl class="msg-text-dl"><dt><i class="${this.defaults.msgText.icon}"><span><span></i>${this.defaults.msgText.result}</dt></dl>`);
		}
		$('.diaLog-layer').hide();
	}else{
		
		this.oDiv.html(`<div class="title"><div class="title-text">${this.defaults.title}</div><span class="close">${this.defaults.closeBtn}</span></div><div class="content">${this.defaults.content}</div></div>`);
		if (this.defaults.footer) {
			//是否添加回调按钮
			if (this.defaults.btnText == '') {
				this.oDiv.append( `<div class="footer"><div class="diaLog-btn cancle f-btn">取消</div><div class="diaLog-btn confirm f-btn f-btn-a">确定</div>`);
			} else {
				this.oDiv.append( `<div class="footer"><div class="diaLog-btn cancle">${this.defaults.btnText}</div>`);
			}
		} else {
			this.oDiv.find('.content').css({ 'bottom': 0 })
		}
		if(this.defaults.iconText){
			this.oDiv.find('.title .title-text').append(`<span class="ask-icon ${this.defaults.icon}"><div class="ask-box-text">${this.defaults.iconText}</div></span>`);
		}
	}
	
}

//5.设置div位置
DiaLog.prototype.SetData = function () {

	if(!this.oDiv.find('.content').children()[0]){
		//判断只是输入文字时的操作
		this.oMsg = $('<div></div>');
		this.oMsg.attr('class', 'msg-text');
		this.oMsg.html(this.defaults.content);
		this.oDiv.find('.content').html(this.oMsg);
	}
	
	if (this.defaults.layer) {
		this.oLayers.css({
			'width': $(window).width(),
			'height': $(window).height(),
			'background-color': '#000000',
			'position': 'fixed',
			'left': 0,
			'top': 0,
			'opacity': this.defaults.opacity,
			'z-index': 999
		});
	}

	if(this.defaults.msgText.type){
		if(this.defaults.msgText.type=='success'){
			this.oDiv.css({
				'width': '336px',
				'height': '114px',
				'background':'#6cc96d',
				'z-index': 1000
			});
		}else{
			this.oDiv.css({
				'width': '234px',
				'height': '64px',
				'background':'#f7b368',
				'z-index': 1000
			});
		}
		
	}else{
		this.oDiv.css({
			'width': this.defaults.width,
			'height': this.defaults.height,
			'z-index': 1000
		});
	}
	

	if (this.defaults.position == 'center') {
		this.oDiv.css({
			'left': ($(window).width() - this.oDiv.outerWidth()) / 2,
			'top': ($(window).height() - this.oDiv.outerHeight()) / 2
		});
	} else if (this.defaults.position == 'right') {
		this.oDiv.css({
			'right': 0,
			'top': ($(window).height() - this.oDiv.outerHeight()) / 2
		});
	} else if (this.defaults.position == 'rightbottom') {
		this.oDiv.css({
			'right': 0,
			'bottom': 0
		});
	}
}

//6.关闭功能
DiaLog.prototype.Close = function () {
	var _this = this;
	var oClose = this.oDiv.find('.close');
	oClose.click(function () {
		$(this).parent().parent().remove();
		if (_this.defaults.layer) {
			$('.diaLog-layer').remove();
		}
		_this.status[_this.defaults.iNow] = true;
	});
}

//7.确定功能
DiaLog.prototype.Confirm = function () {
	var _this = this;
	var confirm = this.oDiv.find('.confirm');
	confirm.click(function () {
		$(this).parent().parent().remove();
		if (_this.defaults.layer) {
			$('.diaLog-layer').remove();
		}
		_this.defaults.confirm(_this.oDiv);
		_this.status[_this.defaults.iNow] = true;
	})
}

//7.取消功能
DiaLog.prototype.Cancle = function () {
	var _this = this;
	var oCancle = this.oDiv.find('.cancle');
	oCancle.click(function () {
		$(this).parent().parent().remove();
		if (_this.defaults.layer) {
			$('.diaLog-layer').remove();
		}
		_this.defaults.cancle('取消');
		_this.status[_this.defaults.iNow] = true;
	})
}

//8.自动关闭
DiaLog.prototype.Autoff = function(){
	var _this = this;
	if(!this.defaults.duration){
		return;
	}
	var timer;
	clearTimeout(timer);
	timer = setTimeout(function(){
		_this.oDiv.remove();
		$('.diaLog-layer').remove();
		_this.defaults.confirm(_this.oDiv);
		_this.defaults.cancle('取消');
		_this.status[_this.defaults.iNow] = true;
	},this.defaults.duration);
}

//9.改变尺寸
DiaLog.prototype.Resize = function(){
	var _this= this;
	$(window).resize(function(){
		_this.SetData();
	});
}