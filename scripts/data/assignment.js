const courses = [
  {
    name: "Designing Interactive Systems",
    instructor: {
      name: "Grace Eden",
      profileImageURL: "assets/vp.png"
    },
    assignments: [
      {
        title: "Pecha Kucha",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 10)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      },
      {
        title: "Final Presentation",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 5)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      },
      {
        title: "Paper Presentation",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 3)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      }
    ]
  },
  {
    name: "Prototyping Interactive Systems",
    instructor: {
      name: "Richa Gupta",
      profileImageURL: "assets/vp.png"
    },
    assignments: [
      {
        title: "Assignment 4: Arduino",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 10)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      },
      {
        title: "Assignment 5: Arduino",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 10)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      }
    ]
  },
  {
    name: "Database Management Systems",
    instructor: {
      name: "C. Anantaram",
      profileImageURL: "assets/vp.png"
    },
    assignments: [
      {
        title: "Final Project",
        dueDate: new Date(new Date().setDate(new Date().getDay() + 10)),
        assignedDate: new Date(new Date().setDate(new Date().getDay() - 10))
      }
    ]
  }
];
