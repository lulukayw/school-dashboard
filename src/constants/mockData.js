//Mock data - to be replaced with firestore fetches

//Student Collection
export const MOCK_STUDENTS = [
    { id: "s1", name: "John James", birthday: "2012-03-15" },
    { id: "s2", name: "Greg James", birthday: "2013-06-22" },
    { id: "s3", name: "Bob James", birthday: "2012-11-08" },
    { id: "s4", name: "Maria Smith", birthday: "2013-01-30" },
    { id: "s5", name: "Alex Johnson", birthday: "2012-09-14" },
  ];

  
//Teachers Collection
export const MOCK_TEACHERS = [
    { id: "t1", name: "Ms. Thompson" },
    { id: "t2", name: "Mr. Rivera" },
    { id: "t3", name: "Mrs. Patel" },
    { id: "t4", name: "Mr. Chen" },
  ];

//Current logged-in user, auth in future if needed
export const MOCK_USER = {
    displayName: "Admin User",
    email: "admin@tjschool.edu",
  };

//Mock class
export const MOCK_CLASSES = [
    {
      id: "c1",
      name: "Class 1",
      subject: "English",
      room: "Room 100",
      teacherId: "t1",
      students: { s1: 92, s2: 85, s3: 78 },
    },
    {
      id: "c2",
      name: "Class 2",
      subject: "Spanish",
      room: "Room 200",
      teacherId: "t2",
      students: { s2: 88, s4: 95 },
    },
    {
      id: "c3",
      name: "Class 3",
      subject: "Math",
      room: "Room 300",
      teacherId: "t3",
      students: { s1: 91, s3: 74, s5: 83 },
    },
    {
      id: "c4",
      name: "Class 4",
      subject: "Science",
      room: "Room 400",
      teacherId: "t4",
      students: { s4: 89, s5: 96 },
    },
  ];

//Mock Events
export const MOCK_EVENTS = [
    { id: "e1", title: "Parent Teacher Conference", date: "2026-05-27" },
    { id: "e2", title: "Teachers Meeting", date: "2026-06-03" },
    { id: "e3", title: "Summer Training", date: "2026-06-10" },
  ];
