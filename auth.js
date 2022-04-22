var GoogleAuth;
  /**
   * Sample JavaScript code for classroom.courses.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/code-samples#javascript
   */

  function authenticate() {
    return GoogleAuth = gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.course-work.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyDZm8Px4yerKwaTZgcsbWR1USkkrzWkEv8");
    return gapi.client.load("https://classroom.googleapis.com/$discovery/rest?version=v1")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  

  
  
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "510067352144-f15751hlrjg27gg5hkdehlv0gkmkd7o9.apps.googleusercontent.com"});
  });
/* 
  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);

  } */