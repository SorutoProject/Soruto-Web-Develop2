var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                       mode: null},
                      {matches: /(text|application)\/(x-)?vb(a|script)/i,
                       mode: "vbscript"}]
};
var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"),{
    lineNumbers: true,
    mode: "htmlmixed",
	theme: "monokai",
	lineWrapping: true,
	autoCloseTags: true,
    extraKeys: {
     "Ctrl-F": "findPersistent",
     "Ctrl-Space": "autocomplete"
    }

});
myCodeMirror.on("keyup", function (cm, event) {
        view();
    });
myCodeMirror.on("mousedown", function (cm, event) {
        cMenu();
    });
window.onload = function(){
	var arg = new Object;
	var pair=location.search.substring(1).split('&');
	for(var i=0;pair[i];i++) {
    var kv = pair[i].split('=');
    arg[kv[0]]=kv[1];
}
	var param = arg.f;
	if(param == "new"){
		fileOpen();
	}
	view();
	Screen();
/*var iframe = document.querySelector('iframe');

iframe.contentDocument.body.contentEditable = true;
iframe.contentDocument.designMode = 'on';
*/
//設定の適用
var config = localStorage.swdConfig.split(',');
	if(config[0] == "true"){autowrapdata = true;}
	else{autowrapdata=false;}
myCodeMirror.setOption("lineWrapping",autowrapdata);
var editorMain = document.getElementsByClassName('CodeMirror')[0];
editorMain.style.fontFamily = config[1];
editorMain.style.fontSize = config[2] + "pt";
//スタートセンターの起動
showStartCenter();

document.getElementById("submenu").style.display = "none";
document.getElementById("loader").style.display = "none";
}
window.onresize = function () {
    Screen();
}
window.onbeforeunload = function(e) {
      return 'このページから出ると、編集内容が失われますが、続行しますか?';
    };
