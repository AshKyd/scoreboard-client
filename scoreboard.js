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
			
			var data = webStorage[this.options.webStorageKey];
			
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
					field.count++;
					break;
				case "custom":
					field.val = value;
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
		
		getFields : function(){
			return this.data;
		},
		
		getField : function(classname,fieldName){
			return this.data[classname][fieldName].val;
		},
		
		resetScores : function(){
			delete webStorage[this.options.webStorageKey];
			this.initialise();
		},
		
		save : function(callback){
			callback = typeof callback == 'function' ? callback : function(){};
			webStorage[this.options.webStorageKey] = JSON.stringify(this.data);
			callback(this);
		}
		
	}
}).call(this);
