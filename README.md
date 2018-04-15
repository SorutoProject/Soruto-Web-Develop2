# Soruto-Web-Develop2
ウェブブラウザで動作する、ソースコードエディタ。 

[今すぐ試す](http://swdevelop.cf)

#### バージョン1からの変更点
本バージョンでは、以前まで使用していたACE Editorから乗り換え、 
CodeMirrorを使用しています。  
これにより、ACE Editorで発生する日本語フォントの文字化け、位置ずれなどが  
解消されました。

#### 対応ファイル形式(Ver.3.211現在)
* HTML
* JavaScript
* CSS
* PHP
* XML
* MarkDown

なお、HTML 及び MarkDown については、**ライブプレビュー機能**を搭載しています。  
ソースを編集しながら、ブラウザで表示したときの動作を確認できます。
#### 動作環境
本アプリは、HTML5で新たに追加されたLocalStorageを使用しているため、  
ブラウザが対応している必要があります。

なお、スマートフォンでの使用は想定しておりませんのでご了承ください。

動作確認済みのブラウザは以下のとおりです。
* Internet Explorer 11
* Microsoft Edge 最新版
* Google Chrome 及び Chromium 最新版
* Mozilla Firefox 最新版
* Opera 最新版
* Vivaldi 最新版
* PaleMoon 最新版

#### ローカル環境(サーバーにアップしない)で使用する場合の注意
ローカル環境で使用する場合は、XHRの制約上、XHRを使用しているテンプレート機能が、  
正しく動作しなくなります。(白いモーダルが表示される)

このエラーを防ぐには、jaディレクトリの中にある、index.htmlの5行目にある、  

` <a href="javascript:void(0);" onclick="template();" class="menulink">&nbsp;テンプレート&nbsp;</a> `  

を削除してください。これにより、テンプレート機能へのアクセスができなくなるため、  
エラーが起こらなくなります。
