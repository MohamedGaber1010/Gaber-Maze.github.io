


class settings{
	constructor(pathW , wallW , pathC , wallC , rowN , colN , canvas){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.pathW = parseInt(pathW);
		this.wallW = parseInt(wallW);
		this.pathC = pathC;
		this.wallC = wallC;
		this.colN = parseInt(colN);
		this.rowN = parseInt(rowN);
		this.setCanvasHeight();
		this.setCanvasWidth();
		this.canW = this.getCanvasWidth();
		this.canH = this.getCanvasHeight();
	}
	getPathWidth(){	return this.pathW;}
	getWallWidth(){	return this.wallW;}
	getPathColor(){	return this.pathC;}
	getWallColor(){	return this.wallC;}
	getColNum(){	return this.colN;}
	getRowNum(){	return this.rowN;}
	
	
	setCanvasHeight(){
		this.canvas.height = (this.pathW + this.wallW)*(this.rowN) - this.wallW;
	}
	setCanvasWidth(){
		this.canvas.width = (this.pathW + this.wallW)* (this.colN) - this.wallW;
	}
	getCanvasHeight(){ return this.canvas.height;}
	getCanvasWidth(){ return this.canvas.width; }
		
}

class levels{
	constructor(lev , canvas){
		this.canvas = canvas;
		if(lev == 'easy') this.easy();
		if(lev == 'normal') this.normal();
		if(lev == 'hard') this.hard();
	}
	setPathWidth(val){	 document.getElementById('pathWidth').value = val;}
	setWallWidth(val){	 document.getElementById("wallWidth").value = val;}
	setPathColor(val){	 document.getElementById("pathColor").value = val;}
	setWallColor(val){	 document.getElementById("wallColor").value = val;}
	setColNum(val){	 document.getElementById("colNum").value = val;}
	setRowNum(val){	 document.getElementById("rowNum").value = val;}
	
	getPathWidth(val){	return document.getElementById("pathWidth").value;}
	getWallWidth(val){	return document.getElementById("wallWidth").value;}
	getPathColor(val){	return document.getElementById("pathColor").value;}
	getWallColor(val){	return document.getElementById("wallColor").value;}
	getColNum(val){	return document.getElementById("colNum").value;}
	getRowNum(val){	return document.getElementById("rowNum").value;}
	

	easy(){
		this.setPathWidth('50');
		this.setWallWidth('2');
		this.setPathColor("#ecf3c7");
		this.setWallColor("#34495e");
		this.setColNum('10');
		this.setRowNum('10');
	}
	normal(){
		this.setPathWidth('40');
		this.setWallWidth('1');
		this.setPathColor("#ecf3c7");
		this.setWallColor("#34495e");
		this.setColNum('26');
		this.setRowNum('14');
	}
	hard(){
		this.setPathWidth('20');
		this.setWallWidth('1');
		this.setPathColor("#ecf3c7");
		this.setWallColor("#34495e");
		this.setColNum('50');
		this.setRowNum('50');
	}
	
	createSettingInstance(){
		return new settings(this.getPathWidth() , this.getWallWidth(), 
						    this.getPathColor() , this.getWallColor(),
						   	this.getRowNum() , this.getColNum() , this.canvas);
	}
	
}



class cell{
	constructor(id){
		this.id = id;
		this.s = 'blockCell';
	}
	changeState(){
		if(this.s == 'freeCell') this.s = 'blockCell';
		else this.s = 'freeCell';
	}
}
class wall{
	constructor(id,hv){
		this.id = id;
		this.hv = hv;
		this.s = 'blockWall';
	}
	changeState(){
		if(this.s == 'freeWall') this.s = 'blockWall';
		else this.s = 'freeWall';
	}
}




class grid{
	
	constructor(set){
		this.canvas = set.canvas;
		this.ctx = set.ctx;
		this.colN = parseInt(set.getColNum());
		this.rowN = parseInt(set.getRowNum());
		this.cellN = this.colN * this.rowN;
		this.pathW = parseInt(set.getPathWidth());
		this.wallW = parseInt(set.getWallWidth());
		this.allW = this.pathW + this.wallW;
		this.wallC = set.getWallColor();
		this.pathC = set.getPathColor();
		this.cellGrid = [];
		this.wallGrid = [];
		this.junction = [];
		this.initGrid();
		this.drawGrid();
		this.startImag = new Image();
		this.finishImage = new Image();
		
		this.lastId = -1;
		this.lastIdS = 'd';
		
	}
	
	getNewSet(set){
		this.canvas = set.canvas;
		this.ctx = set.ctx;
		this.pathW = parseInt(set.getPathWidth());
		this.wallW = parseInt(set.getWallWidth());
		this.allW = this.pathW + this.wallW;
		this.wallC = set.getWallColor();
		this.pathC = set.getPathColor();
		
		if(this.colN != parseInt(set.getColNum()) || this.rowN != parseInt(set.getRowNum()) ){
			this.colN = parseInt(set.getColNum());
			this.rowN = parseInt(set.getRowNum());
			this.cellN = this.colN * this.rowN;
			this.initGrid();
			carrotArr.clear() ;
		}
		this.drawGrid();
	}
	
	initGrid(){
		for(var i = 0 ; i < this.cellN ;i++){
				this.cellGrid[i] = new cell(i);
				this.wallGrid[i] = { h : new wall(i,'h') , v : new wall(i,'v')};
				this.junction[i] = 0;
		}
	}
	
	drawGrid(){
		for(var i = 0 ; i<this.cellN;i++){
			this.drawWall(i,'v');
			this.drawWall(i,'h');
			this.drawCell(i);
		}
	
	}
	
	blockGrid(){
		for(var i = 0 ; i < this.cellN ;i++){
				this.cellGrid[i].s = 'blockCell'; 
				this.wallGrid[i].h.s = 'blockWall';
				this.wallGrid[i].v.s = 'blockWall';
		}
		this.drawGrid();
	}
	
	freeGrid(){
		for(var i = 0 ; i < this.cellN ;i++){
				this.cellGrid[i].s = 'freeCell'; 
				this.wallGrid[i].h.s = 'freeWall';
				this.wallGrid[i].v.s = 'freeWall';
		}
		this.drawGrid();
	}
	
	
	
	checkJunc(id,hv){
		this.drawJunction(id);
		if(hv == 'h' && id>=this.colN ) this.drawJunction(id-this.colN);
		if(hv == 'v' && id%this.colN != 0) this.drawJunction(id-1);
	}
	
