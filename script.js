let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

const calendarView = document.getElementById('calendar-view');
const currentMonthDisplay = document.getElementById('current-month');
const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const titleInput = document.getElementById('event-title');
const timeInput = document.getElementById('event-time');
const descInput = document.getElementById('event-description');
const categoryInput = document.getElementById('event-category');
const recurrenceInput = document.getElementById('event-recurrence');
const deleteBtn = document.getElementById('delete-event');
const closeModalBtn = document.getElementById('close-modal');
const themeSwitch = document.getElementById('theme-switch');

let selectedDate = null;
let editingEventIndex = null;

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarView.innerHTML = '';
  currentMonthDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarView.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayBox = document.createElement('div');
    dayBox.className = 'day';
    if (isToday(year, month, day)) dayBox.classList.add('today');
    dayBox.innerHTML = `<strong>${day}</strong>`;

    const dayEvents = events.filter(ev => ev.date === dateStr);
    dayEvents.forEach((ev, index) => {
      const marker = document.createElement('div');
      marker.className = 'event-marker';
      marker.style.setProperty('--event-color', getCategoryColor(ev.category));
      marker.innerHTML = `<span>${ev.title}</span><button onclick="deleteEvent(${events.indexOf(ev)})">&times;</button>`;
      dayBox.appendChild(marker);
    });

    dayBox.addEventListener('click', () => openEventModal(dateStr));
    calendarView.appendChild(dayBox);
  }
}

function isToday(y, m, d) {
  const today = new Date();
  return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
}

function openEventModal(date) {
  selectedDate = date;
  editingEventIndex = null;
  titleInput.value = '';
  timeInput.value = '';
  descInput.value = '';
  categoryInput.value = 'work';
  recurrenceInput.value = 'none';
  eventModal.classList.remove('hidden');
}

function closeEventModal() {
  eventModal.classList.add('hidden');
}

function saveEvent(e) {
  e.preventDefault();
  const newEvent = {
    title: titleInput.value.trim(),
    time: timeInput.value,
    description: descInput.value,
    category: categoryInput.value,
    recurrence: recurrenceInput.value,
    date: selectedDate
  };
  if (!newEvent.title) return alert('Title is required');

  events.push(newEvent);
  localStorage.setItem('calendarEvents', JSON.stringify(events));
  renderCalendar();
  closeEventModal();
}

function deleteEvent(index) {
  if (confirm('Delete this event?')) {
    events.splice(index, 1);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    renderCalendar();
  }
}

function getCategoryColor(category) {
  switch (category) {
    case 'work': return '#007bff';
    case 'personal': return '#28a745';
    case 'holiday': return '#ffc107';
    default: return '#6c757d';
  }
}

// Navigation
document.getElementById('prev-month').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById('next-month').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

eventForm.addEventListener('submit', saveEvent);
closeModalBtn.addEventListener('click', closeEventModal);
deleteBtn.addEventListener('click', () => {
  if (editingEventIndex !== null) {
    deleteEvent(editingEventIndex);
    closeEventModal();
  }
});

// Dark/Light Mode
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

renderCalendar();
