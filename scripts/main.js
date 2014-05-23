var app = {

	//array of quotes of leaders.
	quotes: [null,null,null,null], 

	//Party Leaders
	leaders : ['stephen-harper','justin-trudeau','thomas-mulcair','elizabeth-may'],
	
	//Members of Parliament that mention the leaders
	mps: {},

	//Greater than 6 will cause HTTP request errors.
	search_limit : 6,

	current_id : 0, //which leader
	quote_id : 0,  //which quote

	main_url: 'http://api.openparliament.ca',

	//First Ajax query for content about the mentioned politician
	//@param politician- mentioned politician
	query: function(politician,id) {

		$.ajax({
			url: app.buildSearch(politician),
			type: 'GET',
			success: function(response){
				//store the mentioned politicians quotes
				app.quotes[id] = response; 
				
				//set current politician
				app.current_id = id;
				//reset quote
				app.quote_id = 0;

				app.nextQuote();
					
			}
		});//ajax
	},//query


	//build the JSON URL for the mentioned politician.
	//@param - mentioned politician
	buildSearch: function(politician){
		var url = app.main_url + '/speeches/?mentioned_politician='+politician+'&limit='+app.search_limit+'&format=json';
		console.log(url);
		return url;
	},

	//Get profile of the politician who mentioned the leader.
	//@param mpURL - the url of the leaders profile
	buildAttribution: function(mpURL){
		console.log("getting: "+app.main_url + mpURL + '?format=json');
		$.ajax({
			url: app.main_url + mpURL + '?format=json',
			type: 'GET',
			success: function(response){
				console.log('setting MP key: ' +mpURL);
				app.mps[mpURL] = response; 

				var speaker = $('.speaker');
				speaker.find('img').attr('src',app.main_url+app.mps[mpURL].image);
				speaker.find('#full-name').text(app.mps[mpURL].name);
				speaker.find('#party-riding').text(app.mps[mpURL].memberships[0].party.name.en);

			}

		});//ajax
	},//buildAttribution

	//Displays the content and speaker information
	//increases iteration for the bubble.
	nextQuote: function(){
		var bubble  = $('.bubble');
		var speaker = $('.speaker');
		
		//set content bubble.
		bubble.html(app.quotes[app.current_id].objects[app.quote_id].content.en);

		//get quotes for specific leader
		var quotes = app.quotes[app.current_id];
		//get mp's URL of who said current quote;
		var mpURL = quotes.objects[app.quote_id].politician_url;
		
		//if the MP isn't cached
		if (app.mps[mpURL] === undefined){
			app.buildAttribution(mpURL);
		}
		//get cache and set the speaker.
		else {		
			speaker.find('img').attr('src',app.main_url+app.mps[mpURL].image);
			speaker.find('#full-name').text(app.mps[mpURL].name);
			speaker.find('#party-riding').text(app.mps[mpURL].memberships[0].party.name.en);
		}

		app.quote_id++;
		console.log('incrementing quote_id: ' + app.quote_id);

		if (app.quote_id === app.search_limit){
			app.quote_id = 0;
			console.log('reseting quote_id: ' + app.quote_id);
		}


	},//nextQuote


	//change all a tags to include api.openparliment.ca
	//@param text - Anchor Tag that needs to be altered.
	replaceLinks: function(text){ 
		
		//To Do.


	},//replaceLinks

}//ap



$(document).ready(function(){

	//clicking on a Leader's name.
	$('li').on('click',function(){
		//each li has an id corresponding to the leaders array
		var id = Number(this.id);
		app.current_id = id;
		//if the Leader hasn't already been queried
		if(app.quotes[id] === null){
			console.log("making a query for: " + app.leaders[id]);
			//query the leader
			app.query(app.leaders[id],id);
		}
		else {
			console.log("retrieving cache for: " + app.leaders[id]);
			app.nextQuote();
			//recall the cache
		}	

	});
});











