	drawCellVis(id){
		var y = Math.floor(id/this.colN);
		var x = id%this.colN;
		this.myRect(x*this.allW , y * this.allW , this.pathW , this.pathW , 'visite');
	}
	drawJunction(id){
		var c = 0 ; var color = 'freeWall';
		if(this.wallGrid[id].h.s == 'blockWall') c++;
		if(this.wallGrid[id].v.s == 'blockWall') c++;
		if(id+this.colN < this.cellN && this.wallGrid[id+this.colN].h.s == 'blockWall') c++;
		if((id+1)%this.colN != 0 && this.wallGrid[id+1].v.s == 'blockWall') c++;
		
		if(c>1) color = 'blockWall';
		
		var y = Math.floor(id/this.colN);
		var x = id%this.colN;
		this.myRect(x*this.allW+this.pathW , y * this.allW+this.pathW , this.wallW , this.wallW , color);
	}
	drawCell(id){
		var y = Math.floor(id/this.colN);
		var x = id%this.colN;
		this.myRect(x*this.allW , y * this.allW , this.pathW , this.pathW , this.cellGrid[id].s);
	}
	drawWall(id,hv){
		this.checkJunc(id,hv);
		var y = (Math.floor(id/this.colN))*this.allW;
		var x = (id%this.colN)*this.allW;
		var w , h , c;
		if(hv =='h') {
			x += this.pathW;
			w = this.wallW;
			h = this.pathW;
			c = this.wallGrid[id].h.s;
		}else {
			y += this.pathW;
			w = this.pathW;
			h = this.wallW;
			c = this.wallGrid[id].v.s;
		}
		this.myRect(x,y,w,h,c);
	}
	
	getColor(c){
		if(c == 'solution') return '#f1c40f';
		if(c == 'solAlgo') return "rgba(41, 128, 185,1)";
		if(c == 'visite') return '#0F0';
		
//		if(c == 'freeCell') return this.pathC;
//		if(c == 'freeWall') return this.pathC;
//		if(c == 'blockCell') return this.wallC;
//		if(c == 'blockWall') return this.wallC;
		
		if(c == 'freeCell') return "#ecf0f1";
		if(c == 'freeWall') return "#ecf3c7";
		if(c == 'blockCell') return "#34495e";
		if(c == 'blockWall') return "#2c3e50";
 	}
	myRect(x,y,w,h,c){
		this.ctx.fillStyle = this.getColor(c);
		this.ctx.beginPath();
		this.ctx.rect(x,y,w,h);
		this.ctx.closePath();
		this.ctx.fill();
	}
	
	
	
	getIdPos(x,y){
		var col = Math.floor(x/this.allW);
		var mCol = x%this.allW;
		var row = Math.floor(y/this.allW);
		var mRow = y%this.allW;
		var id = (row) * this.colN + col;
		var state ;
		
		if(mCol > this.pathW && mRow > this.pathW ) state ='d';
		if(mCol > this.pathW) {
			state = 'h';
		}else if(mRow>this.pathW){
			state ='v';
		}else {
			state = 'c';
		}
		
		if(this.lastId != id || this.lastIdS != state){
			this.lastId = id;
			this.lastIdS = state;
			
			if(state == 'h') {
				this.wallGrid[id].h.changeState();
				this.drawWall(id,'h');
			}else if(state == 'v'){
				this.wallGrid[id].v.changeState();
				this.drawWall(id,'v');
			}else if(state == 'c'){
				this.cellGrid[id].changeState();
				this.drawCell(id);
			}
		}
		
		if(carrotArr.has(id)) addCarrot(id);
		if(id == start) drawStart(id);
		if(id == end ) drawEnd(id);
		
	}
	
	//////////////// solution
	
	drawCellSol(id,c){
		var y = Math.floor(id/this.colN);
		var x = id%this.colN;
		this.myRect(x*this.allW , y * this.allW , this.pathW , this.pathW , c);
	}
	
	
	
}





// global

var canvas = document.getElementById('cn');
var ctx = canvas.getContext('2d');
var contain = document.getElementById('contain');
var lev = new levels('normal' , canvas );
var set = lev.createSettingInstance();	
var maze = new grid(set);
var animArr = [];
var stepsArr = [];
var carrotArr = new Set();
var an = null;

var dfsAlgo = document.getElementById('dfs');
var kruskalAlgo = document.getElementById('kruskal');
var primAlgo = document.getElementById('prim');
var backtrackAlgo = document.getElementById('backtrack');
var clearMaze = document.getElementById('clearMaze');

var bfsBut = document.getElementById('bfs');


var start = 0;
var end = maze.cellN-1;
var gameStart = 0;

var startGameBtn = document.getElementById('startGame');
var timeCounter = document.getElementById('timer');

var easyLev = document.getElementById('easy');
var normalLev = document.getElementById('normal');
var hardLev = document.getElementById('hard');
var createNew = document.getElementById('btnSet');
var pathWid = document.getElementById('pathWidth');
var wallWid = document.getElementById('wallWidth');
var wallCol = document.getElementById('wallColor');
var pathCol = document.getElementById('pathColor');

var headWord = document.getElementById('mid');
var points = document.getElementById('points');
var TimeVar = null;


var optimalSol = 0 ;
var optimalSolAll = 0 ;

//////////////////////////////////////////////////////////////////////////////
//animation


