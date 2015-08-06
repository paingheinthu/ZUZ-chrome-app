var app = angular.module('appMain', ['ngMaterial']).config( [
    '$compileProvider',
    function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);

        console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);
var mm_convert_text = '';
var autoSave = false;
app.controller('AppCtrl', function($scope, $mdDialog, $http) {
  $scope.programTitle = "ZUZ Convertor";
  $scope.profileImagePath = 'mualogo.png';
  $scope.toShow = 'convert';
  $scope.convertSwitch = {
    uni: "Unicode",
    zgy: "Zawgyi"
  };



  $scope.saveConverted = {
    saved : "false",
    unsaved : "true"
  };

  $scope.convertType = $scope.convertSwitch.uni;

  $scope.changeConvertType = function () {
    $scope.convertType = $scope.convertSwitch.uni;
  }

  $scope.changeAutoSave = function() {
    autoSave = $scope.saveConverted.saved;
  };

  $scope.clear = function() {
    $scope.mmText = '';
    mm_convert_text = '';
    $scope.convertType = $scope.convertSwitch.uni;
  };

  $scope.convert=function() {
    mm_convert_text = $scope.mmText;
    switch ($scope.convertSwitch.uni) {
      case 'Unicode':
        $scope.mmText = Z1_Uni(mm_convert_text);
        $scope.convertType = 'Zawgyi';
        break;
      case 'Zawgyi':
        $scope.mmText = Uni_Z1(mm_convert_text);
        $scope.convertType = 'Unicode';
        break;
      default:
    }

    if (autoSave=='true') {
      writeTextFile($scope.mmText);
      //writeFile('text.json','hello.txt');
      // var savedText = 'hello123';
      // var filename = "C:\\readText.json";
      // var blob = new Blob([savedText], {type: "text/plain;charset=utf-8"});
      // saveAs(blob, filename);
    }
  };

  $scope.alert = '';
  $scope.showCredit = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .title('Credit To')
        .content('ဤ Converter သည် ကိုငွေထွန်း၏ Paragu Converter ကိုအခြေခံ၍ ဖန်တီးထားခြင်းဖြစ်ပြီးမြန်မာ အိုင်တီပရို တွင်သုံးထားသည့်အတိုင်း ပြန်လည်ယူသုံးထားခြင်း ဖြစ်ပါသည်။ ပိုင်ဟိန်းသူ နှင့် ငြိမ်းချမ်း မှ ပြန်လည်ရေးဆွဲပါသည်။'+
      ' http://mrdba.info/unicode-converter/ မှကူးယူသုံးစွဲပါသည်။')
        .ariaLabel('Credit To')
        .ok('OK')
        .targetEvent(ev)
    );
  };

  $scope.alert = '';
  $scope.showAboutUs = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/aboutus.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    });
  };

  $http({
        url: 'js/history.json',
        dataType: 'json',
        method: 'GET',
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).success(function(response){
        $scope.names = response;
    }).error(function(error){
        $scope.names = 'error';
    });
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
}

function writeFile(filepath, output) {
	var txtFile = new File([filepath], {type: "text/plain;charset=utf-8"});
	txtFile.open("w"); //
	txtFile.writeln(output);
	txtFile.close();
}
