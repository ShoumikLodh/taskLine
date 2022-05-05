window.onload = async () => {
	const promise = await authenticate().then(loadClient).then(execute);
	// if (localStorage.getItem("oldTaskList") !== null) {
	// findTaskDiffSinceLast();
	// }
	
	filterTasks();
	
}

function filterTasks() {
	let highlightButtons = document.getElementsByClassName('highlight-button');
	highlightButtons.forEach(button => {
		// console.log(button);
		// console.log("dsh;kjdhs;");
		button.onclick = () => {

			let highlighted_tasks = [];
			// console.log("inside onclick");
			let deadlines = document.getElementsByClassName("task-item");
			deadlines.forEach(task => {
				if (button.dataset.number === task.dataset.range) {
					task.classList.add("task-item--highlight");
					highlighted_tasks.push(task);
					// console.log(task);
					task.style.border = "5px red solid";
				}
			});
			// console.log(highlighted_tasks);
			// document.body.style.backgroundColor = "black";
			// console.log("after black");
			window.onclick = () => {
				window.onclick = null;
				console.log("window click");
				//dehighlight time block here
				document.body.style.backgroundColor = "white";
				highlighted_tasks.forEach(task => {
					console.log(task);
					task.classList.remove("task-item--highlight");
				})
			} 
		};
	});
}

async function execute() {
	// var taskList = {};
	try {
		const response = await gapi.client.classroom.courses.list({
			"courseStates": [
				"ACTIVE"
			]
		});

		let taskList = await initAddCourses(response);
		// console.log(taskList);
		// let newList = convertDict(taskList);
		// console.log(newList);
		// showCourseView(newList);

		// addNotifs(); 
		showCourseView(taskList); 
//#region 
	} catch(err) {
		console.error("Execute error", err);
	} 
	

}

async function initAddCourses(response) {
	let newList = await new Promise(resolve => {

		var taskList = {};
		// document.addEventListener('DOMContentLoaded', () => {
		response.result.courses.forEach(course => {
			var courseBox = addCourseBoxItem(course);
			var deadlineDiv = courseBox.querySelector(".deadlines-div");
			var count = 0;
			fetchCourseWork(course, deadlineDiv)
			.then(taskListWithRange => {
					taskList[course.id] = taskListWithRange;
					let classHeader = courseBox.querySelector(".classroom-header");
					addInstructorInfo(course.ownerId, classHeader);
					count++;
					if (count >= 4 ) {
						count = 0;
					}

			})
			.catch(err => {
				console.log(err.message);
				let courseList = document.querySelector("#classroom-box-list");
				courseList.removeChild(courseBox);
			});
		});
	// });


		resolve(taskList);
	});
	return newList;
	// return await convertDict(newList);

}
//#endregion
 function convertDict(taskList) {
	// let promise = await new Promise(resolve => {
		var newTaskList = {1: [], 2: [], 3: [], 4: []  };
		console.log(taskList);


	// for (var key in taskList) {
		for (const [key, value] of Object.entries(taskList)) {
			console.log(key, value);
			//   }
			// console.log(key);
			let ranges = taskList[key];
			for (var val in ranges) {
				console.log(val, ranges);
				if (ranges[val].length === 0)	
				continue;
				
				ranges[val].forEach(task => {
					// console.log(task);
					newTaskList[val].push(task);
				});
			}
		}
		// resolve(newTaskList);
	// });
	// return promise;
	return newTaskList;
}



function addCourseBoxItem(course) {


	let classroom_box=document.createElement('div');
	let header_div=document.createElement('div');
	header_div.setAttribute("id","header_div")
	classroom_box.className='classroom-box';
	// classroom_box.style.display = "none";
	document.getElementById("classroom-box-list").appendChild(classroom_box);
	
	
	
	let class_header=document.createElement('div');
//	class_header.style.display = "none";
	class_header.className="classroom-header";
	class_header.appendChild(header_div);
	class_header.innerHTML += `
	<span class = "classroom-banner-text">${course.name}</span>`;
	classroom_box.appendChild(class_header);
	classroom_box.innerHTML += `<div class="deadlines-div"></div>`;
	return classroom_box;
}




function addInstructorInfo(teacher_id, class_header) {
	return gapi.client.classroom.userProfiles.get({ 'userId': teacher_id})
		
	.then(function(response) {
		let profName = response.result.name.fullName;
		let span = document.createElement('span');
		span.innerHTML = `${profName}`;
		class_header.insertBefore(span, class_header.childNodes[2]);
		


		let profPic = document.createElement("img");
		profPic.className = "profile-picture";
		profPic.src = "https:".concat(response.result.photoUrl);
		profPic.referrerPolicy = "no-referrer";
		profPic.onload = () => {
			class_header.insertBefore(profPic, class_header.firstChild);
			class_header.style.display = "flex";
			// courseBox.style.display = "block";
		}
	});
}
	