async function animation(){
	var cnt = 0 ;
	
	
	for(var i = 0  ;i<animArr.length;i++){
		if(animArr[i].type == 'c' || animArr[i].type =='solAlgo'){ 
			animArr.splice(i,0,{type:'cg',id: animArr[i].id});i++; 
		}
		if( start == animArr[i].id && (animArr[i].type == 'solAlgo' || animArr[i].type == 'solution')){ 
			animArr.splice(i+1,0,{type:'drawStart',id: animArr[i].id});i++; 
		}
		if((animArr[i].type == 'solAlgo' || animArr[i].type == 'solution') && end == animArr[i].id){ 
			animArr.splice(i+1,0,{type:'drawEnd',id: animArr[i].id});i++; 
		} if((animArr[i].type == 'solAlgo' || animArr[i].type == 'solution') && carrotArr.has(animArr[i].id)){ 
			animArr.splice(i+1,0,{type:'drawCarrot',id: animArr[i].id});i++; 
		}
		
		
		
	}
	an = requestAnimationFrame(fun);
	
	function fun(){	
		if(cnt >= animArr.length){
			cancelAnimationFrame(an);
			an = null;			
			return;
		}
		
		if(cnt>0 && animArr[cnt].type == 'solution' && animArr[cnt-1].type == 'solAlgo' ) {
			maze.drawGrid();
			drawStart(0);
			drawEnd(end);
			for (var item of carrotArr) addCarrot(item);
		}
		if(cnt == animArr.length) {
			for (var item of carrotArr) addCarrot(item);
		}
		
		if(animArr[cnt].type == 'solAlgo' || animArr[cnt].type == 'solution'  ) maze.drawCellSol(animArr[cnt].id , animArr[cnt].type);
		else if(animArr[cnt].type == 'c') maze.drawCell(animArr[cnt].id);
		else if(animArr[cnt].type == 'cg') maze.drawCellVis(animArr[cnt].id);
		else if(animArr[cnt].type == 'wh') maze.drawWall(animArr[cnt].id,'h');
		else if(animArr[cnt].type == 'wv') maze.drawWall(animArr[cnt].id,'v');
		else if(animArr[cnt].type == 'drawStart'){ drawStart(animArr[cnt].id);} 
		else if(animArr[cnt].type == 'drawEnd') drawEnd(animArr[cnt].id);
		else if(animArr[cnt].type == 'drawCarrot') addCarrot(animArr[cnt].id);
		else if(animArr[cnt].type == 'drawGrid'){
			maze.drawGrid();
			drawStart(0);
			drawEnd(end);
			for (var item of carrotArr) addCarrot(item);
		}
		
		
		
		cnt++;
		
		an = requestAnimationFrame(fun);
		
	}
	
}



///////////////////////////////////////////////////////////////////////////////
// created algorithms



// DFS




function dfs(id){
	maze.cellGrid[id].changeState();
	var i = id;
	animArr.push({type:'c',id:i});
	
	var free = [];
	if(id%maze.colN != 0 && maze.cellGrid[id-1].s == 'blockCell') free.push(id-1);
	if(id >= maze.colN && maze.cellGrid[id-maze.colN].s == 'blockCell') free.push(id-maze.colN);
	if((id+1)%maze.colN != 0 && maze.cellGrid[id+1].s == 'blockCell') free.push(id+1);
	if(id+maze.colN < maze.cellN && maze.cellGrid[id+maze.colN].s == 'blockCell') free.push(id+maze.colN);
	
	while(free.length>0){
		var ran = Math.floor(Math.random()*10000)%free.length;
		if(maze.cellGrid[free[ran]].s == 'blockCell') { 
			var mn = Math.min(id,free[ran]) ;
			var mx = Math.max(id,free[ran]); 
			if(mn+1==mx ) {
				maze.wallGrid[mn].h.changeState();
				animArr.push({type:'wh',id:mn});
			}else{
				maze.wallGrid[mn].v.changeState();
				animArr.push({type:'wv',id:mn});
			}
			dfs(free[ran]);
		}
		free.splice(ran,1);
	}
}



/////////////////////////////////////////////
// kruskal 

function kruskal(){
	var arr = [];
	var par = [];
	var rnk = [];
	
	for(var i = 0 ;i<maze.cellN;i++){
		par[i] = i;
		rnk[i] = 0;
		if((i+1)%maze.colN != 0 )arr.push({id:i,hv:'h'});
		if((i+maze.colN)<maze.cellN)arr.push({id:i,hv:'v'});
	}
	
	function getPar(x){ if(x == par[x]) return x; return par[x] = getPar(par[x]); }
	function link(x,y){
		if(rnk[x] < rnk[y]) { var swp = x ; x = y; y = swp;}
		par[y] = x;
		if(rnk[x] == rnk[y]) rnk[x]++;
	}
	function union(x,y , hv){
		var parx = getPar(x);
		var pary = getPar(y);
		if(parx != pary){
			link(parx,pary);
			
			if(maze.cellGrid[x].s == 'blockCell'){
				maze.cellGrid[x].changeState();
				//maze.drawCell(x);
				animArr.push({type:'c',id:x});
			}
			
			if(maze.cellGrid[y].s == 'blockCell'){
				maze.cellGrid[y].changeState();
				//maze.drawCell(y);
				animArr.push({type:'c',id:y});
			}
			if(hv == 'h'){
				maze.wallGrid[x].h.changeState();
				//maze.drawWall(x,'h');
				animArr.push({type:'wh',id:x});
			}else {
				maze.wallGrid[x].v.changeState();
				//maze.drawWall(x,'v');
				animArr.push({type:'wv',id:x});
			}
		}
		
	}
	function getRan(){return Math.floor(Math.random()*arr.length);}

	
	while(arr.length > 0){
		var ran = getRan();
		
		if(arr[ran].hv == 'h') union(arr[ran].id , arr[ran].id+1,'h');
		else union(arr[ran].id , arr[ran].id + maze.colN,'v');
		
		arr.splice(ran,1);
	}
	
	animation(animArr);
	
}


///////////////////////////////////////
//prim

function prim(start){
	var walls = [];
	
	function addWalls(id){
		if(id%maze.colN != 0 && maze.cellGrid[id-1].s == 'blockCell') 
			walls.push({i:id-1 ,vh:'h'});
		if(id >= maze.colN && maze.cellGrid[id-maze.colN].s == 'blockCell') 
			walls.push({i:id-maze.colN ,vh:'v'});
		if((id+1)%maze.colN != 0 && maze.cellGrid[id+1].s == 'blockCell') 
			walls.push({i:id ,vh:'h'});
		if(id+maze.colN < maze.cellN && maze.cellGrid[id+maze.colN].s == 'blockCell') 
			walls.push({i:id ,vh:'v'});
	}
	function changeCells(id,hv){
		if(hv == 'v'){
			var ok = 0 ;
			if(maze.cellGrid[id].s == 'blockCell'){
				maze.cellGrid[id].changeState();
				//maze.drawCell(id);
				animArr.push({type:'c',id:id});
				ok = 1;
			}
			if(maze.cellGrid[id+maze.colN].s == 'blockCell') {
				maze.cellGrid[id+maze.colN].changeState();
//				maze.drawCell(id+maze.colN);
				animArr.push({type:'c',id:id+maze.colN});
				ok = 1;
			}
			
			if(ok == 1){
				addWalls(id);
				addWalls(id+maze.colN);
				if(maze.wallGrid[id].v.s  == 'blockWall'){
					maze.wallGrid[id].v.changeState();
//					maze.drawWall(id,'v');
					animArr.push({type:'wv',id:id});
				}
				
			}
		}else {
			var ok = 0 ;
			if(maze.cellGrid[id].s == 'blockCell'){
				maze.cellGrid[id].changeState();
//				maze.drawCell(id);
				animArr.push({type:'c',id:id});
				ok = 1;
			}
			if(maze.cellGrid[id+1].s == 'blockCell') {
				maze.cellGrid[id+1].changeState();
//				maze.drawCell(id+1);
				animArr.push({type:'c',id:id+1});
				ok = 1;
			}
			if(ok == 1){
				addWalls(id);
				addWalls(id+1);
				if(maze.wallGrid[id].h.s  == 'blockWall'){
					maze.wallGrid[id].h.changeState();
//					maze.drawWall(id,'h');
					animArr.push({type:'wh',id:id});
				}
				
			}
			
		}
	}
	function getRan(){return Math.floor(Math.random()*walls.length);}

	
	addWalls(start);
	
	while(walls.length > 0){
		var ran = getRan();
		
		changeCells(walls[ran].i , walls[ran].vh);
		
		walls.splice(ran,1);
	}
	animation(animArr);
	
}


