(function(){
	
	var webStorage = {};

	this.Scoreboard = function(options){
		options = _.extend({
			webStorageKey : 'scoreboard',
			classes : [
				'regular'
			],
			fields : {
				time : {type:'average'},
				moves : {type:'average'},
				scoreAverage : {type:'average'},
				scoreHighest : {type:'average'},
				games : {type:'addition'},
				won : {
					type : 'addition',
					streak : true
				},
				lost : {
					type : 'addition',
					streak : true
				}
			}
		},options);
		this.options = options;
		this.load();
	}

	this.Scoreboard.prototype = {
		
		load : function(){
			this.data = webStorage[this.options.webStorageKey];
			
			if(typeof(this.data) == 'undefined'){
				this.initialise();
			}
			
			return;
		},
		
		initialise : function(){
			var that = this;
			var scores = {};
			
			
			for(var i=0; i<this.options.classes.length; i++){
				var thisClass = {};
				_.each(this.options.fields,function(a,b){
					
					thisClass[b] = that.makeField(a);
					
				});
				scores[this.options.classes[i]] = thisClass;
			}
			
			this.data = scores;
			return;
		},
		
		makeField : function(fieldDef){
			var field = {
				
			}
			switch(fieldDef.type){
				case "addition":
					field = {
						val : 0
					}
					break;
				case "average":
					field = {
						val : null,
						count : 0
					}
					break;
			}
			
			if(fieldDef.streak){
				field.lastVal = 0;
				field.streak = null;
				field.streakLength = 0;
			}
			
			return field;
		},
		
		updatefield : function(classname,fieldName,value){
			var fieldDef = this.options.fields[fieldName];
			var field = this.data[classname][fieldName];
			
			switch(fieldDef.type){
				case "addition":
					// Add this value onto the existing one
					field.val += value;
					break;
				case "average":
					if(field.count == 0){
						field.val = value;
					} else {
						// Add the average on
						field.val = (field.val*field.count+value)/(field.count+1);
					}
					field.count++;
					break;
			}
			
			if(fieldDef.streak){
				if(field.lastVal === null || field.val > field.lastVal){
					field.streak = true;
					field.streakLength++;
				} else {
					field.streak = false;
					field.streakLength = 0;
				}
				field.lastVal = field.val;
			}
		},
		
		resetScores : function(){
			webStorage = {};
		}
		
	}
}).call(this);
