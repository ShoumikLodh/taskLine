// const signIn=document.getElementById('sign-in-button');
async function fetchCourseWork(course, courseDiv) {
	var response;
	try {
		response = await gapi.client.classroom.courses.courseWork.list({
		"courseId": course.id,
		"courseWorkStates": [
			"PUBLISHED"
		],
		"orderBy": "dueDate desc",
		"pageSize": 3
		});	

	}
	catch(err) {
		console.error("execute error in task fetch", err);
	}

	var deadlinesInRange = {
		1: [], 
		2: [],
		3: [],
		4: [] };

	return (await getTasks());
		
	function getTasks() {
		return new Promise(function (resolve, reject) {
			if (Object.keys(response.result).length === 0) {
				reject(new Error(`No deadlines in the course: ${course.name}`));
			}
			else {
				response.result.courseWork.forEach(async (assignment) => {

					let taskDiv = document.createElement('div');
					taskDiv.setAttribute("data-range", "-1");
					taskDiv.setAttribute("data-id", assignment.id);
					taskDiv.style.border = "1px red solid";
					taskDiv.className = "task-item";
					// console.log(courseDiv);
					// courseDiv.appendChild(taskDiv);


					let remainingPercent = await getDuePercentage(assignment)
					.then(arg => arg.toFixed(2));

					let isSubmitted = await checkSubmissionStatus(assignment);

					if (remainingPercent !== -1 && !isSubmitted) {
						taskDiv.innerHTML = assignment.title.substring(0, 35) + "...";
						assignment.percentage = remainingPercent;
						courseDiv.appendChild(taskDiv);

					}
					switch (true) {
						case (remainingPercent >= 75 && remainingPercent < 100):
							deadlinesInRange[1].push(assignment);
							taskDiv.dataset.range = 1;
							break;
						case (remainingPercent >= 50 && remainingPercent < 75):
							deadlinesInRange[2].push(assignment);
							taskDiv.dataset.range = 2;
							break;
						case (remainingPercent >= 25 && remainingPercent < 50):
							deadlinesInRange[3].push(assignment);
							taskDiv.dataset.range = 3;
							break;
						case (remainingPercent > 0 && remainingPercent < 25):
							deadlinesInRange[4].push(assignment);
							taskDiv.dataset.range = 4;
							addNotifs(taskDiv);
							break;
					}
					// console.log(taskDiv);


				});
			}
			// console.log(deadlinesInRange);
			resolve(deadlinesInRange);

		});
	}
}




function getDuePercentage(assignment) {
	return new Promise(resolve => {

		let creationTime = new Date(assignment.creationTime).valueOf();
		creationTime = Math.round(creationTime/1000);

		let currentTime = new Date().valueOf();	
		currentTime = Math.round(currentTime/1000);
		
		let year = assignment.dueDate.year, month = assignment.dueDate.month, 
		date = assignment.dueDate.day, hours = assignment.dueTime.hours, 
		minutes = assignment.dueTime.minutes; 
		if (minutes === undefined)	minutes = 0;
		
		let dueTime = new Date(year, month - 1, date, hours, minutes).valueOf();
		dueTime = Math.round(dueTime/1000);
		
		if (currentTime > dueTime)
		return -1;
		
		let totalDeadlineTime = dueTime - creationTime;
		let timeElapsed = currentTime - creationTime;
		
		let percentage = (timeElapsed / totalDeadlineTime) * 100;
		resolve(100-percentage);
	});
	// return 100 - percentage;
	
}
//#endregion
function checkSubmissionStatus(task) {
	// console.log(task);

	try {
		return gapi.client.classroom.courses.courseWork.studentSubmissions.list({
			"courseId" : task.courseId,
			"courseWorkId": task.id,
			// "userId": "me",
			"states": ["TURNED_IN"],
			"pageSize": 2
		})
		.then(response => {
			if (Object.keys(response.result).length > 0 )
				return true;
			else
				return false;
		});
	}
	catch (err) {
		console.error("Student Submission fetch error", err);
	}
		// console.log(response.result.studentSubmissions);
		// console.log(Object.keys(response.result).length);
	// 	if (Object.keys(response.result).length > 0 )
	// 		return true;
	// 	else
	// 		return false;
	// }
}

function showCourseView(taskList) {
	// const newList = convertDict(taskList);
	// console.log(newList);
	// console.log(JSON.stringify(taskList));
	// localStorage.setItem("newList", JSON.stringify(taskList));
	
	//handle courses
	let allCourseDivs = document.getElementsByClassName('classroom-box');
	allCourseDivs.forEach(courseDiv => {

		courseDiv.onclick = () => {
			// let backButtonPressed = false;
			let courses = document.getElementsByClassName("classroom-box");
			for (let i = 0; i < courses.length; i++) {
				
				if (courses[i] === courseDiv) continue;
				courses[i].classList.add("classroom-box--hidden");
				// console.log(courses[i]);
			}
			let backButton = document.createElement('button');
    // backButton=document.getElementById("taskline-logo");
			backButton.setAttribute("id", "back-to-home-button");
			backButton.innerHTML = `Home`;
			backButton.className = "buttons";
			document.body.appendChild(backButton);
			
			backButton.onclick = () => {
			
				backToHomeView(courseDiv);
				let butt = document.getElementById("back-to-course");
				if (butt !== null) butt.innerHTML = "";
				document.body.removeChild(backButton);
			}
			handleTaskClick(taskList, courseDiv, backButton);
			
		}
	});
}

function handleTaskClick(taskList, courseDiv, backButton) {
	// handle tasks
	let alltasksDiv = courseDiv.getElementsByClassName('task-item');
	alltasksDiv.forEach(taskDiv => {
		taskDiv.onclick = () => {
			document.body.removeChild(backButton);

			let tasks = document.getElementsByClassName("task-item");
			for (let i = 0; i < tasks.length; i++) {
				if (tasks[i] === taskDiv) continue;
				tasks[i].classList.add("task-item--hidden");
			}
			
			getTaskDetails(taskList, taskDiv.dataset.id)
			.then(task => {  displayTask(task);   });


			//create back button
			let backToCourseButton = document.createElement('button');
			//backToCourseButton.id="back-to-course";
			backToCourseButton.className = "buttons";
			backToCourseButton.innerHTML = "Back";
			 backToCourseButton.setAttribute("id", "back-to-course");

			document.body.appendChild(backToCourseButton);

			backToCourseButton.onclick = () => {
				backToCourseView(courseDiv);
				document.body.removeChild(backToCourseButton);
			}

		
		
		}

		
	});
}

function backToHomeView(courseDiv) {
	let alltasksDiv = courseDiv.getElementsByClassName('task-item');
	alltasksDiv.forEach(taskDiv => {
		taskDiv.onclick = null;
	});
	
	let allCourseDivs = document.getElementsByClassName('classroom-box');
	allCourseDivs.forEach(courseDiv => { 
		if (courseDiv.classList.contains("classroom-box--hidden"))
			courseDiv.classList.remove("classroom-box--hidden");		
	});
}


function backToCourseView(courseDiv) {
	let alltasksDiv = courseDiv.getElementsByClassName('task-item');
	alltasksDiv.forEach(taskDiv => {
		if (taskDiv.classList.contains("task-item--hidden"))
		taskDiv.classList.remove("task-item--hidden");	
	});	

	let taskDetailsDiv = document.querySelector('.task-details-div');
	// console.log(taskDetailsDiv);
	document.body.removeChild(taskDetailsDiv);
}
