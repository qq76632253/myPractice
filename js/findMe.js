var game = {};
//缓存
game.pages = $('.page');
game.startBtn = $('.start-game').eq(0);
game.pauseBtn = $('.btn-pause').eq(0);
game.continueBtn = $('.continue').eq(0);
game.restartBtn = $('.restart').eq(0);
game.blockBox = $('#box');
game.scoreBox = $('.score').eq(0);
game.timeBox = $('.time').eq(0);
game.resultBox = $('.result').eq(0);
game.eventType = document.ontouchstart ? 'touchstart' : 'click';
game.imgUrls = [];
game.time = 60;
game.score = 0;
game.level = 0;
game.levelMap = [2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7];
game.colorDiff = [115, 100, 100, 85, 85, 85, 70, 70, 70, 70, 55, 55, 55, 55, 55, 40, 40, 40, 40, 40, 40];
game.diffIndex = 0;

//加载游戏
game.loading = function(){
	var imgCounts = this.imgUrls.length;
	if (imgCounts == 0){
		this.switchPage(1);
		this.initEvent();
	}else{
		var num = 0,
		self = this;

		function count(){
			num++;
			if (num == imgCounts){
				self.switchPage(1);
				self.initEvent();
			}
		}
		for (var i = 0; i < imgCounts; i++){
			var img = new Image();
			img.onload = count;
			img.src = this.imgUrls[i];
		}
	}
};

//初始化事件
game.initEvent = function(){
	this.startBtn.on(this.eventType, this.start.bind(this));
	this.restartBtn.on(this.eventType, this.start.bind(this));
	this.blockBox.on(this.eventType, this.clickBlock.bind(this));
	this.pauseBtn.on(this.eventType, this.pause.bind(this));
	this.continueBtn.on(this.eventType, this.continue.bind(this));
}

//点击方块事件
game.clickBlock = function(event){
	if (event.target.tagName.toLowerCase() === 'span'){
		//选对了
		if ($(event.target).index() == this.diffIndex){
			this.level++;
			this.score++;
			this.render();
		}else{
			this.over();
		}
	}
};

//开始游戏
game.start = function () {
	this.switchPage(2);
	this.render();
	this.timeCount();
}

//游戏界面渲染
game.render = function(){
	//获取有n*n
	var num = this.levelMap[this.level] ? this.levelMap[this.level] : this.levelMap[this.levelMap.length-1],
			colorDiff = this.colorDiff[this.level] ? this.colorDiff[this.level]:this.colorDiff[this.colorDiff.length-1],
			color = [],
			lvColor = [];
	//分数
	this.scoreBox.html('得分: ', this.score);
	//时间
	this.timeBox.html(this.time);
	//给box添加类名
	this.blockBox[0].className = 'lv' + num;
	//得到不同块的index
	this.diffIndex = Math.floor(Math.random() * num * num);
	//获取颜色
	color = this.getColor(257 - colorDiff);
	lvColor = this.getLvColor(color[0], colorDiff);
	//添加block
	var str = '';
	num*=num;
	for (var i = 0; i < num; i++){
		if (i == this.diffIndex){
			str += '<span style="background-color: '+lvColor[1]+';"></span>';
		}else{
			str += '<span style="background-color: '+color[1]+';"></span>';
		}
	};
	this.blockBox.html(str);
};

//得到随机颜色
game.getColor = function(max){
	var t = [Math.floor(Math.random() * max), Math.floor(Math.random() * max), Math.floor(Math.random() *max)];
	return [t, "rgb(" + t.join(",") + ")"];
};

//得到不同的颜色
game.getLvColor = function(color, diff){
	var r = [];
    r[0] = color[0] + diff;
    r[1] = color[1] + diff;
    r[2] = color[2] + diff;
    return [r, "rgb(" + r.join(",") + ")"];
};

//游戏结束处理
game.over = function(){
	this.switchPage(4);
	this.resultBox.html('总分: '+ this.score);
	clearInterval(this.timer);
	this.time = 60;
	this.score =0;
	this.level = 0;
};

//游戏暂停处理
game.pause = function(){
	clearInterval(this.timer);
	this.switchPage(3);
};

//继续游戏
game.continue = function(){
	this.switchPage(2);
	this.timeCount();
};

//计时器
game.timeCount = function(){
	var self = this;
	game.timer = setInterval(function(){
		self.time--;
		self.timeBox.html(self.time);
		if (self.time == 0){
			self.over.call(self);
		}
	}, 1000)
};

//换页
game.switchPage = function(index){
	this.pages.css('display', 'none');
	this.pages.eq(index).css('display', 'block');
};

//游戏入口,触发加载
game.loading();