//////////////////////////
//backtracking

function backtrack(id){
	
	maze.cellGrid[id].changeState();
	animArr.push({type:'c',id:id});
	
	
	var free = [];
	if(id%maze.colN != 0 && maze.cellGrid[id-1].s == 'blockCell') free.push(id-1);
	if(id >= maze.colN && maze.cellGrid[id-maze.colN].s == 'blockCell') free.push(id-maze.colN);
	if((id+1)%maze.colN != 0 && maze.cellGrid[id+1].s == 'blockCell') free.push(id+1);
	if(id+maze.colN < maze.cellN && maze.cellGrid[id+maze.colN].s == 'blockCell') free.push(id+maze.colN);
	
	while(free.length>0){
		var ran = Math.floor(Math.random()*10000)%free.length;
		if(maze.cellGrid[free[ran]].s == 'blockCell') { 
			var mn = Math.min(id,free[ran]) ;
			var mx = Math.max(id,free[ran]); 
			if(mn+1==mx ) {
				maze.wallGrid[mn].h.changeState();
				animArr.push({type:'wh',id:mn});
			}else{
				maze.wallGrid[mn].v.changeState();
				animArr.push({type:'wv',id:mn});
			}
			
			backtrack(free[ran]);
			animArr.push({type:'c',id:id});
		}
		free.splice(ran,1);
	}
}



















//////////////////////////////////////////////////////////////////////////////
// canvas click events

function clickEvent(e){
	if(an != null || gameStart == 1) return;
	var borderWidth = parseInt(getComputedStyle(canvas,null).getPropertyValue('border-width'));
	var x = e.pageX - canvas.offsetLeft - borderWidth + contain.scrollLeft  ;
	var y = e.pageY - canvas.offsetTop - borderWidth + contain.scrollTop;
	if(x>0 && y > 0 )maze.getIdPos(x,y);
	
}
function click(e){
	if(an != null || gameStart == 1) return;
	canvas.onmousemove = clickEvent;
	clickEvent(e);
}
canvas.onmousedown = click;
canvas.onmouseup = function (e){if(an != null || gameStart == 1) return; canvas.onmousemove = null; maze.lastId = -1;}



// Create the maze algorthms






function startDfs(){
	animArr.length = 0 ;
	carrotArr.clear();
	dfs(Math.floor(Math.random()*10000)%maze.cellN);
	animation(animArr);
}
function startBacktrack(){
	animArr.length = 0 ;
	carrotArr.clear();
	backtrack(Math.floor(Math.random()*10000)%maze.cellN);
	animation(animArr);
}



//setTimeout(startDfs,100);

dfsAlgo.onclick = function (){
	if(an != null || gameStart == 1) return;
	if(an == null){
		maze.blockGrid();
		startDfs();
	}
	
}
kruskalAlgo.onclick = function (){
	if(an != null || gameStart == 1) return;
	if(an == null){
		animArr.length = 0 ;
		carrotArr.clear();
		maze.blockGrid();
		kruskal();
	}
}
primAlgo.onclick = function (){
	if(an != null || gameStart == 1) return;
	if(an == null){
		animArr.length = 0 ;
		carrotArr.clear();
		maze.blockGrid();
		prim(Math.floor(Math.random()*10000)%maze.cellN);
	}
}
backtrackAlgo.onclick = function (){
	if(an != null || gameStart == 1) return;
	if(an == null){
		maze.blockGrid();
		startBacktrack();
	}
	
}
///////////////////////////////////////////////////
//solve algo

function calcPoints(from , to){
	var ret = 0 ;
	if(carrotArr.has(to)) ret = -1;
	if(maze.cellGrid[to].s == 'blockCell') return ret + 5;
	var mn = Math.min(from,to);
	var mx = Math.max(from,to);
	
	if(mn + 1 == mx){
		if(maze.wallGrid[mn].h.s == 'blockWall') return ret+ 3;
	}else {
		if(maze.wallGrid[mn].v.s == 'blockWall') return ret+ 3;	
	}
	return ret + 1;
}







///////////////////////////////////////////////////////////////////// bfs 

function bfs(s , e){
	var q = [];
	var dist = [];
	var par = [];
	
	for(var i = 0 ;i<maze.cellN ; i++){
		dist[i] = 1000000007;
		par[i] = i;
	}
	
	function nei(id,ds){
		if(id - maze.colN >= 0 ){
			if(calcPoints(id,id-maze.colN) + ds < dist[id-maze.colN]){
				q.push(id-maze.colN); dist[id-maze.colN] = dist[id]+calcPoints(id,id-maze.colN);
				par[id-maze.colN] = id;
			}
		}
		
		
		if((id+1)%maze.colN != 0 ){
			if(calcPoints(id,id+1) + ds < dist[id+1]){
				q.push(id+1); dist[id+1] = dist[id]+calcPoints(id,id+1); 
				par[id+1] = id;
			}
		}
		
		
		if(id+maze.colN < maze.cellN ){
			if(calcPoints(id,id+maze.colN) + ds < dist[id+maze.colN]){
				q.push(id+maze.colN); dist[id+maze.colN] = dist[id]+calcPoints(id,id+maze.colN);
				par[id+maze.colN] = id;
			}
		}
		
		if(id%maze.colN != 0 ){
			if(calcPoints(id,id-1) + ds < dist[id-1]){
				q.push(id-1); dist[id-1] = dist[id]+calcPoints(id,id-1); 
				par[id-1] = id;
			}
		}
	}
	
	q.push(s);
	dist[s] = 0;
	
	while(q.length > 0){
		var v = q[0];
		q.shift();
		nei(v,dist[v]);
		animArr.push({type:'solAlgo',id:v});		
	}
	
	var i = e;
	animArr.push({type:'drawGrid',id:par[i]});
	animArr.push({type:'solution',id:i});
	while(par[i] != s){
		animArr.push({type:'solution',id:par[i]});
		i = par[i];
	}
	animArr.push({type:'solution',id:par[i]});
	optimalSol = dist[end];
//	points.innerHTML = dist[end];
	
	
}


