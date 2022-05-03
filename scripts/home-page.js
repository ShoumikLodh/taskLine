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

		response.result.courses.forEach( course => {
			var courseBox = addCourseBoxItem(course);
			// console.log(courseBox);
			var deadlineDiv = courseBox.querySelector(".deadlines-div");
			// console.log(deadlineDiv);
			
			
			fetchCourseWork(course, deadlineDiv)
			.then(taskListWithRange => {
				taskList[course.id] = taskListWithRange;
				let classHeader = courseBox.querySelector(".classroom-header");
				addInstructorInfo(course.ownerId, classHeader);
	
			})
			 .catch(err => {
				console.log(err.message);
				let courseList = document.querySelector("#classroom-box-list");
				courseList.removeChild(courseBox);
			}); 
		});
		showCourseView(taskList); 

	} catch(err) {
		console.error("Execute error", err);
	} 

	

}

//#region 		


function addCourseBoxItem(course) {
	// <ul id="classroom-box-list">
    //         <div class="classroom-box">
    //             <div class="classroom-header">
    //                 <img class="profile-picture" src="assets/vp.png"></img>
    //                 <span class="classroom-banner-text">Designing Interactive Systems</span>
//                     <span>Grace Eden</span>
    //             </div>
    //         </div>
    //     </ul>
//#endregion
	

	let classroom_box=document.createElement('div');
	classroom_box.className='classroom-box';
	document.getElementById("classroom-box-list").appendChild(classroom_box);



	let class_header=document.createElement('div');
	class_header.className="classroom-header";
	class_header.innerHTML += `
	<span class = "classroom-banner-text">${course.name}</span>
	<div class="deadlines-div"></div>`;
	classroom_box.appendChild(class_header);
	return classroom_box;
}


	// let deadlinesDiv = document.createElement('div');
	// class_header.className="deadlines-div";
	// classroom_box.appendChild(deadlinesDiv);
	// console.log(class_header);
	// console.log(classroom_box);
	// addInstructorInfo(course.ownerId, class_header);
	

	// let list_item = document.createElement('li');
	// list_item.append(classroom_box);
	// document.getElementById("classroom-box-list").appendChild(list_item);
	//document.body.appendChild(courseBox);
	

function addInstructorInfo(teacher_id, class_header) {
	return gapi.client.classroom.userProfiles.get({ 'userId': teacher_id})
		
	.then(function(response) {
		let profName = response.result.name.fullName;
		let span = document.createElement('span');
		span.innerHTML = `${profName}`;
		class_header.insertBefore(span, class_header.childNodes[2]);
		
		// profPic.className = "course-prof-pic-item";
		// class_header.innerHTML += `<span>${profName}</span>`;
		// courseHeader.appendChild(profPic);


		let profPic = document.createElement("img");
		profPic.src = "https:".concat(response.result.photoUrl);
		profPic.referrerPolicy = "no-referrer";
		profPic.onload = () => {
			class_header.insertBefore(profPic, class_header.firstChild);
			class_header.style.display = "block";
			class_header.style.border = "1px red solid";
		}
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

t picUrl = "https:".concat(response.result.photoUrl);
		// profPic.style.height = '30px';
		// profPic.style.width = '30px';
		
		// let profName = document.createElement('p');
		// profName.className = "course-prof-item";
		// profName.innerHTML = response.result.name.fullName;
		// courseDiv.insertBefore(profName, courseDiv.childNodes[1]);
		
			// createP

  */
	
	