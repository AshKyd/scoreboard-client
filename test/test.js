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
			
			// Make sure the field is there.
			assert.equal('object',typeof myScore.data.myTestDifficulty.trout);
			
			// Make sure defaults aren't used when we define our own.
			assert.equal('undefined',typeof myScore.data.myTestDifficulty.time);
			assert.equal('undefined',typeof myScore.data.regular);
			
			myScore.resetScores();
		});
		
	});
	
	describe('insertion', function(){
		it('should average values correctly', function(){
			var myScore = new scoreboard.Scoreboard();
			assert.equal(0, myScore.data.regular.moves.count);
			
			myScore.updatefield('regular','moves',10);
			myScore.updatefield('regular','moves',10);
			
			assert.equal(2, myScore.data.regular.moves.count);
			
			myScore.updatefield('regular','moves',10);
			myScore.updatefield('regular','moves',20);
			
			assert.equal(12.5, myScore.data.regular.moves.val);
			assert.equal(4, myScore.data.regular.moves.count);
			myScore.resetScores();
		})

		it('should sum values correctly', function(){
			var myScore = new scoreboard.Scoreboard();
			assert.equal(0, myScore.data.regular.games.val);
			
			myScore.updatefield('regular','games',10);
			myScore.updatefield('regular','games',10);
			
			assert.equal(20, myScore.data.regular.games.val);
			myScore.resetScores();
		})

		it('should track streaks correctly', function(){
			var myScore = new scoreboard.Scoreboard();
			assert.equal(0, myScore.data.regular.won.val);
			
			myScore.updatefield('regular','won',1);
			assert.equal(true, myScore.data.regular.won.streak);
			assert.equal(1, myScore.data.regular.won.streakLength);
			
			myScore.updatefield('regular','won',1);
			myScore.updatefield('regular','won',1);
			myScore.updatefield('regular','won',1);
			myScore.updatefield('regular','won',1);
			assert.equal(true, myScore.data.regular.won.streak);
			assert.equal(5, myScore.data.regular.won.streakLength);
			
			myScore.updatefield('regular','won',0);
			assert.equal(false, myScore.data.regular.won.streak);
			assert.equal(0, myScore.data.regular.won.streakLength);
			
			myScore.updatefield('regular','won',1);
			myScore.updatefield('regular','won',1);
			myScore.updatefield('regular','won',1);
			assert.equal(true, myScore.data.regular.won.streak);
			assert.equal(3, myScore.data.regular.won.streakLength);
		})
	})
})