bfsBut.onclick = function(e){
	if(an != null || gameStart == 1) return;
	animArr.length = 0 ;
	bfs(0,end);
	animation(animArr);
}


///////////////////////////////////////////////////////////////
//dijkstra


function dijkstra(s , e){
	var arr = [];
	var dist = [];
	var par = [];
	
	
	for(var i = 0 ;i<maze.cellN ; i++){
		dist[i] = 1000000007;
		par[i] = i;
	}
	
	function addToArr(x , xid){
		var l = -1,r = arr.length;
		var md;
		while(l+1<r){
			md = Math.floor((l + r)/2);  
			if(arr[md].d <= x ) l = md;
			else r = md;
		}
		arr.splice(r,0,{d:x , id : xid});
	}
	
	
	function nei(id,ds){
		if(id - maze.colN >= 0 ){
			if(calcPoints(id,id-maze.colN) + ds < dist[id-maze.colN]){
				dist[id-maze.colN] = dist[id]+calcPoints(id,id-maze.colN);
				addToArr(dist[id-maze.colN] , id-maze.colN);
				par[id-maze.colN] = id;
			}
		}
		
		
		if((id+1)%maze.colN != 0 ){
			if(calcPoints(id,id+1) + ds < dist[id+1]){
				dist[id+1] = dist[id]+calcPoints(id,id+1); 
				addToArr(dist[id+1] , id+1);
				par[id+1] = id;
			}
		}
		
		
		if(id+maze.colN < maze.cellN ){
			if(calcPoints(id,id+maze.colN) + ds < dist[id+maze.colN]){
				dist[id+maze.colN] = dist[id]+calcPoints(id,id+maze.colN);
				addToArr(dist[id+maze.colN] , id+maze.colN);
				par[id+maze.colN] = id;
			}
		}
		
		if(id%maze.colN != 0 ){
			if(calcPoints(id,id-1) + ds < dist[id-1]){
				dist[id-1] = dist[id]+calcPoints(id,id-1); 
				addToArr(dist[id-1] , id-1);
				par[id-1] = id;
			}
		}
	}
	
	arr.push({d:0,id:s});
	dist[s] = 0;
	
	while(arr.length > 0){
		var v = arr[0];
		arr.shift();
		
		nei(v.id,dist[v.id]);
		animArr.push({type:'solAlgo',id:v.id});		
	}
	
	var i = e;
	animArr.push({type:'drawGrid',id:par[i]});
	animArr.push({type:'solution',id:i});
	while(i != s){
		animArr.push({type:'solution',id:par[i]});
		i = par[i];
	}
	
	
}

var dijkstraBtn = document.getElementById('dijkstra');
dijkstraBtn.onclick = function(e){
	if(an != null || gameStart == 1) return;
	animArr.length = 0 ;
	dijkstra(0,end);
	animation();
}





///////////////////////////////////////////////////////////////////////// A* algo






function Astar(s , e){
	var arr = [];
	var dist = [];
	var par = [];
	
	bfs(0,end);
	animArr.length = 0 ;
	
	for(var i = 0 ;i<maze.cellN ; i++){
		dist[i] = 1000000007;
		par[i] = i;
	}
	
	function addToArr(x , xid){
		var l = -1,r = arr.length;
		var md;
		while(l+1<r){
			md = Math.floor((l + r)/2);  
			if(arr[md].d < x ) l = md;
			else if(arr[md].d == x){
				if(arr[md].id < xid) l = md;
				else r = md;
			}
			else r = md;
		}
		arr.splice(r,0,{d:x , id : xid});
	}
	
	function estimateValue(from , to){
//		var row , col;
//		col = from%maze.colN;
//		row = Math.floor(from/maze.colN);
//		return maze.colN - col - 1 + maze.rowN - row - 1;
		
		var x1,y1,x2,y2;
		x1 = (from % maze.colN) * maze.allW;
		y1 = Math.floor(from/maze.colN) * maze.allW;
		
		x2 = (to % maze.colN) * maze.allW;
		y2 = Math.floor(to/maze.colN) * maze.allW;
		
		return Math.floor( Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2) ) );
	}
	
	
	function nei(id,ds){
		if(id - maze.colN >= 0 ){
			if(calcPoints(id,id-maze.colN) + ds < dist[id-maze.colN]){
				dist[id-maze.colN] = dist[id]+calcPoints(id,id-maze.colN);
				addToArr(dist[id-maze.colN] + estimateValue(id-maze.colN,end) , id-maze.colN);
				par[id-maze.colN] = id;
			}
		}
		
		
		if((id+1)%maze.colN != 0 ){
			if(calcPoints(id,id+1) + ds < dist[id+1]){
				dist[id+1] = dist[id]+calcPoints(id,id+1); 
				addToArr(dist[id+1]+ estimateValue(id+1,end) , id+1);
				par[id+1] = id;
			}
		}
		
		
		if(id+maze.colN < maze.cellN ){
			if(calcPoints(id,id+maze.colN) + ds < dist[id+maze.colN]){
				dist[id+maze.colN] = dist[id]+calcPoints(id,id+maze.colN);
				addToArr(dist[id+maze.colN]+ estimateValue(id+maze.colN,end) , id+maze.colN);
				par[id+maze.colN] = id;
			}
		}
		
		if(id%maze.colN != 0 ){
			if(calcPoints(id,id-1) + ds < dist[id-1]){
				dist[id-1] = dist[id]+calcPoints(id,id-1); 
				addToArr(dist[id-1] + estimateValue(id-1,end), id-1);
				par[id-1] = id;
			}
		}
	}
	
	arr.push({d:0,id:s});
	dist[s] = 0;
	
	while(arr.length > 0){
		if(dist[end] == optimalSol) break;
		
		var v = arr[0];
		arr.shift();
		
		nei(v.id,dist[v.id]);
		animArr.push({type:'solAlgo',id:v.id});		
	}
	
	console.log(optimalSol , dist[end]);
	
	var i = e;
	animArr.push({type:'drawGrid',id:par[i]});
	animArr.push({type:'solution',id:i});
	while(i != s){
		animArr.push({type:'solution',id:par[i]});
		i = par[i];
	}
	
}

