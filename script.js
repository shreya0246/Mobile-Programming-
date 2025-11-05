function nextStep(nextId) {
  document.querySelectorAll('.screen').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(nextId).classList.remove('hidden');
}

function selectRole(role) {
  localStorage.setItem('userRole', role);
  if (role === 'student') {
    window.location.href = 'student.html';
  } else {
    window.location.href = 'teacher_profile.html';
  }
}
