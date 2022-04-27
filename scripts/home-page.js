document.addEventListener('DOMContentLoaded', function() {
	let signInButton = document.querySelector('#sign-in-button');
	signInButton.onclick = () => {
	  	signInButton.onclick = handleAuthClick;

    	authenticate()
        .then(loadClient).then(execute)
			.then(taskList => {
				showExpandedCourse();
			}) ;
  	}
});



function execute() {
	let taskList = {};
	return gapi.client.classroom.courses.list({
      "courseStates": [
        "ACTIVE"
      ]
    })
        .then(function(response) {
			// var promise;
          response.result.courses.forEach(course => {
              let course_div = addCourseBoxItem(course);

            //    promise  = getCourseWork(course, course_div)
               getCourseWork(course, course_div)

              .then(taskListWithRange => {
					// console.log("this was the list i was talking about.");
					// console.log(taskListWithRange);
					
					taskList[course.id] = taskListWithRange;
					addInstructorInfo(course.ownerId, course_div);
					// return taskList;
              })
              .catch(err => {
				  console.log(err.message);
				  document.body.removeChild(course_div);
				}); 
				// console.log("promise here");
				// console.log(promise);
			  
			  
			  
            });
			// console.log("final pomise");
			// console.log(promise);
			// console.log(taskList);
			return taskList;
		},
			function(err) { console.error("Execute error", err);}
		);
		// .then(() => taskList);

}

function addCourseBoxItem(course) {
  let course_div = document.createElement("div");
  course_div.className = "course-title-box";
  course_div.style.display = "none";

  let course_title = document.createElement("h3");
  course_title.className = "course-title-item";
  course_title.innerHTML = course.name;


  document.body.appendChild(course_div);
  course_div.appendChild(course_title);
  return course_div;
}

function addInstructorInfo(teacher_id, courseDiv) {
  return gapi.client.classroom.userProfiles.get(
    {
      'userId': teacher_id
    })
    .then(function(response) {
      let profName = document.createElement('p');
      profName.className = "course-prof-item";
      profName.innerHTML = response.result.name.fullName;
      courseDiv.insertBefore(profName, courseDiv.childNodes[1]);
      
        createProfPic(response, courseDiv);
    });
}
  
function createProfPic(response, courseDiv) {
  let profPic = document.createElement("img");
  profPic.className = "course-prof-pic-item";
  profPic.style.height = '30px';
  profPic.style.width = '30px';
  profPic.src = "https:".concat(response.result.photoUrl);
  profPic.referrerPolicy = "no-referrer";
  
  profPic.onload = () => {
    courseDiv.insertBefore(profPic, courseDiv.firstChild);
    courseDiv.style.display = "block";
    // courseDiv.style.border = "1px red solid";
  }
  
} 

 /*  let src = "https:".concat(response.result.photoUrl);
  let profPic = createImg(src, "");
  profPic.elt.height = '30';
  profPic.elt.width = '30';
  profPic.elt.className = "course-prof-pic-item";
  profPic.elt.referrerPolicy = "no-referrer";

  profPic.elt.onload = () => {
    // console.log(profPic);
    // console.log(courseDiv);
    courseDiv.insertBefore(profPic.elt, courseDiv.firstChild);
    courseDiv.style.display = "block";
  } */



  
  