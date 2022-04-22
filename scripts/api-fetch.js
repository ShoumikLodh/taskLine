function execute() {
    return gapi.client.classroom.courses.list({
      "courseStates": [
        "ACTIVE"
      ]
    })
        .then(function(response) {
                response.result.courses.forEach(course => {
                let course_div = document.createElement("div");
                course_div.className = "course-title-box";        
                
                let course_title = document.createElement("h3");
                course_title.className = "course-title-item";
                course_title.innerHTML = course.name;
                
                
                document.body.appendChild(course_div);
                course_div.appendChild(course_title);

                let prof_pic = addInstructorInfo(course.ownerId, course_div);
              });
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result.courses);
              },
              function(err) { console.error("Execute error", err); });
  }


  function addInstructorInfo(teacher_id, courseDiv) {
    var request = gapi.client.classroom.userProfiles.get(
      {
        'userId': teacher_id
      })
      .then(function(response) {
        console.log(response);
        let picUrl = response.result.photoUrl;
        
        let profName = document.createElement('p');
        profName.className = "course-prof";
        profName.innerHTML = response.result.name.fullName;

        // courseDiv.insertBefore(createImg(picUrl), courseDiv.firstChild);
        courseDiv.appendChild(profName);

      });
  }
  /* 
  function createImg(url) {
    let prof_pic = document.createElement('img');
    prof_pic.style.height = '20px';
    prof_pic.style.width = '20px';
    prof_pic.src = url;
    return prof_pic; 
  }
   */
  