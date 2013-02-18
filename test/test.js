/**
 * Just a couple o' tests. See:
 * http://visionmedia.github.com/mocha/
 */

var assert = require("assert");
_ = require('../underscore-min.js');
scoreboard = require('../scoreboard.js');

describe('Scoreboard', function(){
	
	describe('initialisation', function(){
		it('should create initial values', function(){
			var myScore = new scoreboard.Scoreboard({
				classes : ['myTestDifficulty'],
				fields : {
					trout : {type:'average'}
				}
			});
			
			myScore.load(function(){
			
				// Make sure the field is there.
				assert.equal('object',typeof myScore.data.myTestDifficulty.trout);
				
				// Make sure defaults aren't used when we define our own.
				assert.equal('undefined',typeof myScore.data.myTestDifficulty.time);
				assert.equal('undefined',typeof myScore.data.regular);
				
				myScore.resetScores();
			});
		});
		
	});
	
	describe('insertion', function(){
		var myScore = new scoreboard.Scoreboard();
		myScore.load(function(){
				
			it('should average values correctly', function(){
				assert.equal(0, myScore.data.regular.moves.count);
				
				myScore.updateField('regular','moves',10);
				myScore.updateField('regular','moves',10);
				
				assert.equal(2, myScore.data.regular.moves.count);
				
				myScore.updateField('regular','moves',10);
				myScore.updateField('regular','moves',20);
				
				assert.equal(12.5, myScore.data.regular.moves.val);
				assert.equal(4, myScore.data.regular.moves.count);
			});

			it('should sum values correctly', function(){
				assert.equal(0, myScore.data.regular.games.val);
				
				myScore.updateField('regular','games',10);
				myScore.updateField('regular','games',10);
				
				assert.equal(20, myScore.data.regular.games.val);
			});

			it('should track streaks correctly', function(){
				assert.equal(0, myScore.data.regular.won.val);
				
				myScore.updateField('regular','won',1);
				assert.equal(1, myScore.data.regular.won.streakLength);
				
				myScore.updateField('regular','won',1);
				myScore.updateField('regular','won',1);
				myScore.updateField('regular','won',1);
				myScore.updateField('regular','won',1);
				assert.equal(5, myScore.data.regular.won.streakLength);
				
				myScore.updateField('regular','won',0);
				assert.equal(0, myScore.data.regular.won.streakLength);
				
				myScore.updateField('regular','won',1);
				myScore.updateField('regular','won',1);
				myScore.updateField('regular','won',1);
				assert.equal(3, myScore.data.regular.won.streakLength);
			});
			
			it('should insert multiple values corrrectly',function(){
				assert.equal(0, myScore.data.regular.scoreHighest.val);
				assert.equal(0, myScore.data.regular.lost.val);
				
				myScore.updateFields('regular',{
					scoreHighest : 555,
					lost : 1
				});
				
				assert.equal(555, myScore.data.regular.scoreHighest.val);
				assert.equal(1, myScore.data.regular.lost.val);
			});
		});
	});
	
	describe('saving', function(){
		var myScore = new scoreboard.Scoreboard({
			webStorageKey : 'loadsavetest',
			classes : ['river'],
			fields : {
				trout : {type:'custom'}
			}
		});
		
		myScore.load(function(){
				
			it('should save and load correctly', function(){				
				myScore.updateField('river','trout','plentiful');
				assert.equal('plentiful', myScore.data.river.trout.val);
				var wait = true;
					
				myScore.save(function(){
					myScore.updateField('river','trout','dire');
					assert.equal('dire', myScore.data.river.trout.val);
					
					myScore.load(function(){
						assert.equal('plentiful', myScore.data.river.trout.val);
						wait = false;
					});
				});
			});
		});
	});
})
