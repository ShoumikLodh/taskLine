//#region 
/* document.addEventListener('DOMContentLoaded', function() {
	// let signInButton = document.querySelector('#sign-in-button');
	// signInButton.onc = () => {
			// signInButton.onclick = handleAuthClick;

			authenticate()
				.then(loadClient).then(execute)
			.then(taskList => {
				showCourseView(taskList);
			});
		// } 
}); */

// var one_off = false;
/* 
try {
localStorage.setItem("login", 0);
}
catch(err) {
	console.error(err);
} */
//#endregion

window.onload = () => {
	// init();
	authenticate().then(loadClient).then(execute);
	
}
	// .then(execute)
	// .then(taskList => {
	// });


/* async function init() {
	await authenticate().then(loadClient);
	execute();
} */

// try to make this function async
async function execute() {
	var taskList = {};
	try {
		let response = await gapi.client.classroom.courses.list({
			"courseStates": [
				"ACTIVE"
			]
		});

		response.result.courses.forEach(course => {
			let course_div = addCourseBoxItem(course);
			fetchCourseWork(course, course_div)
			.then(taskListWithRange => {
				taskList[course.id] = taskListWithRange;
				addInstructorInfo(course.ownerId, course_div);
	
			})
			.catch(err => {
				console.log(err.message);
				document.body.removeChild(course_div);
			}); 
		});
		showCourseView(taskList);

	} catch(err) {
		console.error("Execute error", err);
	} 

	

}

		// .then(function(response) {
			// response.result.courses.forEach(course => {
			// 	let course_div = addCourseBoxItem(course);
			// 	fetchCourseWork(course, course_div)
			// 	.then(taskListWithRange => {
			// 		taskList[course.id] = taskListWithRange;
			// 		addInstructorInfo(course.ownerId, course_div);

			// 	})
			// 	.catch(err => {
			// 		console.log(err.message);
			// 		document.body.removeChild(course_div);
			// 	}); 
			// });
			// return taskList;
		// },
		// function(err) { console.error("Execute error", err);}
		// );


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

 
	
	