document.addEventListener('DOMContentLoaded', function() {
  let signInButton = document.querySelector('#sign-in-button');
  signInButton.onclick = () => {
    authenticate()
        .then(loadClient).then(execute).then( () => {
          signInButton.onclick = handleAuthClick;

        });

  }
});



function execute() {
    return gapi.client.classroom.courses.list({
      "courseStates": [
        "ACTIVE"
      ]
    })
        .then(function(response) {
          response.result.courses.forEach(course => {
              
              let course_div = addCourseBoxItem(course);

              getCourseWork(course, course_div).then(() => {
                addInstructorInfo(course.ownerId, course_div);
              })
              .catch(err => {
                console.log(err.message);
                document.body.removeChild(course_div);
              }) ;

            });
          },
          function(err) { console.error("Execute error", err); 
        });
}

function addCourseBoxItem(course) {
  let course_div = document.createElement("div");
  course_div.className = "course-title-box";
  course_div.style.display = "none";

  let course_title = document.createElement("h3");
  course_title.className = "course-title-item";
  course_title.innerHTML = course.name;


  document.body.appendChild(course_div);
  course_div.appendChild(course_title);
  return course_div;
}

function addInstructorInfo(teacher_id, courseDiv) {
  return gapi.client.classroom.userProfiles.get(
    {
      'userId': teacher_id
    })
    .then(function(response) {
        let profName = document.createElement('p');
        profName.className = "course-prof-item";
        profName.innerHTML = response.result.name.fullName;
        courseDiv.appendChild(profName);
        
        createImg(response, courseDiv);
    });
}
  
function createImg(response, courseDiv) {
  let profPic = document.createElement("img");
  profPic.className = "course-prof-pic-item";
  profPic.style.height = '30px';
  profPic.style.width = '30px';
  profPic.src = "https:".concat(response.result.photoUrl);
  
  profPic.onload = () => {
    courseDiv.insertBefore(profPic, courseDiv.firstChild);
    courseDiv.style.display = "block";
  }
}


  
  