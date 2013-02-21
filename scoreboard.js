(function(){

	if(typeof localStorage == 'undefined'){
		localStorage = {};
	}
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
				scoreHighest : {type:'custom'},
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
	}

	this.Scoreboard.prototype = {
		
		load : function(callback){
			if(typeof callback != 'function'){
				throw 'Callback not defined in Scoreboard.load();';
			}
			
			var data = localStorage[this.options.webStorageKey];
			
			if(typeof(data) == 'undefined'){
				this.initialise();
			} else {
				this.data = JSON.parse(data);
			}
			
			callback(this);
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
				case "custom":
					field = {
						val : 0
					}
					break;
				case "average":
					field = {
						val : null,
						count : 0,
						min : null,
						max : null
					}
					break;
			}
			
			if(fieldDef.streak){
				field.lastVal = 0;
				field.streakLength = 0;
				field.streakMax = 0;
			}
			
			return field;
		},
		
		updateFields : function(classname,values){
			var that = this;
			_.each(values,function(a,b){
				that.updateField(classname,b,a);
			});
			
		},
		
		updateField : function(classname,fieldName,value){
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
					
					if(field.max === null || value > field.max){
						field.max = value;
					}
					
					if(field.min === null || value < field.min){
						field.min = value;
					}
					
					field.count++;
					break;
				case "custom":
					field.val = value;
					break;
			}
			
			if(fieldDef.streak){
				if(field.lastVal === null || field.val > field.lastVal){
					field.streakLength++;
				} else {
					field.streakLength = 0;
				}
				if(field.streakLength > field.streakMax){
					field.streakMax = field.streakLength
				}
				field.lastVal = field.val;
			}
		},
		
		getFields : function(){
			return this.data;
		},
		
		getField : function(classname,fieldName){
			return this.data[classname][fieldName].val;
		},
		
		getWinningStreak : function(classname,fieldName){
			return this.data[classname][fieldName].streakLength;
		},
		
		resetScores : function(){
			delete localStorage[this.options.webStorageKey];
			this.initialise();
		},
		
		save : function(callback){
			callback = typeof callback == 'function' ? callback : function(){};
			localStorage[this.options.webStorageKey] = JSON.stringify(this.data);
			callback(this);
		},
		resetStreak : function(classname,fieldName){
			this.data[classname][fieldName].streakLength = 0;
			this.data[classname][fieldName].lastVal = null;
		}
		
	}
}).call(this);