function view(){
	myCodeMirror.save();
	var code = so.getVal("code");
	document.getElementById("view").contentWindow.document.body.innerHTML = code;
	var byn = encodeURI(code).replace(/%[0-9A-F]{2}/g, '*').length + 3;
	var krb = byn / 1000;
	document.getElementById("states").textContent = "> 文字数:" + code.length + "字 サイズ:" + byn + "Byte (" + krb + "KB)";
}
function viewMode(num){
	if(num==0){
		so.getId("code").style.width = "49.5%";
		document.getElementsByClassName("CodeMirror")[0].style.width = "50%";
		so.getId("view").style.width = "50%";
		so.display("view");
		so.display("code");
		view();
	}else if(num==1){
		so.getId("code").style.width = "99.5%";
		document.getElementsByClassName("CodeMirror")[0].style.width = "100%";
		so.displayNone("view");
		so.display("code");
	}
	else if(num==2){
		so.getId("view").style.width = "100%";
		so.display("view");
		so.displayNone("code");
		document.getElementsByClassName("CodeMirror")[0].style.display = "none";
	}
}
function menu(num){
	var sub = document.getElementById("submenu");
	//メニュー設定(class="submenulink"を指定したaタグはwidth:100%なので、<br>不要)
	if(num==0){
		sub.innerHTML='<a href="javascript:void(0);" onclick="newFile();" class="submenulink">新規作成</a><input type="text" id="filename" style="width:295px;background:#4c4c4c;color:#fefefe;" placeholder="ファイル名..." autocomplete="off" onkeyup="savefilename();"><br><a href="javascript:void(0);" onclick="fileDown();" class="submenulink">ダウンロード</a><a href="javascript:void(0);" onclick="fileOpen();" class="submenulink">ファイルを開く</a><a href="javascript:void(0);" onclick="saveLocal();" class="submenulink">ブラウザ(LocalStorage)に保存</a><a href="javascript:void(0);" onclick="loadLocal();" class="submenulink">ブラウザ(LocalStorage)から読み込み</a><a href="javascript:void(0);" class="submenulink" onclick="cMenu();">(メニューを閉じる)</a>';
		var filename = sessionStorage.filename;
		if(filename===undefined){}
		else{
			so.setVal("filename",filename);
		}
	}
	else if(num==1){
		sub.innerHTML='<a href="javascript:void(0)" onclick="newtab(0)" class="submenulink">新しいタブを開く</a><a href="javascript:void(0)" onclick="newtab(1)" class="submenulink">新しいタブでファイルを開く</a><a href="javascript:void(0);" class="submenulink" onclick="cMenu();">(メニューを閉じる)</a>';
	}
	else if(num==2){
		sub.innerHTML='<a href="javascript:void(0);" onclick="viewMode(0);cMenu();" class="submenulink">デュアルビューモード</a><a href="javascript:void(0);" onclick="viewMode(1);cMenu();" class="submenulink">ソース表示モード</a><a href="javascript:void(0);" onclick="viewMode(2);cMenu();" class="submenulink" style="border-bottom:#fefefe 2px solid;">ページ表示モード</a><a href="javascript:void(0)" onclick="pageview(\'reload\');" class="submenulink">ページ表示を更新</a><a href="javascript:void(0)" onclick="pageview(\'reset\');" class="submenulink" style="border-bottom:#fefefe 2px solid;">ページ表示をリセット(エラーが出たとき)</a><a href="javascript:void(0)" class="submenulink" onclick="showStartCenter();cMenu();">スタートセンターを開く</a><a href="javascript:void(0)" class="submenulink" onclick="showConfig();"><b>設定を開く</b></a><a href="javascript:void(0);" class="submenulink" onclick="cMenu();">(メニューを閉じる)</a>';
	}
	else if(num==3){
		sub.innerHTML='<a href="javascript:void(0);" onclick="changeLang(\'htmlmixed\',\'dv\')" class="submenulink">HTML</a><a href="javascript:void(0);" onclick="changeLang(\'javascript\',\'sv\')" class="submenulink">JavaScript</a><a href="javascript:void(0);" onclick="changeLang(\'css\',\'sv\')" class="submenulink">CSS</a><a href="javascript:void(0);" onclick="changeLang(\'php\',\'sv\')" class="submenulink">PHP</a><a href="javascript:void(0);" onclick="changeLang(\'xml\',\'sv\')" class="submenulink">XML</a><a href="javascript:void(0);" class="submenulink" onclick="cMenu();">(メニューを閉じる)</a>';
	}
	else if(num==4){
		sub.innerHTML='<a href="javascript:void(0);" onclick="so.modal.al(\'About\',\'<b>Soruto Web Develop</b><br><span style=font-size:10pt>Webブラウザで使えるオンラインIDE<br>Made with CodeMirror.<br>SourceCodeProフォントを使用しています。<br>(c)2018 Soruto Project</span>\');cMenu();" class="submenulink">このサイトについて</a><a href="https://github.com/SorutoProject/Soruto-Web-Develop/" target="_blank" class="submenulink">GitHub</a><a href="javascript:void(0);" class="submenulink" onclick="cMenu();">(メニューを閉じる)</a>';
	}
}
function sMenu(){
	var sub = document.getElementById("submenu");
	if(sub.style.display == "block"){
	sub.style.display = "none";
	}else{
		sub.style.display = "block";
	}
}
// ダウンロードしたいコンテンツ、MIMEType、ファイル名
function fileDown(){
myCodeMirror.save();
var content  = document.getElementById("code").value;
var mimeType = 'text/plain';
var name     = document.getElementById("filename").value;
if(name==""){
	so.modal.al("情報","ファイル名を入力してください");
	document.getElementById("filename").focus();
}else{
// BOMは文字化け対策
var bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
var blob = new Blob([bom, content], {type : mimeType});

var a = document.createElement('a');
a.download = name;
a.target   = '_blank';
a.id = "downloadlink";

if (window.navigator.msSaveBlob) {
  // for IE
  window.navigator.msSaveBlob(blob, name)
}
else if (window.URL && window.URL.createObjectURL) {
  // for Firefox
  a.href = window.URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
else if (window.webkitURL && window.webkitURL.createObject) {
  // for Chrome
  a.href = window.webkitURL.createObjectURL(blob);
  a.click();
}
else {
  // for Safari
  window.open('data:' + mimeType + ';base64,' + window.Base64.encode(content), '_blank');
}
cMenu();
}
}
function fileOpen(){
cMenu();
var diaso = '<b>ファイルを選択してください</b><br><span style="font-size:8pt;">※UTF-8でエンコードされていることを推奨します。</span><br><input type="file" id="selfile" accept=".html,.htm,.js,.css"><br><br><input type="button" onclick="so.modal.close();" value="閉じる">';
so.modal.custom(diaso);
var fo = document.getElementById("selfile");
fo.addEventListener("change",function(evt){
	so.modal.close();
	so.modal.custom("<br><br><br><center>読み込み中...</center>");
	so.getId("so-modal").style.cursor="wait";
  var file = evt.target.files;
  //FileReaderの作成
  var reader = new FileReader();
  //テキスト形式で読み込む
  reader.readAsText(file[0]);
  //読込終了後の処理
  reader.onload = function(ev){
    //テキストエリアに表示する
    myCodeMirror.setValue(reader.result);
	var fname = file[0].name;
	var fnamelower = fname.toLowerCase();
	document.title = fname + " - Soruto Web Develop";
	sessionStorage.filename =fname;
	if(fnamelower.lastIndexOf('.js')!=-1){changeLang('javascript','sv');}
	if(fnamelower.lastIndexOf('.htm')!=-1){changeLang('htmlmixed','dv');}
	if(fnamelower.lastIndexOf('.css')!=-1){changeLang('css','sv');}
	if(fnamelower.lastIndexOf('.php')!=-1){changeLang('php','sv');}
	so.modal.close();
	so.getId("so-modal").style.cursor="default";
	view();
  }
},false);
}
function saveLocal(){
	localStorage.savedata = myCodeMirror.getValue();
	cMenu();
	so.modal.al("完了","LocalStorageに上書き保存しました");
}
function loadLocal(){
	try{
	myCodeMirror.setValue(localStorage.savedata);
	cMenu();
	view();
	}catch(e){
		localStorage.savedata = "";
	}
}
function newFile(){
	cMenu();
	if(myCodeMirror.getValue()!=""){
		if(confirm("エディタに編集内容が残っています。\n新規作成すると削除されますがよろしいですか?")){
		myCodeMirror.setValue("");
		document.title="New - Soruto Web Develop";
		view();
		}
	}
}
function cMenu(){
	document.getElementById("submenu").style.display = "none";
}
function savefilename(){
	sessionStorage.filename = so.getVal("filename");
}
function newtab(num){
	if(num==0){
		var openurl = location.href.split("?");
		window.open(openurl[0],"_blank");
	}else if(num==1){
		var openurl = location.href.split("?");
		window.open(openurl[0] + "?f=new","_blank");
	}
cMenu();
}
function pageview(func){
	if(func == "reset"){
	document.getElementById("view").contentWindow.location.replace("about:blank");
	}else if(func == "reload"){
	view();	
	cMenu();
	}
}
function edit(){
	var code = document.getElementById("code");
    code.value = document.getElementById("view").contentWindow.document.body.innerHTML;
	var byn = encodeURI(code.value).replace(/%[0-9A-F]{2}/g, '*').length + 3;
	var krb = byn / 1000;
	document.getElementById("states").textContent = "> 文字数:" + so.getVal("code").length + "字 サイズ:" + byn + "Byte (" + krb + "KB)";
}
function Screen(){
	var size = document.documentElement.clientHeight - 60;
	so.getId("view").style.height= size + "px";
	so.getId("code").style.height= size + "px";
	document.getElementsByClassName("CodeMirror")[0].style.height = size + 2 + "px";
}
function changeLang(l,v){
		myCodeMirror.setOption("mode" , l);
		if(v == "sv"){viewMode(1);}
		else if(v == "dv"){viewMode(0);}
		cMenu();
}
function showConfig(){
	var screen = '<div style="position:absolute;top:0px;left:0px;background:#fefefe;"><b>設定</b>&nbsp;<input type="button" value="保存" onclick="saveConfig();">&nbsp;<input type="button" value="保存せず閉じる" onclick="so.modal.close();"></div><hr color="#c4c4c4"><b>自動改行の設定</b><br><label><input type="checkbox" id="configWrap">自動改行を有効にする</label><hr color="#c4c4c4"><b>フォントの設定</b><br>フォント名<br><input type="text" id="configFontFamily" style="width:270px;" placeholder="フォント名(例:メイリオ)"><br>フォントサイズ<br><input type="number" id="configFontSize" style="width:100px;">pt';
	so.modal.custom(screen);
	var nowconfig = localStorage.swdConfig.split(',');
	if(nowconfig[0] == "true"){autowrapdata = true;}
	else{autowrapdata=false;}
	document.getElementById("configWrap").checked = autowrapdata;
	document.getElementById('configFontFamily').value = nowconfig[1];
	document.getElementById('configFontSize').value = nowconfig[2];
	cMenu();
}
function saveConfig(){
	var configwrap = document.getElementById("configWrap").checked;
	var configfontfamily = document.getElementById('configFontFamily').value;
	var configfontsize = document.getElementById('configFontSize').value;
	localStorage.swdConfig = configwrap + "," + configfontfamily + "," + configfontsize;
	myCodeMirror.setOption("lineWrapping",configwrap);
	var editorMain = document.getElementsByClassName('CodeMirror')[0];
	editorMain.style.fontFamily = configfontfamily;
	editorMain.style.fontSize = configfontsize + "pt";
	so.modal.close();
}
function showStartCenter(){
	var startmenu = '<b>SWD</b> スタートセンター<a href="javascript:void(0)" onclick="so.modal.close();newFile()" class="submenulink">新規作成</a><a href="javascript:void(0)" onclick="so.modal.close();fileOpen();" class="submenulink">ファイルを開く</a><a href="javascript:void(0)" onclick="so.modal.close();loadLocal();" class="submenulink" >LocalStorageから読み込む</a><a href="javascript:void(0)" onclick="so.modal.close();showConfig()" class="submenulink" style="border-bottom:#a5a5a5 3px solid;">設定を開く</a><a href="javascript:void(0)" onclick="so.modal.close();" class="submenulink">スタートセンターを閉じる</a>';

	so.modal.custom(startmenu);
}