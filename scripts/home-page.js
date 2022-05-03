window.onload = async () => {
	const promise = await authenticate().then(loadClient).then(execute);
	filterTasks();
	
}

function filterTasks() {
	let highlightButtons = document.getElementsByClassName('highlight-button');
	highlightButtons.forEach(button => {
		button.onclick = button => {
			// highlight time block here;

			let highlighted_tasks = [];
			
			let deadlines = document.getElementsByClassName("task-item");
			deadlines.forEach(task => {
				if (button.dataset.range === task.dataset.range) {
					task.classList.add("task-item--highlight");
				}
			});


			window.onclick = () => {
				//dehighlight time block here
				highlighted_tasks.forEach(task => {
					task.classList.remove("task-item--highlight");
				})
				window.onclick = null;
			} 
		};
	});
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
	// <ul id="classroom-box-list">
    //         <div class="classroom-box">
    //             <div class="classroom-header">
    //                 <img class="profile-picture" src="assets/vp.png"></img>
    //                 <span class="classroom-banner-text">
    //                     <span>Designing Interactive Systems</span>
    //                     <span>Grace Eden</span>
    //                 </span>
    //             </div>
    //         </div>
    //     </ul>

	let classroom_box=document.createElement('div');
	classroom_box.className='classroom-box';
	let class_header=document.createElement('div');
	class_header.className="classroom-header";

	let course_div = document.createElement("span");
	//course_div.style.display = "none";
	course_div.className = "classroom-banner-text";
	course_div.innerHTML = `
	<span class = "classroom-banner-text">${course.name}</span	>`;


	// let course_title = document.createElement("h3");
	// course_title.className = "course-title-item";
	// course_title.innerHTML = course.name;
	// course_div.appendChild(course_title);
	class_header.appendChild(course_div);
	classroom_box.appendChild(class_header);
	addInstructorInfo(course.ownerId, class_header, course_div);
	document.getElementById("classroom-box-list").appendChild(classroom_box);


	//document.body.appendChild(course_div);
	return course_div;
}

function addInstructorInfo(teacher_id, courseHeader, courseDiv) {
	return gapi.client.classroom.userProfiles.get({ 'userId': teacher_id})
		
	.then(function(response) {
		let profName = response.result.name.fullName;
		courseDiv.innerHTML = `<span>${profName}</span>`;
		
		let profPic = document.createElement("img");
		// profPic.className = "course-prof-pic-item";
		profPic.src = "https:".concat(response.result.photoUrl);
		profPic.referrerPolicy = "no-referrer";
		courseHeader.appendChild(profPic);
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
	
	