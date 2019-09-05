(function () {
	"use strict";
	var csrf_token = '<%= token_value %>';

    $("body").bind("ajaxSend", function(elm, xhr, s){

		if (s.type == "POST") {

		    xhr.setRequestHeader('X-CSRF-Token', csrf_token);

		}

	});
	
	var currentDates = new Date();
	var currentMonth = new Month(currentDates.getFullYear(), currentDates.getMonth());
	// this username is from php session.
	var username = "";
	var events = null;
	// get month information when the page is loaded.
	document.addEventListener("DOMContentLoaded", function(event){
		updateCalendar(events); // Whenever the month is updated, we'll need to re-render the calendar in HTML
		//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
	}, false);
	
	// Change the month when the "prev" button is pressed
	document.getElementById("prev").addEventListener("click", function(event){
		currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
		updateCalendar(events); // Whenever the month is updated, we'll need to re-render the calendar in HTML
		//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
	}, false);
	
	// Change the month when the "next" button is pressed
	document.getElementById("next").addEventListener("click", function(event){
		currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
		updateCalendar(events); // Whenever the month is updated, we'll need to re-render the calendar in HTML
		//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
	}, false);

	function getEvents() {
		// The XMLHttpRequest is simple this time:
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "events.php", true);
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			events = jsonData;
			updateCalendar(events);
		}, false);
		xmlHttp.send(null);
	}

	// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
	// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
	function updateCalendar(events){
		console.log(events);
		var weeks = currentMonth.getWeeks();
		var cal = $("#calendar");
		cal.empty();
		var yearInfo = document.getElementById("year");
		var monthInfo = document.getElementById("month");
		yearInfo.innerHTML = currentMonth.year;
		if (currentMonth.month == 0) {
			monthInfo.innerHTML = "JANUARY";
		} else if (currentMonth.month == 1) {
			monthInfo.innerHTML = "FEBRUARY";
		} else if (currentMonth.month == 2) {
			monthInfo.innerHTML = "MARCH";
		} else if (currentMonth.month == 3) {
			monthInfo.innerHTML = "APRIL";
		} else if (currentMonth.month == 4) {
			monthInfo.innerHTML = "MAY";
		} else if (currentMonth.month == 5) {
			monthInfo.innerHTML = "JUNE";
		} else if (currentMonth.month == 6) {
			monthInfo.innerHTML = "JULY";
		} else if (currentMonth.month == 7) {
			monthInfo.innerHTML = "AUGUST";
		} else if (currentMonth.month == 8) {
			monthInfo.innerHTML = "SEPTEMBER";
		} else if (currentMonth.month == 9) {
			monthInfo.innerHTML = "OCTOBER";
		} else if (currentMonth.month == 10) {
			monthInfo.innerHTML = "NOVEMBER";
		} else if (currentMonth.month == 11) {
			monthInfo.innerHTML = "DECEMBER";
		}
		
		for(var w in weeks){
			var days = weeks[w].getDates();
			// days contains normal JavaScript Date objects.
			
			//alert("Week starting on "+days[0]);
			
			for(var d in days){
				// You can see console.log() output in your JavaScript debugging tool, like Firebug,
				// WebWit Inspector, or Dragonfly.
				cal = document.getElementById("calendar");
				var dayObj = document.createElement("div");
				dayObj.appendChild(document.createTextNode(days[d].getDate()));
				if (currentMonth.month != days[d].getMonth()) {
					dayObj.innerHTML = "";
				}
				if (days[d].getDate() == currentDates.getDate() &&
				days[d].getMonth() == currentDates.getMonth() &&
				days[d].getFullYear() == currentDates.getFullYear()) {
					dayObj.style.backgroundColor = "lightseagreen";
				}
				cal.appendChild(dayObj);
				dayObj.classList.add("dates");
				if (events != null) {
					for (var eve in events) {
						var tempDate = events[eve].event_date.split("-");
						var eventDate = new Date(tempDate[0], tempDate[1] - 1, tempDate[2]);
						if (currentMonth.month == days[d].getMonth() &&
						days[d].getDate() == eventDate.getDate() &&
						days[d].getMonth() == eventDate.getMonth() &&
						days[d].getFullYear() == eventDate.getFullYear()) {
							dayObj.addEventListener("click", function(event) {
								document.getElementById("edit_event").style.display = "initial";
								document.getElementById("edit_event_title").value = events[eve].event_title;
								document.getElementById("edit_event_content").value = events[eve].event_content;
								document.getElementById("edit_event_date").value = events[eve].event_date;
								document.getElementById("edit_event_time").value = events[eve].event_time;
		
								document.getElementById("edit_event_submit").addEventListener("click", function(event){
									updateEvent(events[eve].event_id);
								}, false);
		
								document.getElementById("edit_event_delete").addEventListener("click", function(event){
									deleteEvent(events[eve].event_id);
								}, false);
		
								document.getElementById("edit_event_close").addEventListener("click", function(event){
									document.getElementById("edit_event").style.display = "none";
								}, false);
								
							}, false);
							dayObj.style.backgroundColor = "yellow";
						}
					}
				}
			}
		}
	}
	
	function updateEvent(eventID) {
		var eventTitle = document.getElementById("edit_event_title").value;
		var eventContent = document.getElementById("edit_event_content").value;
		var eventDate = document.getElementById("edit_event_date").value;
		var eventTime = document.getElementById("edit_event_time").value;
		var dataString = "eventID=" + encodeURIComponent(eventID) + 
		"&eventTitle=" + encodeURIComponent(eventTitle) + 
		"&eventContent=" + encodeURIComponent(eventContent) + 
		"&eventDate=" + encodeURIComponent(eventDate) + 
		"&eventTime=" + encodeURIComponent(eventTime);
		var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "updateEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				
				alert("You've updated this event!");
				getEvents();
			}else{
				alert("You did not updated this event.  "+jsonData.message);
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString); // Send the data
		document.getElementById("edit_event").style.display = "none";
	}
	
	function deleteEvent(eventID) {
		var dataString = "eventID=" + encodeURIComponent(eventID);
		var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "deleteEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				
				alert("You've deleted this event!");
				getEvents();
			}else{
				alert("You did not deleted this event.  "+jsonData.message);
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString); // Send the data
		document.getElementById("edit_event").style.display = "none";
	}
	
	document.getElementById("sign_in").addEventListener("click", function(event){
		document.getElementById("login").style.display = "initial";
	}, false);
	
	document.getElementById("login_close").addEventListener("click", function(event){
		document.getElementById("login").style.display = "none";
	}, false);
	
	document.getElementById("register").addEventListener("click", function(event){
		document.getElementById("sign_up").style.display = "initial";
	}, false);
	
	document.getElementById("sign_up_close").addEventListener("click", function(event){
		document.getElementById("sign_up").style.display = "none";
	}, false);
	
	// register function.
	const registerAjax = function(event){
		username = document.getElementById("new_username").value; // Get the username from the form
		var password = document.getElementById("new_password").value; // Get the password from the form
	
		// Make a URL-encoded string for passing POST data:
		var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
		
		var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "register.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				alert("You've been registered!");
			}else{
				alert("You were not registered.  "+jsonData.message);
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString); // Send the data
		document.getElementById("sign_up").style.display = "none";
	}

	document.getElementById("sign_up_submit").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click
	
	// login function.
	function loginAjax(event){
		username = document.getElementById("username").value; // Get the username from the form
		var password = document.getElementById("password").value; // Get the password from the form

		// Make a URL-encoded string for passing POST data:
		var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
	
		var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "login.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				document.getElementById("sign_in").style.display = "none";
				document.getElementById("register").style.display = "none";
				document.getElementById("sign_out").style.display = "initial";
				document.getElementById("add_event").style.display = "initial";
				document.getElementById("return_username").innerHTML = "Welcome, " + username + "!";
				
				alert("You've been Logged In!");
				getEvents();
			}else{
				alert("You were not logged in.  "+jsonData.message);
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString); // Send the data
		document.getElementById("login").style.display = "none";
	}

	document.getElementById("login_submit").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
	
	// log out.
	function logoutAjax(event) {
		// The XMLHttpRequest is simple this time:
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "logout.php", true);
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				document.getElementById("sign_in").style.display = "initial";
				document.getElementById("register").style.display = "initial";
				document.getElementById("add_event").style.display = "none";
				document.getElementById("sign_out").style.display = "none";
				document.getElementById("return_username").innerHTML = "";
				alert("You've been Logged Out!");
				getEvents();  
			}else{
				alert("You were not logged out.  "+jsonData.message);
			}
		}, false);
		xmlHttp.send(null);
		
	}
	
	document.getElementById("sign_out").addEventListener("click", logoutAjax, false);
	
	document.getElementById("add_event").addEventListener("click", function(event){
		document.getElementById("event").style.display = "initial";
	}, false);
	
	document.getElementById("event_close").addEventListener("click", function(event){
		document.getElementById("event").style.display = "none";
	}, false);
	
	// add event
	const addEventAjax = function(event){
		var eventTitle = document.getElementById("event_title").value;
		var eventContent = document.getElementById("event_content").value;
		var eventDate = document.getElementById("event_date").value;
		var eventTime = document.getElementById("event_time").value;
	
		// Make a URL-encoded string for passing POST data:
		var dataString = "eventTitle=" + encodeURIComponent(eventTitle) +
		"&eventContent=" + encodeURIComponent(eventContent) + 
		"&eventDate=" + encodeURIComponent(eventDate) + 
		"&eventTime=" + encodeURIComponent(eventTime);
		
		var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
		xmlHttp.open("POST", "insertEvent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
		xmlHttp.addEventListener("load", function(event){
			var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
			if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
				getEvents();
				alert("You've added an event!");
			}else{
				alert("Your event was not added.  "+jsonData.message);
			}
		}, false); // Bind the callback to the load event
		xmlHttp.send(dataString); // Send the data
		document.getElementById("event").style.display = "none";
	}

	document.getElementById("event_submit").addEventListener("click", addEventAjax, false); // Bind the AJAX call to button click
	
})();