/* ------------------------------
   COMMON FUNCTIONS
--------------------------------*/

// Navigate between screens in multi-step setup
function nextStep(nextId) {
  document.querySelectorAll('.screen').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(nextId).classList.remove('hidden');
}

// Select role and redirect
function selectRole(role) {
  localStorage.setItem('userRole', role);
  if (role === 'student') {
    window.location.href = 'student.html';
  } else {
    window.location.href = 'teacher_profile.html';
  }
}

// Common section navigation
function showSection(section) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  const target = document.getElementById(section + "Section");
  if (target) target.style.display = "block";
}

/* ------------------------------
   STUDENT DASHBOARD
--------------------------------*/
if (document.getElementById('teacherList')) {
  console.log("Student dashboard loaded");

  const homeLink = document.getElementById('homeLink');
  const profileLink = document.getElementById('profileLink');
  const teachersLink = document.getElementById('teachersLink');

  homeLink?.addEventListener('click', () => showSection('home'));
  profileLink?.addEventListener('click', () => showSection('profile'));
  teachersLink?.addEventListener('click', () => showSection('teachers'));

  const teacherList = document.getElementById('teacherList');
  const moreTeachers = document.getElementById('moreTeachers');

  const teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { name: "Alice Sharma", subjects: "Math, Physics", experience: 5, bio: "Passionate about simplifying complex topics." },
    { name: "Rahul Mehta", subjects: "English, History", experience: 3, bio: "Helps students improve communication skills." },
    { name: "Priya Karki", subjects: "Biology, Chemistry", experience: 4, bio: "Makes science fun and interactive." }
  ];

  function displayTeachers(listEl, arr) {
    listEl.innerHTML = '';
    arr.forEach(teacher => {
      const div = document.createElement('div');
      div.className = 'list-card';
      div.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" width="60">
        <div>
          <h3>${teacher.name}</h3>
          <p>Subjects: ${teacher.subjects} | Experience: ${teacher.experience} years</p>
          <p>Bio: ${teacher.bio}</p>
        </div>`;
      listEl.appendChild(div);
    });
  }

  displayTeachers(teacherList, teachers);
  if (moreTeachers) displayTeachers(moreTeachers, teachers);

  // Search bar functionality
  const searchBar = document.getElementById('searchBar');
  searchBar?.addEventListener('input', e => {
    const value = e.target.value.toLowerCase();
    const filtered = teachers.filter(t =>
      t.name.toLowerCase().includes(value) ||
      t.subjects.toLowerCase().includes(value)
    );
    displayTeachers(teacherList, filtered);
  });

  // Load student profile into dashboard
  function loadStudentProfile() {
    const studentProfile = JSON.parse(localStorage.getItem('studentProfile'));
    if (studentProfile) {
      document.getElementById('profileName').textContent = studentProfile.name || '';
      document.getElementById('profileEmail').textContent = studentProfile.email || '';
      document.getElementById('profilePhone').textContent = studentProfile.phone || '';
      document.getElementById('profileAddress').textContent = studentProfile.city || '';
      document.getElementById('profileSubjects').textContent = studentProfile.subjects || '';
      document.getElementById('profileBio').textContent = studentProfile.goals || '';
    }
  }

  loadStudentProfile();

  // Profile editing
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const profileView = document.getElementById('profileView');
  const profileEdit = document.getElementById('profileEdit');

  editProfileBtn?.addEventListener('click', () => {
    profileView.style.display = 'none';
    profileEdit.style.display = 'block';
    const studentProfile = JSON.parse(localStorage.getItem('studentProfile')) || {};
    document.getElementById('editName').value = studentProfile.name || '';
    document.getElementById('editEmail').value = studentProfile.email || '';
    document.getElementById('editPhone').value = studentProfile.phone || '';
    document.getElementById('editAddress').value = studentProfile.city || '';
    document.getElementById('editSubjects').value = studentProfile.subjects || '';
    document.getElementById('editBio').value = studentProfile.goals || '';
  });

  saveProfileBtn?.addEventListener('click', () => {
    const updated = {
      name: document.getElementById('editName').value,
      email: document.getElementById('editEmail').value,
      phone: document.getElementById('editPhone').value,
      city: document.getElementById('editAddress').value,
      subjects: document.getElementById('editSubjects').value,
      goals: document.getElementById('editBio').value
    };
    localStorage.setItem('studentProfile', JSON.stringify(updated));
    profileEdit.style.display = 'none';
    profileView.style.display = 'block';
    loadStudentProfile();
    alert("✅ Profile updated!");
  });

  cancelEditBtn?.addEventListener('click', () => {
    profileEdit.style.display = 'none';
    profileView.style.display = 'block';
  });
}

/* ------------------------------
   TEACHER DASHBOARD
--------------------------------*/
if (document.getElementById('studentList')) {
  console.log("Teacher dashboard loaded");

  const homeLink = document.getElementById('homeLink');
  const profileLink = document.getElementById('profileLink');
  const studentsLink = document.getElementById('studentsLink');

  homeLink?.addEventListener('click', () => showSection('home'));
  profileLink?.addEventListener('click', () => showSection('profile'));
  studentsLink?.addEventListener('click', () => showSection('students'));

  const studentList = document.getElementById('studentList');
  const moreStudents = document.getElementById('moreStudents');

  const students = JSON.parse(localStorage.getItem('students')) || [
    { name: "Sita Thapa", subjects: "Math, Physics", goals: "Improve problem-solving skills" },
    { name: "Arjun Basnet", subjects: "English, History", goals: "Enhance writing and grammar" },
    { name: "Mina Gurung", subjects: "Biology, Chemistry", goals: "Understand concepts better" }
  ];

  function displayStudents(listEl, arr) {
    listEl.innerHTML = '';
    arr.forEach(student => {
      const div = document.createElement('div');
      div.className = 'list-card';
      div.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" width="60">
        <div>
          <h3>${student.name}</h3>
          <p>Subjects: ${student.subjects} | Goals: ${student.goals}</p>
        </div>`;
      listEl.appendChild(div);
    });
  }

  displayStudents(studentList, students);
  if (moreStudents) displayStudents(moreStudents, students);

  // Search bar
  const searchBar = document.getElementById('searchBar');
  searchBar?.addEventListener('input', e => {
    const value = e.target.value.toLowerCase();
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(value) ||
      s.subjects.toLowerCase().includes(value)
    );
    displayStudents(studentList, filtered);
  });

  // Load teacher profile
  function loadTeacherProfile() {
    const data = JSON.parse(localStorage.getItem('teacherProfile'));
    if (!data) return;
    document.getElementById('profileName').textContent = data.name || '';
    document.getElementById('profileEmail').textContent = data.email || '';
    document.getElementById('profilePhone').textContent = data.phone || '';
    document.getElementById('profileAddress').textContent = data.address || '';
    document.getElementById('profileExperience').textContent = data.experience || '';
    document.getElementById('profileQualification').textContent = data.qualification || '';
    document.getElementById('profileSubjects').textContent = data.subjects || '';
    document.getElementById('profileGradeLevel').textContent = data.gradeLevel || '';
    document.getElementById('profileSkills').textContent = data.skills || '';
    document.getElementById('profileInterests').textContent = data.interests || '';
    document.getElementById('profilePreferredStudents').textContent = data.preferredStudents || '';
    document.getElementById('profileMode').textContent = data.mode || '';
    document.getElementById('profileBio').textContent = data.bio || '';
  }

  loadTeacherProfile();

  // Profile editing
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const profileView = document.getElementById('profileView');
  const profileEdit = document.getElementById('profileEdit');

  editProfileBtn?.addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem('teacherProfile'));
    if (!data) return;
    profileView.style.display = 'none';
    profileEdit.style.display = 'block';

    document.getElementById('editName').value = data.name || '';
    document.getElementById('editEmail').value = data.email || '';
    document.getElementById('editPhone').value = data.phone || '';
    document.getElementById('editAddress').value = data.address || '';
    document.getElementById('editExperience').value = data.experience || '';
    document.getElementById('editQualification').value = data.qualification || '';
    document.getElementById('editSubjects').value = data.subjects || '';
    document.getElementById('editGradeLevel').value = data.gradeLevel || '';
    document.getElementById('editSkills').value = data.skills || '';
    document.getElementById('editInterests').value = data.interests || '';
    document.getElementById('editPreferredStudents').value = data.preferredStudents || '';
    document.getElementById('editMode').value = data.mode || '';
    document.getElementById('editBio').value = data.bio || '';
  });

  saveProfileBtn?.addEventListener('click', () => {
    const updated = {
      name: document.getElementById('editName').value,
      email: document.getElementById('editEmail').value,
      phone: document.getElementById('editPhone').value,
      address: document.getElementById('editAddress').value,
      experience: document.getElementById('editExperience').value,
      qualification: document.getElementById('editQualification').value,
      subjects: document.getElementById('editSubjects').value,
      gradeLevel: document.getElementById('editGradeLevel').value,
      skills: document.getElementById('editSkills').value,
      interests: document.getElementById('editInterests').value,
      preferredStudents: document.getElementById('editPreferredStudents').value,
      mode: document.getElementById('editMode').value,
      bio: document.getElementById('editBio').value
    };
    localStorage.setItem('teacherProfile', JSON.stringify(updated));
    profileEdit.style.display = 'none';
    profileView.style.display = 'block';
    loadTeacherProfile();
    alert("✅ Profile updated!");
  });

  cancelEditBtn?.addEventListener('click', () => {
    profileEdit.style.display = 'none';
    profileView.style.display = 'block';
  });
}