var AstarBtn = document.getElementById('Astar');
AstarBtn.onclick = function(e){
	if(an != null || gameStart == 1) return;
	animArr.length = 0 ;
	Astar(0,end);
	animation();
}



/////////////////////////////////////////////////////////////////////////// all carrots


function collectAll(s,e){
	
	var dp = [];
	var g = [];
	var t = [];
	var path = [];
	var finalSol = [];
	
	var carrotN = carrotArr.size;
	
	for(var i = 0 ; i < maze.cellN;i++){
		dp[i] = []; g[i] = []; 
		for(var j = 0;j<maze.cellN;j++){
			dp[i][j] = 1000000007;
			if(i == j) dp[i][j] = 0;
		}
	}
	for(var i = 0 ;i<maze.cellN ;i++){
		if(i%maze.colN != 0) dp[i][i-1] = calcPoints(i,i-1);
		if((i+1)%maze.colN != 0) dp[i][i+1] = calcPoints(i,i+1);
		if(i - maze.colN >= 0) dp[i][i-maze.colN] = calcPoints(i,i-maze.colN);
		if(i + maze.colN < maze.cellN) dp[i][i+maze.colN] = calcPoints(i,i+maze.colN);
	}
	
	for(var k = 0 ; k<maze.cellN;k++){
		for(var i = 0 ;i<maze.cellN;i++){
			for(var j = 0 ;j<maze.cellN;j++){
				dp[i][j] = Math.min(dp[i][j] , dp[i][k] + dp[k][j]);
			}
		}
	}
	
	var cnt = 1 ; t[0] = 0; 
	for (var i of carrotArr){
		t[cnt] = parseInt(i); cnt++;
	}
	t[cnt] = e;
	
	
	cnt = 0 ;
	for (var i of carrotArr){
		cnt++;
		g[0].push(cnt);
		var cnt2 = 0;
		for (var j of carrotArr){
			cnt2++;
			if(cnt != cnt2){
				g[cnt].push(cnt2);
			}
		}
		g[cnt].push(carrotN+1);
	}
	g[0].push(carrotN+1);
	
	
	var optimal = 1000000007;
	
	
	function finishPath(){
		animArr.length = 0 ;
		
		function carrotBFS(startNode , endNode){
			var q = [];
			var dist = [];
			var par = [];

			for(var i = 0 ;i<maze.cellN ; i++){
				dist[i] = 1000000007;
				par[i] = i;
			}

			function nei(id,ds){
				if(id - maze.colN >= 0 ){
					if(calcPoints(id,id-maze.colN) + ds < dist[id-maze.colN]){
						q.push(id-maze.colN); dist[id-maze.colN] = dist[id]+calcPoints(id,id-maze.colN);
						par[id-maze.colN] = id;
					}
				}


				if((id+1)%maze.colN != 0 ){
					if(calcPoints(id,id+1) + ds < dist[id+1]){
						q.push(id+1); dist[id+1] = dist[id]+calcPoints(id,id+1); 
						par[id+1] = id;
					}
				}


				if(id+maze.colN < maze.cellN ){
					if(calcPoints(id,id+maze.colN) + ds < dist[id+maze.colN]){
						q.push(id+maze.colN); dist[id+maze.colN] = dist[id]+calcPoints(id,id+maze.colN);
						par[id+maze.colN] = id;
					}
				}

				if(id%maze.colN != 0 ){
					if(calcPoints(id,id-1) + ds < dist[id-1]){
						q.push(id-1); dist[id-1] = dist[id]+calcPoints(id,id-1); 
						par[id-1] = id;
					}
				}
			}

			q.push(startNode);
			dist[startNode] = 0;

			while(q.length > 0){
				var v = q[0];
				q.shift();
				nei(v,dist[v]);
				animArr.push({type:'solAlgo',id:v});	
				if(v == endNode && dist[endNode] == dp[startNode][endNode]) break;
			}
			
			var i = endNode;
			var finArr = [];
			animArr.push({type:'drawGrid',id:i});
			
			finArr.push({type:'solution',id:i});
			while(par[i] != startNode){
				finArr.push({type:'solution',id:par[i]});
				i = par[i];
			}
			finArr.push({type:'solution',id:par[i]});
			finArr.reverse();
			for(var i = 0 ; i< finArr.length ;i++) finalSol.push(finArr[i]);

		}
		
		for(var i = 0 ;i<path.length-1;i++){
			carrotBFS(path[i],path[i+1]);
		}
		for(var i = 0 ; i< finalSol.length ;i++) animArr.push(finalSol[i]);
	}
	
	function minSpanTree(){
		var vis = [];
		for(var i = 0 ; i< carrotN+2;i++) vis[i] = 0;
		nextNode(0);
		function nextNode(x){
			if(t[x] == e){
				path.push(e); return;
			}
			vis[x] = 1;
			path.push(t[x]); var nx = -1;
			for(var i = 0 ;i<g[x].length;i++){
				var v = g[x][i];
				if(vis[v] == 0){
					if(nx == -1) nx = v;
					else {
						if(v != carrotN+1 && dp[t[x]][t[v]] < dp[t[x]][t[nx]]) nx = v;
					}
				}
			}
			nextNode(nx);
			return;
		}
	}
	
	function solveBFS(){
		console.log('solve BFS Graph');
		var que = [];
//		var vis = [];
		var parN = [];
		for(var i = 0 ;i< (1<<carrotN+2) ;i++) parN[i] = i;
		
//		for(var i = 0 ;i < carrotN+2 ;i++){	
//			vis[i] = [];
//			for(var j = 0 ; j<(1<<carrotN+2);j++) vis[i][j] = 0 ;
//		}
		
		que.push({v:0,d:0,allV:1 ,prevN : 0 });
//		vis[0][1] = 1;
		
		function addToQue(node , s , prev, dist){
			
			var l = -1 , r = que.length , md;
			while(l+1<r){
				md = Math.floor((l+r)/2);
				if(que[md].d < dist) l = md;
				else r = md;
			}
			que.splice(r,0,{v:node , d: dist , allV : s , prevN : prev});
			
		}
		
		
		
		
		
		
		
		function makeParN(cntlast){
			
			var visPar = [];
			for(var i = 0 ; i< carrotN+3;i++) visPar[i] = 0;
			createPath(cnt);
			function createPath(x){
				if(x == 0){
					path.push(0);
					visPar[0] = 1;
					return;
				}
				createPath(que[x].prevN);
				for(var i = 0 ;i<carrotN+2 ;i++){
					if(visPar[i] == 0 && ((que[x].allV>>i)&1 )== 1){
						path.push(t[i]);
						visPar[i] = 1;
						return;
					}
				}
			}
			
		}
		
		var cnt = 0 ;
		var finish = 0;
		while(cnt < que.length){
			if(finish == 1) break;
			var sz = que.length;
			
			
			while(cnt<sz){
				
				var node = que[cnt].v;
				var dist = que[cnt].d;
				var state = que[cnt].allV;

				if(node == carrotN+1 && state == (1<<carrotN+2)-1){
					finish = 1;
//					console.log('ans : ', dist);
//					console.log('final cnt : ', cnt , que.length);
					makeParN(cnt);
//					console.log('the Path :' , path);
					break;
				}


				for(var j = 0 ; j< g[node].length;j++ ){
					var nextNode = g[node][j];

					if((state>>nextNode) & 1 ) continue;

					var nextState = (state | (1<<nextNode));

//					if(vis[nextNode][nextState]) continue;

					if(node == carrotN+1 && state != (1<<carrotN+1)-1) continue;

//					vis[nextNode][nextState] = 1;
					addToQue(nextNode , nextState , cnt , dist + dp[t[node]][t[nextNode]]);

				}
				cnt++;
				
			}
			
		}
		
		
//		
//		
//		function makeParN(){
//			
//			var visPar = [];
//			for(var i = 0 ; i< carrotN+3;i++) visPar[i] = 0;
//			
//			createPath((1<<carrotN+2)-1);
//			function createPath(x){
//				if(x == 1){
//					path.push(0);
//					visPar[0] = 1;
//					return;
//				}
//				createPath(parN[x]);
//				for(var i = 0 ;i<carrotN+2 ;i++){
//					if(visPar[i] == 0 && ((x>>i)&1 )== 1) {
//						path.push(t[i]);
//						visPar[i] = 1;
//						return;
//					}
//				}
//				return;
//			}
//		}
//		
//		
//		
//		while(que.length>0){
//			var sz = que.length;
//			var finish = 0 ;
//			
//			for(var i = 0;i<sz;i++){
//				var node = que[0].v;
//				var dist = que[0].d;
//				var state = que[0].allV;
//				var prevState = que[0].prevN;
////				vis[node][state] = 1;
//				que.shift();
//				
//				if(parN[state] == state) parN[state] = prevState;
//				
//				if(node == carrotN+1 && state == (1<<carrotN+2)-1){
//					finish = 1;
//					console.log('ans : ',dist);
//					makeParN();
//					console.log('the Path :' , path);
//					
//					break;
//				}
//				
//				for(var j = 0 ; j< g[node].length;j++ ){
//					var nextNode = g[node][j];
//					
//					if((state>>nextNode) & 1 ) continue;
//					
//					var nextState = (state | (1<<nextNode));
//					
////					if(vis[nextNode][nextState]) continue;
//					
////					if(node == carrotN+1 && state != (1<<carrotN+1)-1) continue;
//					
////					vis[nextNode][nextState] = 1;
//					addToQue(nextNode , nextState , state , dist + dp[t[node]][t[nextNode]]);
//					
//				}
//			}
//			if(finish == 1) break;
//		}
//		
		

		
	}
	if(carrotN < 9) solveBFS();
	else  minSpanTree();
	
	finishPath();
	
	
}

