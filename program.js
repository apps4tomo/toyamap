$(function () {


window.onload = init();

  var map;

  function init() {

    //初期表示設定
    let lat = 36.701827; // 緯度
    let lon = 137.212626; // 経度
    let zoom = 11; // ズームレベル

    map = L.map("map");
    map.setView([lat, lon], zoom);


　　MAP_Select_Option();

    let flag=1;
     switch (flag) {
         case 0:

             break;

         default:
             getHTMLname(); 
　           File_csv="https://raw.githubusercontent.com/apps4tomo/toyamap/main/" + fname + ".csv";
　　　　　　 getCSV(); 
     }

　　file_CSV_read();
  }

   function getHTMLname(){
    　// ファイル名取得(*.html)
    　fname = window.location.href.split('/').pop();
    　fname = fname.replace(/\.[^/.]+$/, "")
    　//alert(fname);

   } 

   //CSVファイルを読み込む関数getCSV()の定義
   function getCSV(){
    　var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
      req.open("get", File_csv , true); // アクセスするファイルを指定
      req.send(null); // HTTPリクエストの発行
 
      // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
      req.onload = function(){
       　convertCSVtoArray2(req.responseText); // 渡されるのは読み込んだCSVデータ
      }
   } 

   //CSVファイルのテキストデータを配列resultに格納
   // 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
   function convertCSVtoArray2(str){ 
    　var result = []; 
    　var tmp = str.split("\n"); 

    　for(var i=0;i<tmp.length;++i){
       　result[i] = tmp[i].split(',');
	 if(i>0){
	    result[i][1] ='<a href="' + result[i][5]  + '" target="_blank" rel="noopener noreferrer">' + result[i][6]  + '</a>'
	 }
    　}

 　　 file_CSV_read2(result);

   } 

   function file_CSV_read2(result){

 　　 // CSVをtableで出力
 　　 var $result_body = $('#data_result tbody');

            var insert = '';
            for (var i = 0; i < result.length; i++) {
	      	if (i == 0){
                   insert += '<tr >';
                   for (var j = 0; j < result[i].length-5; j++) {
                      insert += '<th>' + result[i][j] + '</th>';
                   }
                   insert += '</tr>';
		}else{
                   insert += '<tr>';
                   for (var j = 0; j < result[i].length-5; j++) {
                      insert += '<td>' + result[i][j] + '</td>';
                   }
                   insert += '</tr>';
		}
            }

            $result_body.html(insert);

            //配列にある緯度・経度の地点をMAPに表示
　　　　　　positon_display(result);

   } 


   function MAP_Select_Option(){

    　//地理院地図の標準地図タイル（４つの地図スタイルから選択できるようにする）
      var gsi =L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
        {attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"});
      //地理院地図の淡色地図タイル
      var gsipale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        {attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>"});
      //オープンストリートマップのタイル
      var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
        {  attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });

      var osm2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {  attribution: "<a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });

　　　//それぞれのタイルレイヤの変数を、オブジェクトに設定する
      var baseMaps = {
        "地理院地図" : gsi,
        "淡色地図" : gsipale,
        "オープンストリートマップ"  : osm,
        "オープンストリートマップ2"  : osm2
      };

      L.control.layers(baseMaps).addTo(map);
      osm2.addTo(map);

   } 

   function file_CSV_read(){

     // 読込ファイル
     const file = document.getElementById('myfile');	

     //  FileReaderオブジェクトを生成
     const reader = new FileReader();
  
     // ファイルが選択されたらFileReaderオブジェクトにファイルをテキストとして保存
     file.addEventListener('change', function(e){
       reader.readAsText(e.target.files[0], "Shift_JIS");
     });

     // CSVをtableで出力
        var $result_body = $('#data_result tbody');

	reader.onload = function(event) {
            var lineArr = event.target.result.split("\r\n");   // 改行コード「\r\n」
            var itemArr = [];
            for (var i = 0; i < lineArr.length; i++) {
                itemArr[i] = lineArr[i].split(",");
		if(i>0){
		   itemArr[i][1] ='<a href="' + itemArr[i][5]  + '" target="_blank" rel="noopener noreferrer">' + itemArr[i][6]  + '</a>'
		}
            }

            var insert = '';
            for (var i = 0; i < itemArr.length; i++) {
	      	if (i == 0){
                   insert += '<tr >';
                   for (var j = 0; j < itemArr[i].length-5; j++) {
                      insert += '<th>' + itemArr[i][j] + '</th>';
                   }
                   insert += '</tr>';
		}else{
                   insert += '<tr>';
                   for (var j = 0; j < itemArr[i].length-5; j++) {
                      insert += '<td>' + itemArr[i][j] + '</td>';
                   }
                   insert += '</tr>';
		}
            }
            $result_body.html(insert);

            //配列にある緯度・経度の地点をMAPに表示
　　　　　　positon_display(itemArr);

        }
   } 


   //配列にある緯度・経度の地点をMAPに表示
   function positon_display(itemArr){

      for (var i = 1; i < itemArr.length; i++)  {

　　　   let no = itemArr[i][0];   // No
　　　   let lat2 = itemArr[i][4]; // 緯度
　　　   let lon2 = itemArr[i][3]; // 経度
　　　   let Marker_Name=itemArr[i][1]; // マーカー地点の名前

　　　   let photo_addres=itemArr[i][7]; // 写真元アドレス
　　　   var marker2 = L.marker([lat2, lon2],{title:Marker_Name}).addTo(map);

	 if (fname=="04_ManholeCard_MAP"){
　　　      marker2.bindPopup("<b><h5>" + no + "_" + Marker_Name + "</h5></b><br><img src=" + photo_addres + " width='150' height='225'>");
	 }else{
　　　      marker2.bindPopup("<b><h5>" + no + "_" + Marker_Name + "</h5></b><br><img src=" + photo_addres + " width='300' height='225'>");
	 }


      }

   } 


});

