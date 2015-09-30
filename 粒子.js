var canvas = document.getElementById("canvas");
canvas.width = 700;
canvas.height = 500;

var ctx = canvas.getContext("2d");

var canvascopy = document.createElement("canvas");
canvascopy.width = 500;
canvascopy.height = 500;
var ctxcopy = canvascopy.getContext("2d");

var imgdata = new Array(); //图片像素数组数据
var imgData;//图片数据对象
var imgWidth,imgHeight;//图片宽高
var pixArray = new Array();//
var pixSize = 4;

var img = new Image();//图片对象初始化
img.src = "k1.png";

pixImgX = 0;
pixImgY = 0;

var clickCnt = 0;

window.onload = function(){
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "160px 微软雅黑";
	ctx.fillStyle = "rgba(255,50,50,255)"
	ctx.fillText("粒子", canvas.width / 2, canvas.height / 2);
	imgData = ctx.getImageData(pixImgX,pixImgY,pixImgX + canvas.width,pixImgY + canvas.height);
	imgdata = imgData.data;
	imgWidth = imgData.width;
	imgHeight = imgData.height;
	getPix();
	setInterval(upData,20 );
	}

document.onclick = function(){
	if(clickCnt == 0||clickCnt == 2){
		clickCnt = 1;
		for(var i = 0; i < pixArray.length; i++){
			pixArray[i].stop = false;
		}
	}else{
		clickCnt = 2;
	}
}


function getPix(){
	for( var i=0; i<imgHeight; i+=pixSize ){
		for( var j=0; j<imgWidth; j+=pixSize){
			 
			var index = (i * imgWidth + j) * 4;
			if(imgdata[index]<255) continue;
			color = "rgba(" + imgdata[index] + "," + imgdata[index + 1] 
				+ "," + imgdata[index + 2] + "," + imgdata[index + 3] + ")";
				var p = new pix(j,i,color);
				pixArray[pixArray.length] = p;
		}

	}
}

var pix = function(x,y,color){
	this.x = x;
	this.y = y;
	this.color = color;
	this.drawSelf = function(x,y){
		ctx.fillStyle = color;
		ctx.fillRect(this.x + x,this.y + y,pixSize,pixSize);
	}
	this.oldX = x;
	this.oldY = y;
	this.speed = Math.random()*3 + 6;
	this.speedX = Math.random()*20 - 10;
	this.speedY = Math.random()*20 - 10;
	this.stop = false;
	this.backSpeedX = 0;
	this.backSpeedY = 0;
};

function upData(){
	if(clickCnt == 1){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var i = 0; i < pixArray.length; i++){
			
			if(pixArray[i].x+pixImgX >= canvas.width || pixArray[i].x+pixImgX <= 0)
				pixArray[i].speedX = -pixArray[i].speedX;
			if(pixArray[i].y+pixImgY >= canvas.height || pixArray[i].y+pixImgY <= 0)
				pixArray[i].speedY = -pixArray[i].speedY;
			pixArray[i].x += pixArray[i].speedX;
			pixArray[i].y += pixArray[i].speedY;
			pixArray[i].drawSelf(pixImgX,pixImgY);
		}
	}else if(clickCnt == 2){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var i = 0; i < pixArray.length; i++){
			stop(pixArray[i]);
			if(pixArray[i].stop){
				pixArray[i].x = pixArray[i].oldX;
				pixArray[i].y = pixArray[i].oldY;
				pixArray[i].drawSelf(pixImgX,pixImgY);
			}else{
				var c = Math.sqrt((pixArray[i].y - pixArray[i].oldY) * (pixArray[i].y - pixArray[i].oldY)
					+ (pixArray[i].x - pixArray[i].oldX) * (pixArray[i].x - pixArray[i].oldX));
				var x = Math.abs(pixArray[i].x - pixArray[i].oldX);
				var y = Math.abs(pixArray[i].y - pixArray[i].oldY);
				var sin = x/c;
				var cos = y/c;
				if(x == 0){
					if ((pixArray[i].y - pixArray[i].oldY) > 0){
						pixArray[i].backSpeedY = -c*0.1;
					}else{
						pixArray[i].backSpeedY = c*0.1;
					}
				}else if(y == 0){
					if ((pixArray[i].x - pixArray[i].oldX) > 0){
						pixArray[i].backSpeedX = -c*0.1;
					}else{
						pixArray[i].backSpeedX = c*0.1;
					}
				}



				if(x != 0 && y != 0){
					if ((pixArray[i].x - pixArray[i].oldX) > 0){
						pixArray[i].backSpeedX = -(c*0.1*sin);
					}else{
						pixArray[i].backSpeedX = c*0.1*sin;
					}

					if ((pixArray[i].y - pixArray[i].oldY) > 0){
						pixArray[i].backSpeedY = -(c*0.1*(1/cos));
					}else{
						pixArray[i].backSpeedY = c*0.1*(1/cos);
					}
				}
				pixArray[i].x += pixArray[i].backSpeedX;
				pixArray[i].y += pixArray[i].backSpeedY;
				pixArray[i].drawSelf(pixImgX,pixImgY);
			}
		}
	}

}

function stop(p){
	if( (Math.abs(p.x - p.oldX) < 2) && (Math.abs(p.y - p.oldY) < 2)){
		p.stop = true;
	}
}
