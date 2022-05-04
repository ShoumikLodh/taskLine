const signIn=document.getElementById('sign-in-button');
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
		console.error("Execute error", err);
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
				response.result.courseWork.forEach(assignment => {

					let taskDiv = document.createElement('div');
					taskDiv.setAttribute("data-range", "-1");
					taskDiv.setAttribute("data-id", assignment.id);
					taskDiv.style.border = "1px red solid";
					taskDiv.className = "task-item";
					// console.log(courseDiv);
					courseDiv.appendChild(taskDiv);


					remainingPercent = Math.round(getDuePercentage(assignment));
					if (remainingPercent !== -1) {
						taskDiv.innerHTML = assignment.title.substring(0, 35) + "...";
						assignment.percentage = remainingPercent;
					} else {
						courseDiv.removeChild(taskDiv);
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
							break;
					}

				});
			}
			resolve(deadlinesInRange);

		});
	}
}




function getDuePercentage(assignment) {
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
	return 100 - percentage;

}

function showCourseView(taskList) {

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
    //backButton=document.getElementById("taskline-logo");
			// backButton.setAttribute("id", "back-to-home-button");
			backButton.innerHTML = "Home Page";
			backButton.className = "buttons";
			
			document.body.appendChild(backButton);
			
			backButton.onclick = () => {
				backToHomeView(courseDiv);
				document.body.removeChild(backButton);
				// backButtonPressed = true;
			}
			// console.log(backButtonPressed);

			// if (backButtonPressed === true) return;
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
			
			getTaskDetails(taskList, taskDiv.dataset.id);


			//create back button
			let backToCourseButton = document.createElement('button');
			backToCourseButton.className = "buttons";
			backToCourseButton.innerHTML = "Back";
			// backToCourseButton.setAttribute("id", "back-to-course-button");
			//backToCourseButton.id="sign-in-button-red";
			//document.getElementById("navbar").removeChild();
			//document.getElementById("navbar").appendChild(signIn);
			// document.getElementById("navbar").appendChild(backToCourseButton);
			document.getElementById("back-and-home").appendChild(backToCourseButton);
			//document.body.appendChild(backToCourseButton);
			backToCourseButton.onclick = () => {
				backToCourseView(courseDiv);
				// homeButton[0].style.display = "block";
				// console.log(homeButton[0]);
				document.getElementById("back-and-home").removeChild(backToCourseButton);

				//document.body.removeChild(backToCourseButton);
			}

			/* document.addEventListener('DOMContentLoaded', () => {

				let homeButton = document.querySelectorAll(".buttons");
				// console.log(home);
				console.log(homeButton, homeButton[0]);
				homeButton[0].style.display = "none";
				
				
			
				
			}); */
		
		
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