var collectAllBtn = document.getElementById('collectAll');
collectAllBtn.onclick = function(e){
	if(an != null || gameStart == 1) return;
	animArr.length = 0 ;
	collectAll(0,end);
	animation();
}



///////////////////////////////////////////////////////////////////////////
// the game




function drawImg(img,id){
	var y = Math.floor(id/maze.colN);
	var x = id%maze.colN;
	var md = maze.pathW/4;
	img.onload = function(){
		maze.ctx.drawImage(img,x*maze.allW + md,y*maze.allW + md,md*2,md*2);
	}
}
function drawStart(id){
	var startImg = new Image();
	startImg.src = "js/rabbit.png";
	drawImg(startImg,id);
}
function drawEnd(id){
	var endImg = new Image();
	endImg.src = "js/finish.png";
	drawImg(endImg,id);
}
function addCarrot(id){
	var carrotImg = new Image();
	carrotImg.src = "js/carrots.png";
	drawImg(carrotImg,id);
}

	
function setStartEnd(){
	
//	var pos = [0,maze.cellN - maze.colN];
//	var ran = Math.floor(Math.random()*pos.length);
//	start = pos[ran]; 
//	pos = [maze.cellN-1,maze.colN-1];
//	ran = Math.floor(Math.random()*pos.length);
//	end = pos[ran];	
	start = 0;
	drawEnd(end);
	drawStart(start);
}


	
function newGame(){
	maze.blockGrid();
	maze.drawGrid();
	startDfs();
}



function changeHeader(type){
	
	headWord.style.color = '#e74c3c';
	
	if(type == 'timeOut') 	headWord.innerHTML = 'Time out,You lose';
	else if(type == 'pointsOut') 	headWord.innerHTML = 'Your Points is over';
	else if(type == 'cong') { 
		headWord.style.color ='#2ecc71';	
		headWord.innerHTML = 'Congratulation,You won'; 
	}
	else{
		headWord.style.color = '#f3f3f3';
		headWord.innerHTML = 'Solve Your Maze';
	}
}
function setPoints(x) { points.innerHTML ='points : '+ x;}


function finishGame(type){
	gameStart = 0;
	clearInterval(TimeVar);
	TimeVar = null;
	carrotArr.clear() ;
	changeHeader(type);
	setTimeout(changeHeader,5000,'sadf');
	
	if(type == 'cong') animation();
	
}


