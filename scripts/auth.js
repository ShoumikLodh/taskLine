var GoogleAuth;
var SCOPE = `https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.course-work.readonly https://www.googleapis.com/auth/classroom.profile.photos`;

  function authenticate() {
		console.log('auth');
    return gapi.auth2.getAuthInstance()
        .signIn({scope: SCOPE})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
		console.log('loadClient');
    gapi.client.setApiKey("AIzaSyDZm8Px4yerKwaTZgcsbWR1USkkrzWkEv8");
    return gapi.client.load("https://classroom.googleapis.com/$discovery/rest?version=v1")
        .then(function() { 
			console.log("GAPI client loaded for API"); 
			GoogleAuth = gapi.auth2.getAuthInstance();

			// Listen for sign-in state changes.
			GoogleAuth.isSignedIn.listen(updateSigninStatus);
  
			// Handle initial sign-in state. (Determine if user is already signed in.)
			setSigninStatus();
			let signInButton = document.querySelector('#sign-in-button');
			signInButton.addEventListener("click", handleAuthClick);

		// 	  document.querySelector('#revoke-access-button').click(function() {
		// 		revokeAccess();
		// 	  });
		},
		function(err) { console.error("Error loading GAPI client for API", err); });
  	}


	function handleAuthClick() {
		console.log('handleAuthClick');
		if (GoogleAuth.isSignedIn.get()) {
			GoogleAuth.signOut();
		} else {
			GoogleAuth.signIn();
		}
	}

	function updateSigninStatus() {
		console.log('updateSigninStatus');
		setSigninStatus();
	}

	function setSigninStatus() {
		console.log('setSigninStatus');
		var user = GoogleAuth.currentUser.get();
		var isAuthorized = user.hasGrantedScopes(SCOPE);
		if (isAuthorized) {
			document.querySelector('#sign-in-button').innerHTML = 'Sign out';
			document.querySelector('#auth-status').innerHTML = 'You are currently signed in and have granted ' +
			'access to this app.';
		} else {
			window.location.href = '/index.html';
			document.querySelector('#sign-in-button').innerHTML = 'Sign In/Authorize';
			document.querySelector('#auth-status').innerHTML = 'You have not authorized this app or you are ' +
			  'signed out.';
		}
	  }
	
	// Make sure the client is loaded and sign-in is complete before calling this method.
gapi.load("client:auth2", function() {
	console.log('client:auth2');
	gapi.auth2.init({client_id: "510067352144-f15751hlrjg27gg5hkdehlv0gkmkd7o9.apps.googleusercontent.com"});
});


// http://localhost:3000/auth/google/callback
