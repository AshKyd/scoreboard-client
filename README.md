scoreboard-client
=================
A Javascript library to add scoring & scoreboard functionality to your
web app.

Why would you use this? Maybe you've got a HTML5 game and want to add
highscores without the hassle. Maybe you… nope, that's all.

This is a basic library to manage addition, averages, winning streaks,
for you as well as the underlying data storage.

Usage
=================
You can initialise the object like so:

     var myScores = {
         webStorageKey : 'scoreboard',
         classes : [
             'easy',
             'medium',
             'hard'
         ],
         fields : {
             averageTime : {type:'average'},
             averageScore : {type:'average'},
             scoreHighest : {type:'custom'},
             gamesWon : {
                 type : 'addition',
                 streak : true
             },
             gamesLost : {
                 type : 'addition',
                 streak : true
             }
         }
     }

The options are:

storageEngine
-----------------
Choose between "webstorage" and "chromesync" depending on your
needs.

Web storage is a great general-purpose storage engine for web apps, and
Chrome Sync is a proprietary API for use in Chrome apps which syncs
across all the users devices.

Default:

	"webstorage"

webStorageKey
-----------------
The webStorage key to save this data to. Defaults to "scoreboard", so
you don't really need to set this unless it conflicts with something.

Default:

    "scoreboard"
 
classes
-----------------
Classes of game you're storing. This can be useful if you want to store
several difficulty levels separately such as "easy", "medium" and
"hard".

By default there is only one difficulty level, "regular".

Default:

    ['regular']
 
fields
-----------------
The fun stuff, fields let you define which fields you wish to save, and
how you want them to tally.

There are three types of fields:
* average - stores the average of all the values entered.
* addition - adds the value to the existing value.
* custom - lets you manage the logic on this field.

In addition, you can specify the "streak" option on a field, which will
keep track of whether this value is continually advancing, such as if
you're on a winning streak.

You can specify fields as such:

    fields : {
        averageTime : {type:'average'},
        favouriteColour : { type : 'custom'},
        gamesWon : {
            type : 'addition',
            streak : true
        }
    }

The averageTime field will store the average time of a game. The
favouriteColour field will let you store a custom string containing the
favourite colour. The gamesWon field will tally games won, and also keep
track of whether you're on a winning streak.

Initial Load
===============
To initialise and load any data, you must call myScores.load, specifying
a callback.

This method is asynchronous in order to support possible async data
sources in the future.

    myScores.load(function(){
        // do stuff
    });

Retrieving Data
===============
You can retrieve data in two ways, either one key at a time, or the
entire data structure at once.

Load one key
---------------
You can load a single key with the following syntax:

    myScores.getField(classname,keyname);
    
classname is the class specified on init, such as "easy", "medium" or
"hard". If you haven't customised classes, simply use "regular".

Load all data
---------------
You can load all the data from the scoreboard at once, for instance if
you wanted to add it to a Mustache template.

    myScores.getFields();
    
The data is stored in the following format:

    {
        "className" : {
            "itemName" : {
                "val" : 0,
                "count" : 0,
                "streakLength" : 0
            },
            "itemName2" : { … }
        }
    }
Updating Data
===============
The same as retrieving data, you can set either a single key or a number
of keys at a time.

Set one value
---------------
To set a single value:

    myScores.updateField(classname,fieldName,value);

Set several values
------------------
To set multiple values:

    myScores.updateFields(classname,{
		fieldName1 : value,
		fieldName2 : value,
		fieldName3 : […]
    });


Winning Streaks
===============
Winning streaks can be calculated on any field, but are best used on
addition fields.

They are true as follows:

    no previous values exist || the current value > the last value
    
This means you are on a winning streak if this is the first time you've
updated the field, or if the field is continuing to increase from the
previous values.

You can get the length of the winning streak with:

    var winningStreakLength = myScores.getWinningStreak();

A winning streak with a length of zero is not a winning streak.

Winning Streak Properties
-------------------------
Other properties available on winning streaks include:
* lastVal - The last value recorded. This is what streaks are compared with.
* streakLength - The length of the streak. Same as getWinningStreak().
* streakMax - The maximum streak length of all time.

These properties can be accessed on the object returned by getField().

Resetting a Streak
-------------------------
Sometimes you might want to reset a winning streak, for instance if you
have one or more mutually exclusive streaks defined. You can do this
with the resetStreak(classname,fieldName) command.

    myScores.resetStreak(classname,fieldName);

Average fields
===============
Average fields don't store discrete values, instead storing the average
of all values saved into the field.

For instance, saving a "10" to an average field will return the value
"10", but saving "20" to the field then stores the average of the two
values, which is "15".

Average fields save the following values:

* val - The average value of this field.
* count - The number of values this average comprises.
* min - The minimum value ever saved to the field.
* max - The maximum value ever saved to the field.

You can get these fields using getField().

Saving Data
===============
Make sure to save the data before you terminate your app, as it's not
saved automatically.

You can do this with:

    myScores.save(callback);

A quick demo
===============
Here is a bit of quick demo code outlining the functionality available.
    
    var myScore = new Scoreboard({
        webStorageKey : 'loadsavetest',
        classes : ['river'],
        fields : {
            trout : {type:'custom'}
        }
    });
    
    myScore.load(function(){
		myScore.updateField('river','trout','plentiful');
			
		myScore.save(function(){
			console.log('high scores have saved!');
		});
    });

Any issues, feel free to get in touch.

Testing
===============
To run the unit tests you'll need to install mocha.

    sudo npm install -g mocha

You can then run the tests like so:

    mocha test.js
