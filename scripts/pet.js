function findTaskDiffSinceLast() {
    // let firstTime = null;
    let newTasks = localStorage.getItem("newList");
    let oldTasks = localStorage.getItem("oldList");
    console.log(JSON.parse(newTasks));


    if (oldTasks === null) {
        // firstTime = true;
        localStorage.setItem("oldList", newTasks);
        localStorage.setItem("newList" , null);
        return;
    }
    // let oldList = localStorage.ge
    var newList = JSON.parse(newTasks);
    var oldList = JSON.parse(oldTasks);
    // console.log(newList);
    
    // for (var courseID in oldList) {
    //     let ranges = oldList[courseID];
    //     for (var val in ranges) {
    //         if (ranges[val].length === 0)	
    //             continue;

    //         ranges[val].forEach(task => {
    //             if (task.id === taskId) {
    //                 // resolve(task);
    //             }
    //         });
    //     }
    // }
    

    // let oldList = 
}


function addNotifs(task) {


    let notifList = document.querySelector("#notifications");
    let list_item = document.createElement('li');
    list_item.className = "notifications-element";
    notifList.appendChild(list_item);
    list_item.innerHTML = `Deadline for <span class="notifications-course-title">${task.innerHTML}</span>   is nearing.`;

}