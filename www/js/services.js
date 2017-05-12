angular.module('app.services', [])

.factory('SentenceService', function($cordovaSQLite, $q) {
  var curPracticeSentence = null;

 return {
    getCurPraticeSentences : function(){
        return this.curPracticeSentence;
    },
    setCurPracticeSentences : function(value){
       this.curPracticeSentence = value;
    },
    add: function(newSentence, video) {
      var d = $q.defer();
       $cordovaSQLite.execute(db, 'DELETE FROM Sentences WHERE sentence == ?', [JSON.stringify(newSentence)])
       $cordovaSQLite.execute(db, 'INSERT INTO Sentences (sentence, videoId, videoTitle, point) VALUES (?,?,?,?)', [JSON.stringify(newSentence), video.id, video.title, 0])
        .then(function(result) {
          d.resolve('success');
        }, function(error) {
          d.reject("error");
        });
      return d.promise;
    },
    updatePoint: function(sentence, point) {
      console.log(sentence.id + '- ' + point);
      var d = $q.defer();
       $cordovaSQLite.execute(db, 'UPDATE Sentences SET point = ? WHERE id == ?', [point,sentence.id])
        .then(function(result) {
          console.log(result);
          d.resolve('success');
        }, function(error) {
          console.log(error );
          d.reject("error");
        });
      return d.promise;
    },
    getAll: function() {
      var d = $q.defer();
       $cordovaSQLite.execute(db, 'SELECT * FROM Sentences ORDER BY id DESC')
      .then(function(res) {
            var lst = [];
            for(var i=0; i<res.rows.length; i++){
                lst.push(res.rows.item(i));
            } 
            d.resolve(lst);
        },function(error) {
            d.reject("error");
        }
      );
      return d.promise;
    },
    deleteItem: function(itemId) {
      var d = $q.defer();
       $cordovaSQLite.execute(db, 'DELETE FROM Sentences WHERE id == ?', [itemId])
      .then(function(result) {
          d.resolve('success');
        }, function(error) {
          d.reject("error");
        });
      return d.promise;
    },
    clearSentences: function(){
       var d = $q.defer();
        $cordovaSQLite.execute(db, 'DELETE FROM Sentences')
        .then(function(result) {
          d.resolve('success');
        }, function(error) {
          d.reject("error");
        });
      return d.promise;
     
    }
  };
});