/* ------------------------------
   COMMON CHAT LOGIC
--------------------------------*/
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn?.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (!msg || !chatMessages) return;
  const div = document.createElement('div');
  div.textContent = "You: " + msg;
  chatMessages.appendChild(div);

  setTimeout(() => {
    const reply = document.createElement('div');
    reply.textContent = "Reply: Thanks for reaching out!";
    chatMessages.appendChild(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);

  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* ------------------------------
   TEACHER PROFILE PAGE LOGIC
--------------------------------*/
if (document.getElementById('teacherForm')) {
  console.log("Teacher Profile page loaded");

  const saveBtn = document.getElementById('saveTeacherProfileBtn');

  saveBtn.addEventListener('click', () => {
    const teacherData = {
      name: document.getElementById('teacherName').value.trim(),
      email: document.getElementById('teacherEmail').value.trim(),
      phone: document.getElementById('teacherPhone').value.trim(),
      address: document.getElementById('teacherAddress').value.trim(),
      experience: document.getElementById('teacherExperience').value.trim(),
      qualification: document.getElementById('teacherQualification').value.trim(),
      subjects: document.getElementById('teacherSubjects').value.trim(),
      gradeLevel: document.getElementById('teacherGradeLevel').value.trim(),
      skills: document.getElementById('teacherSkills').value.trim(),
      interests: document.getElementById('teacherInterests').value.trim(),
      preferredStudents: document.getElementById('teacherPreferredStudents').value.trim(),
      mode: document.getElementById('teacherMode').value.trim(),
      bio: document.getElementById('teacherBio').value.trim()
    };
    localStorage.setItem('teacherProfile', JSON.stringify(teacherData));
    alert("✅ Profile saved successfully!");
    window.location.href = "teacher_dashboard.html"; // Redirect to dashboard
  });
}

/* ------------------------------
   RESET TEST DATA
--------------------------------*/
function resetData() {
  localStorage.removeItem('teachers');
  localStorage.removeItem('students');
  localStorage.removeItem('teacherProfile');
  localStorage.removeItem('studentProfile');
  alert("✅ Test profiles cleared!");
  location.reload();
}

const resetBtn = document.getElementById('resetData');
resetBtn?.addEventListener('click', resetData);
