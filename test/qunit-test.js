/**
 * Some client-side unit tests for Chrome-specific APIs.
 */

asyncTest( "Instantiation", 3, function() {
  
	var myScore = new Scoreboard({
		classes : ['myTestDifficulty'],
		fields : {
			trout : {type:'average'}
		}
	});

	myScore.load(function(){

		// Make sure the field is there.
		ok('object' == typeof myScore.data.myTestDifficulty.trout,'Object instantiates');
		
		ok('undefined' == typeof myScore.data.myTestDifficulty.time, "Make sure defaults aren't used when we define our own");
		ok('undefined' ==typeof myScore.data.regular, "Make sure defaults aren't used when we define our own");
		
		myScore.resetScores();
		
		start();
	});
});

if(typeof chrome !== 'undefined' && typeof chrome.storage != 'undefined' && typeof chrome.storage.sync != 'undefined'){
    asyncTest( "Insertion with chromesync", function() {
        var myScore = new Scoreboard({
            storageEngine : 'chromesync'
        });
        
        ok('chromesync' == myScore.options.storageEngine,'Storage engine has been set correctly.');
        
        myScore.load(function(){
                
            ok(0 == myScore.data.regular.moves.count, "Move count starts at zero");
            
            myScore.updateField('regular','moves',10);
            myScore.updateField('regular','moves',10);
            
            ok(2 == myScore.data.regular.moves.count, 'Move count updates');
            
            myScore.updateField('regular','moves',10);
            myScore.updateField('regular','moves',20);
            
            ok(12.5 == myScore.data.regular.moves.val, 'Move values update');
            ok(4 == myScore.data.regular.moves.count, 'count updates');
            ok(20 == myScore.data.regular.moves.max, 'max updates');
            ok(10 == myScore.data.regular.moves.min,'min updates');

            ok(0 == myScore.data.regular.games.val,'values sum correctly');
            
            myScore.updateField('regular','games',10);
            myScore.updateField('regular','games',10);
            
            ok(20 == myScore.data.regular.games.val, 'values sum correctly');

            ok(0 == myScore.data.regular.won.val,'should track streaks correctly');
            
            myScore.updateField('regular','won',1);
            ok(1 == myScore.data.regular.won.streakLength,'should track streaks correctly');
            ok(1 == myScore.data.regular.won.streakMax,'should track streaks correctly');
            
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            ok(5 == myScore.data.regular.won.streakLength,'should track streaks correctly');
            ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
            
            myScore.updateField('regular','won',0);
            ok(0 == myScore.data.regular.won.streakLength,'should track streaks correctly');
            ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
            
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            ok(3 == myScore.data.regular.won.streakLength,'should track streaks correctly');
            ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
            
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            myScore.updateField('regular','won',1);
            ok(6 == myScore.data.regular.won.streakMax);
            
            ok(0 == myScore.data.regular.scoreHighest.val,'should insert multiple values corrrectly');
            ok(0 == myScore.data.regular.lost.val,'should insert multiple values corrrectly');
            
            myScore.updateFields('regular',{
                scoreHighest : 555,
                lost : 1
            });
            
            ok(555 == myScore.data.regular.scoreHighest.val,'should insert multiple values corrrectly');
            ok(1 == myScore.data.regular.lost.val,'should insert multiple values corrrectly');
            
            myScore.resetScores();
            start();
        });
      
      
    });

}

asyncTest( "Insertion with webstorage", function() {
	var myScore = new Scoreboard({
		storageEngine : 'webstorage'
	});
	
	ok('webstorage' == myScore.options.storageEngine,'Storage engine has been set correctly.');
	
	myScore.load(function(){
			
		ok(0 == myScore.data.regular.moves.count, "Move count starts at zero");
		
		myScore.updateField('regular','moves',10);
		myScore.updateField('regular','moves',10);
		
		ok(2 == myScore.data.regular.moves.count, 'Move count updates');
		
		myScore.updateField('regular','moves',10);
		myScore.updateField('regular','moves',20);
		
		ok(12.5 == myScore.data.regular.moves.val, 'Move values update');
		ok(4 == myScore.data.regular.moves.count, 'count updates');
		ok(20 == myScore.data.regular.moves.max, 'max updates');
		ok(10 == myScore.data.regular.moves.min,'min updates');

		ok(0 == myScore.data.regular.games.val,'values sum correctly');
		
		myScore.updateField('regular','games',10);
		myScore.updateField('regular','games',10);
		
		ok(20 == myScore.data.regular.games.val, 'values sum correctly');

		ok(0 == myScore.data.regular.won.val,'should track streaks correctly');
		
		myScore.updateField('regular','won',1);
		ok(1 == myScore.data.regular.won.streakLength,'should track streaks correctly');
		ok(1 == myScore.data.regular.won.streakMax,'should track streaks correctly');
		
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		ok(5 == myScore.data.regular.won.streakLength,'should track streaks correctly');
		ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
		
		myScore.updateField('regular','won',0);
		ok(0 == myScore.data.regular.won.streakLength,'should track streaks correctly');
		ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
		
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		ok(3 == myScore.data.regular.won.streakLength,'should track streaks correctly');
		ok(5 == myScore.data.regular.won.streakMax,'should track streaks correctly');
		
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		myScore.updateField('regular','won',1);
		ok(6 == myScore.data.regular.won.streakMax);
		
		ok(0 == myScore.data.regular.scoreHighest.val,'should insert multiple values corrrectly');
		ok(0 == myScore.data.regular.lost.val,'should insert multiple values corrrectly');
		
		myScore.updateFields('regular',{
			scoreHighest : 555,
			lost : 1
		});
		
		ok(555 == myScore.data.regular.scoreHighest.val,'should insert multiple values corrrectly');
		ok(1 == myScore.data.regular.lost.val,'should insert multiple values corrrectly');
		
		myScore.resetScores();
		start();
	});
  
  
});
