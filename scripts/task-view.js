
async function getTaskDetails(taskList, taskId) {
	let response = await new Promise(resolve => {
		for (var key in taskList) {
			let ranges = taskList[key];
			for (var val in ranges) {
				if (ranges[val].length === 0)	
					continue;
	
				ranges[val].forEach(task => {
					if (task.id === taskId) {
						resolve(task);
					}
				});
			}
		}
		
	});
	displayTask(response);
}


//change it to other html semantic
function displayTask(task) {
	// console.log(task);
	let details = document.createElement('div');
	details.className = "task-details-div";
	document.body.appendChild(details);

	let taskTitle = document.createElement('div');
	taskTitle.innerHTML = task.title;
	taskTitle.className="class-title"
	details.appendChild(taskTitle);
	details.appendChild(document.createElement('hr'));

	let dueDate = document.createElement('h4');
	let due = task.dueDate;
	dueDate.className="due-date";
	dueDate.innerHTML = "Due Date :  "+task.dueTime.hours +  ":" + task.dueTime.minutes + "  " +
			due.day + "/" + due.month + "/" + due.year;
	details.appendChild(dueDate);

	let updateTime = document.createElement('p');
	updateTime.className="update-time";
	updateTime.innerHTML = "Updated :  "+task.updateTime.substring(0,10);
	details.appendChild(updateTime);


	let desc = document.createElement('div');
	details.append(desc);
	desc.className = "task-description";	
	let about = document.createElement('p');
	about.innerHTML = task.description;
	desc.appendChild(about);


	getAttachments(details, task.materials);

	let classroomButton = document.createElement("button");
	classroomButton.innerHTML = "View in Classroom";
	classroomButton.id="sign-in-button";
	classroomButton.setAttribute("target", "_blank");
	details.appendChild(classroomButton);
	classroomButton.onclick = () => {
		window.open(task.alternateLink,'_blank');
		return false;
	}

} 

function getAttachments(details, array) {
	// array.forEach(num => {
	// 	let material = array[num];
	// })
	for (var num in array) {
		if (num === '4')  break;
		let material = array[num];
		// console.log(material);
		let attach = document.createElement('div');
		details.appendChild(attach);
		attach.className = "task-attachment-item";
		attach.style.width = "auto"; 
		// attach.style.display = "flex"; 


		var section;
		if (material.hasOwnProperty("driveFile")) {
			section = material.driveFile.driveFile;
		} else if (material.hasOwnProperty("link")) {
			section = material.link;
		}
		
		// let attachment = document.createElement('button');
		let thumbnail = document.createElement('img');
		thumbnail.src = section.thumbnailUrl; 
		thumbnail.referrerPolicy = "no-referrer";
		thumbnail.style.height = '60px';
		thumbnail.style.width = '60px';
		// attachment.appendChild(thumbnail);

		let title = document.createElement('span');
		title.innerHTML = section.title.substring(0,30);
		title.className="task-name";
		attach.appendChild(thumbnail);
		attach.appendChild(title);
		attach.onclick = () => {
			window.open(section.alternateLink,'_blank');
			return false;
		}

	}
}