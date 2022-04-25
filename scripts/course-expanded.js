function getCourseWork(course, courseDiv) {
    return gapi.client.classroom.courses.courseWork.list({
      "courseId": course.id,
      "courseWorkStates": [
        "PUBLISHED"
      ],
      "orderBy": "dueDate desc",
      "pageSize": 3
    })
	.then(function(response) {
		deadlinesInRange = {1: [], 
							2: [],
							3: [],
							4: []};


		return new Promise(function(resolve, reject) {
			if ( Object.keys(response.result).length === 0 ) {
				reject(new Error("No deadlines in the given course"));
			} 
			else {
				resolve();
				response.result.courseWork.forEach((assignment) => {
				console.log(assignment);
				let taskDiv = document.createElement('div');
				courseDiv.appendChild(taskDiv);

				let deadline = document.createElement('p');
				deadline.innerHTML = assignment.title;
				taskDiv.appendChild(deadline);

				remainingPercent = getDuePercentage(assignment);
				switch(remainingPercent) {
					case (remainingPercent > 75):
						deadlinesInRange[1].push(assignment);
						deadline.dataset.range = '1';
						break;
					case (remainingPercent >= 50 && remainingPercent < 75):
						deadlinesInRange[2].push(assignment);	
						deadline.dataset.range = '2';
						break;
					case (remainingPercent >= 25 && remainingPercent < 50):
						deadlinesInRange[3].push(assignment);
						deadline.dataset.range = '3';
						break;
					case (remainingPercent < 25):
						deadlinesInRange[4].push(assignment);
						deadline.dataset.range = '4';
						break;
					default: 
						console.log("Incorrect percentage range given for courseWork");
				}


				});
			}
		});
	},
	function(err) { console.error("Execute error", err); }
	);
  }


function getDuePercentage(assignment) {
	let creationTime = new Date(assignment.creationTime).valueOf();
	creationTime = Math.round(creationTime/1000);

	let currentTime = new Date().valueOf();	
	currentTime = Math.round(currentTime/1000);

	let year = assignment.dueDate.year, 
	month = assignment.dueDate.month, 
	date = assignment.dueDate.day, 
	hours = assignment.dueTime.hours, 
	minutes = assignment.dueTime.minutes; 
	const dueTime = new Date(year, month, date, hours, minutes, 0).valueOf();
	dueTime = Math.round(dueTime/1000);

	totalDeadlineTime = dueTime - creationTime;
	timeElapsed = currentTime - creationTime;

	percentage = (timeElapsed / totalDeadlineTime) * 100;
	return 100 - percentage;

}
