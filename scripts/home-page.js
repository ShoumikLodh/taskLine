
window.onload = () => {
	authenticate().then(loadClient).then(execute);
	
}

async function execute() {
	var taskList = {};
	try {
		const response = await gapi.client.classroom.courses.list({
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
				// addCourseBoxItem(course, course_div);
	
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



function addCourseBoxItem(course) {
	let course_div = document.createElement("div");
	course_div.style.display = "none";
	course_div.className = "course-title-box";
	course_div.innerHTML = `
	<h3 class = "course-title-item">${course.name}</h3>`;
	// let course_title = document.createElement("h3");
	// course_title.className = "course-title-item";
	// course_title.innerHTML = course.name;
	// course_div.appendChild(course_title);


	document.body.appendChild(course_div);
	return course_div;
}

function addInstructorInfo(teacher_id, courseDiv) {
	return gapi.client.classroom.userProfiles.get({ 'userId': teacher_id})
		
	.then(function(response) {
		let profName = response.result.name.fullName;
		courseDiv.innerHTML += `<p class="course-prof-item">${profName}<p>`;
		
		let profPic = document.createElement("img");
		profPic.className = "course-prof-pic-item";
		profPic.src = "https:".concat(response.result.photoUrl);
		profPic.referrerPolicy = "no-referrer";

		profPic.onload = () => {
			courseDiv.insertBefore(profPic, courseDiv.firstChild);
			courseDiv.style.display = "block";
			courseDiv.style.border = "1px red solid";
		}
		// let picUrl = "https:".concat(response.result.photoUrl);
		// profPic.style.height = '30px';
		// profPic.style.width = '30px';
		
		// let profName = document.createElement('p');
		// profName.className = "course-prof-item";
		// profName.innerHTML = response.result.name.fullName;
		// courseDiv.insertBefore(profName, courseDiv.childNodes[1]);
		
			// createProfPic(response, courseDiv);
	});
}
	
/* function createProfPic(response, courseDiv) {
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

  */
	
	