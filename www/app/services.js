angular.module('app.services', [])
.factory('streamService', function($http, $q){

    var streamUrl = 'http://icecast.24hourkirtan.fm:8000/128k.mp3';
    var metadataUrl = 'http://icecast.24hourkirtan.fm:8000/status-json.xsl';
    var contentRegex = /<body>(.*)<\/body>/;
    var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
    var resolutionRegex = /100x100/;

    var service = {
      getStreamInfo: getStreamInfo
    };
    return service;
    // ***************************************************************************
    function getStreamInfo() {
      return $http.get(metadataUrl).then(function(response) {
        console.log(response);
        return response.data.icestats.source[0];
      });
    }

    function getCover(title) {
      return $http.get(itunesSearchUrl + title).then(function(response) {
        var item = response.data.results[0];
        if (!item || !item.artworkUrl100) {
          return null;
        }
        return item.artworkUrl100.replace(resolutionRegex, '500x500');
      });
    }

    function parseShoutcastResponse(html) {
      var content = html.match(contentRegex)[1];
      var parts = content.split(',');
      if (parts.length < 7 || !parts[6]) {
        return null;
      }
      return parts[6];
    }
})
.factory('AudioFactory',
  function($q, $rootScope){
  
  var media;
  var state = {
    playing: false,
    volume: 100
  };

  return {
    init: function(path) {
      var cb = {
        success: function(){
          console.log("playAudio():Audio Success");
        },
        error: function(err){
          console.log("playAudio():Audio Error: "+ err.code);
        },
        status: function(status){
          $rootScope.$broadcast("status", status);
        }
      };

      this.stop();

      if(ionic.Platform.isIOS() && window.Stream)
        media = new window.Stream(path, cb.success, cb.error, cb.status);
      else if(Media)
       media = new Media(path, cb.success, cb.error, cb.status);
    },
    play: function(){
      if(media)
        media.play();
      state.playing = true;
    },
    stop: function() {
      if(media){
        media.stop();
        /*
        if(ionic.Platform.isAndroid())
          media.release();
        */
        $rootScope.$broadcast('stopped');
      }
    },
    pause: function() {
      state.playing = false;
      if(media) 
        media.pause();
    },
    seekTo: function(milliseconds){
      if(media)
        media.seekTo(milliseconds);
    }
  };
})
.factory('localStorage',  function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            delete $window.localStorage[key];
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        setTiedObject: function (key, value) {
            var obj = this.getObject(key) || {};
            var apiKey = this.get('api_key');
            obj[apiKey] = value;
            this.setObject(key, obj);
        },
        getTiedObject: function (key, value) {
            var obj = this.getObject(key) || {};
            return obj[value];
        }
    }
});