function startGame(){
	if(an != null || gameStart == 1) return;
	maze.drawGrid();
	for(var i of carrotArr) addCarrot(i);
	gameStart = 1;
	animArr.length = 0;
	stepsArr.length = 0;
	maze.drawCell(end);
	setStartEnd();
	var gameTime = 60*5;
	
	function startTime(){

		var mnt = Math.floor(gameTime/60);
		var sec = gameTime%60;
		if(mnt<10) mnt = "0" + mnt;
		if(sec<10) sec = "0" + sec;
		timeCounter.innerHTML = mnt + ':' + sec;
		if(gameTime == 0) finishGame('timeOut');
		gameTime--;
	}
	TimeVar = setInterval(startTime,1000);
	
	bfs(start,end);
	animArr.length = 0;
	setPoints(optimalSol);
	
}










//////////////////////////////////////////////

startGameBtn.onclick = startGame;





//////////////////////////////////////////////////
//clear maze

clearMaze.onclick = function(){	if(an != null || gameStart == 1) return; if(an == null) maze.freeGrid();}


///////////////////////////////////////////////////////////////////////////////////////////////////////
// setttings 


easyLev.onclick = function(){
	if(an != null || gameStart == 1) return;
	lev.easy();
	set = lev.createSettingInstance();
	maze.getNewSet(set);
	end = maze.cellN-1;
}

normalLev.onclick = function(){
	if(an != null || gameStart == 1) return;
	lev.normal();
	set = lev.createSettingInstance();
	maze.getNewSet(set);
	end = maze.cellN-1;
}

hardLev.onclick = function(){
	if(an != null || gameStart == 1) return;
	lev.hard();
	set = lev.createSettingInstance();
	maze.getNewSet(set);
	end = maze.cellN-1;
}


onkeyup = function(e){
	if(an == null && gameStart == 1){
		
		if(e.code == 'ArrowLeft') {
			if(start%maze.colN != 0){
				maze.drawCell(start);
				
				optimalSol -= calcPoints(start,start-1);
				setPoints(optimalSol);
				
				start-=1;
				drawStart(start);
				animArr.push({type:'solution',id:start});
				
			}
		}
		else if(e.code == 'ArrowRight') {
			if((start+1)%maze.colN != 0){
				maze.drawCell(start);
				
				optimalSol -= calcPoints(start,start+1);
				setPoints(optimalSol);
				
				start+=1;
				drawStart(start);
				animArr.push({type:'solution',id:start});
			}
		}
		else if(e.code == 'ArrowDown') {
			if(start+maze.colN < maze.cellN){
				maze.drawCell(start);
				optimalSol -= calcPoints(start,start+maze.colN);
				setPoints(optimalSol);
				
				start+=maze.colN;
				drawStart(start);
				animArr.push({type:'solution',id:start});
			}
		}
			
		else if(e.code == 'ArrowUp'){
			if(start>=maze.colN ){
				maze.drawCell(start);
				optimalSol -= calcPoints(start,start-maze.colN);
				setPoints(optimalSol);
				start-=maze.colN;
				drawStart(start);
				animArr.push({type:'solution',id:start});
			}
		}
		if(carrotArr.has(start)){
			optimalSol+= 7;
			carrotArr.delete(start);
		} 
		
		if(start == end && optimalSol >= 0){
			finishGame("cong");
		}
		else if(optimalSol <= 0) {
			finishGame('pointsOut');
			optimalSol = 0;
			setPoints(optimalSol);
		}
		
		
	}
	
}

function isValidHex(color) {
    if(!color || typeof color !== 'string') return false;

    // Validate hex values
    if(color.substring(0, 1) === '#') color = color.substring(1);

    switch(color.length) {
      case 3: return /^[0-9A-F]{3}$/i.test(color);
      case 6: return /^[0-9A-F]{6}$/i.test(color);
      case 8: return /^[0-9A-F]{8}$/i.test(color);
      default: return false;
    }

    return false;
}

function changeSet(){
	if(an != null || gameStart == 1) return;
	
//	if((/^#([0-9A-F]{3}){1,2}$/i.test(pathCol.value) != 1)) return;
//	if((/^#([0-9A-F]{3}){1,2}$/i.test(wallCol.value) != 1)) return;
	
	if(isValidHex(pathCol.value) == false ) return;
	if(isValidHex(wallCol.value) == false ) return;
	
	set = lev.createSettingInstance();
	maze.getNewSet(set);
	end = maze.cellN-1;
}


createNew.onclick = changeSet;
pathCol.onkeyup = changeSet;
pathWid.onkeyup = changeSet;
wallCol.onkeyup = changeSet;
wallWid.onkeyup = changeSet;







/////////////////////////////////////////////////////////////////// add carrot

var carrotBtn = document.getElementById('addCarrot');


function onCanvas(x,y){
	var borderWidth = parseInt(getComputedStyle(canvas,null).getPropertyValue('border-width'));

	if(x > canvas.offsetLeft+borderWidth && x < canvas.offsetLeft+borderWidth + canvas.width &&
		y > canvas.offsetTop+borderWidth && y < canvas.offsetTop+borderWidth + canvas.height )
		return true;
		return false; 
}

carrotBtn.onmousedown = function(e){
	if(an != null || gameStart == 1) return;
	
	var carrotImg = new Image();
	carrotImg.src = 'js/carrots.png';
	
	document.body.append(carrotImg);
	carrotImg.style.position = 'absolute';
	carrotImg.style.height = '20px';
	carrotImg.style.zIndex = 1000;
	
	function moveAt(pageX,pageY){
		carrotImg.style.left = pageX - carrotImg.offsetWidth/2 + 'px';
		carrotImg.style.top = pageY - carrotImg.offsetHeight/2 + 'px';
	}
	
	moveAt(e.pageX,e.pageY);

	function onMouseMove(e){
		moveAt(e.pageX,e.pageY);
	}

	document.addEventListener('mousemove',onMouseMove);

	carrotImg.onmouseup = function(ev){

		document.removeEventListener('mousemove',onMouseMove);
		carrotImg.style.display = 'none';
		carrotImg.remove();

		if(onCanvas(ev.pageX,ev.pageY)) {
			
			var borderWidth = parseInt(getComputedStyle(canvas,null).getPropertyValue('border-width'));
			var x = ev.pageX - canvas.offsetLeft - borderWidth + contain.scrollLeft;
			var y = ev.pageY - canvas.offsetTop - borderWidth + contain.scrollTop;
			if(x>0 && y > 0 ){
				var col = Math.floor(x/maze.allW);
				var row = Math.floor(y/maze.allW);
				var id = row*maze.colN + col;
				
				if(id != start && id != end ) 
				{	addCarrot(id);
					carrotArr.add(id);
				}
			}	
		}
		carrotBtn.onmouseup = null;

	}

	carrotImg.ondragstart = function() {
		return false;
	};
	
};







