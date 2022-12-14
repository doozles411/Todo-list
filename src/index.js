import { changeDOM } from "./DOM";
import { manageData } from "./storage";
import { format } from 'date-fns';

// All content container
const contentContainer = document.getElementById('content');
// Hamburger menu
const hamburgerMenu = document.querySelector('.fa-bars');
// Dashboard
const dashboard = document.querySelector('.dashboard');
// Filter buttons
const filterBtns = document.querySelectorAll('.filters-btn');
// Add-new button
const addNew = document.querySelector('.projects-btn');
// Todos list container
const listContainer = document.querySelector('.list');
// Popup card buttons
    // Add-new card
const addNewCard = document.querySelector('.add-new-card');
const addExit = document.querySelector('#add-exit');
const addTodoBtn = document.querySelector('.add-btn-todo');
const addTodoForm = document.querySelector('.add-todo-form');
const addProject = document.querySelector('.add-btn-project');
const addProjectForm = document.querySelector('.add-project-form');
const addDate = document.getElementById('new-date');
const addLowPriority = document.getElementById('new-low');
const addMediumPriority = document.getElementById('new-medium');
const addHighPriority = document.getElementById('new-high');
const addLow = document.querySelector('.low');
const addMedium = document.querySelector('.medium');
const addHigh = document.querySelector('.high');
    // Notes card
const notesCard = document.querySelector('.notes-card');
const notesExit = document.querySelector('#notes-exit');
    // Edit card
const editCard = document.querySelector('.edit-card');
const editExit = document.querySelector('#edit-exit');
const editSubmit = document.querySelector('.edit-form');

const todos = JSON.parse(localStorage.getItem('todos')) || {
    'all': [],
    'today': [],
    'week': [],
    'Kitchen renovation': []
};

const dateObject = new Date();
const month = format(dateObject, 'MM');
const day = format(dateObject, 'dd');
const year = format(dateObject, 'yyyy');
const today = `${month}-${day}-${year}`;
const weekPast = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() - 7);
const weekAgoMonth = format(weekPast, 'MM');
const weekAgoDay = format(weekPast, 'dd');
const weekAgoYear = format(weekPast, 'yyyy');
const weekAgo = `${weekAgoMonth}-${weekAgoDay}-${weekAgoYear}`;
const weekFuture = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() + 5);
const weekFutureMonth = format(weekFuture, 'MM');
const weekFutureDay = format(weekFuture, 'dd');
const weekFutureYear = format(weekFuture, 'yyyy');
const weekNext = `${weekFutureMonth}-${weekFutureDay}-${weekFutureYear}`;
const monthFuture = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() + 32);
const monthFutureMonth = format(monthFuture, 'MM');
const monthFutureDay = format(monthFuture, 'dd');
const monthFutureYear = format(monthFuture, 'yyyy');
const monthNext = `${monthFutureMonth}-${monthFutureDay}-${monthFutureYear}`;

if (!localStorage.getItem('todos')) {
    todos['Kitchen renovation'].push(manageData.createTodo('Remove vinyl floor', 'replace with subfloor', weekNext, 'high', 'Kitchen renovation'));
    todos['Kitchen renovation'].push(manageData.createTodo('Build cabinets', 'pre-painted cabinets only', weekAgo, 'low', 'Kitchen renovation', true));
    todos['Kitchen renovation'].push(manageData.createTodo('Install countertop', 'leave room for butcher block', monthNext, 'medium', 'Kitchen renovation'));
    todos.all.push(manageData.createTodo('Finish book for book club', 'let Angela borrow afterward', today, 'high', 'all'));
};

changeDOM.renderAllTodos(todos, listContainer);
changeDOM.renderProjectList(todos, listContainer);

filterBtns.forEach(btn => {
    btn.addEventListener('click', e => changeDOM.manageTodosRender(e, todos, listContainer));
});

hamburgerMenu.addEventListener('click', () => {
    dashboard.style.visibility = dashboard.style.visibility === 'hidden' ? 'visible' : 'hidden';
});

const currentDay = `${year}-${month}-${day}`;

addNew.addEventListener('click', () => {
    contentContainer.classList.add('blur');
    addNewCard.style.visibility = 'visible';
    addDate.setAttribute('value', currentDay);
});

addExit.addEventListener('click', () => {
    addNewCard.style.visibility = 'hidden';
    addNewCard.classList.remove('enter');
    addNewCard.classList.add('exit');
    contentContainer.classList.remove('blur');
    addTodoForm.reset();
    addProjectForm.reset();
    addTodoBtn.classList.add('clicked');
    addTodoForm.style.display = 'grid';
    addProject.classList.remove('clicked');
    addProjectForm.style.display = 'none';
    addDate.removeAttribute('value');
});

addTodoBtn.addEventListener('click', () => {
    addTodoBtn.classList.add('clicked');
    addTodoForm.style.display = 'grid';
    addProject.classList.remove('clicked');
    addProjectForm.style.display = 'none';
});

addProject.addEventListener('click', () => {
    addProject.classList.add('clicked');
    addProjectForm.style.display = 'grid';
    addTodoBtn.classList.remove('clicked');
    addTodoForm.style.display = 'none';
});

addLowPriority.addEventListener('click', () => {
    if (addLow.classList.contains('low')) {
        addLow.classList.remove('low');
        addLow.classList.add('low-checked');
    }
    if (addMedium.classList.contains('medium-checked')) {
        addMedium.classList.remove('medium-checked');
        addMedium.classList.add('medium');
    }
    if (addHigh.classList.contains('high-checked')) {
        addHigh.classList.remove('high-checked');
        addHigh.classList.add('high');
    }
});

addMediumPriority.addEventListener('click', () => {
    if (addLow.classList.contains('low-checked')) {
        addLow.classList.remove('low-checked');
        addLow.classList.add('low');
    }
    if (addMedium.classList.contains('medium')) {
        addMedium.classList.remove('medium');
        addMedium.classList.add('medium-checked');
    }
    if (addHigh.classList.contains('high-checked')) {
        addHigh.classList.remove('high-checked');
        addHigh.classList.add('high');
    }
});

addHighPriority.addEventListener('click', () => {
    if (addLow.classList.contains('low-checked')) {
        addLow.classList.remove('low-checked');
        addLow.classList.add('low');
    }
    if (addMedium.classList.contains('medium-checked')) {
        addMedium.classList.remove('medium-checked');
        addMedium.classList.add('medium');
    }
    if (addHigh.classList.contains('high')) {
        addHigh.classList.remove('high');
        addHigh.classList.add('high-checked');
    }
});

addTodoForm.addEventListener('submit', e => {
    manageData.addTodo(e, todos, listContainer);
    addNewCard.style.visibility = 'hidden';
    contentContainer.classList.remove('blur');
    addTodoForm.reset();
    addProjectForm.reset();
    addDate.removeAttribute('value');
});

addProjectForm.addEventListener('submit', e => {
    manageData.addProject(e, todos, listContainer);
    addNewCard.style.visibility = 'hidden';
    contentContainer.classList.remove('blur');
    addTodoForm.reset();
    addProjectForm.reset();
    addTodoBtn.classList.add('clicked');
    addTodoForm.style.display = 'grid';
    addProject.classList.remove('clicked');
    addProjectForm.style.display = 'none';
    addDate.removeAttribute('value');
});

notesExit.addEventListener('click', () => {
    notesCard.style.visibility = 'hidden';
    contentContainer.classList.remove('blur');
});

editExit.addEventListener('click', () => {
    editCard.style.visibility = 'hidden';
    contentContainer.classList.remove('blur');
});

editSubmit.addEventListener('submit', e => {
    manageData.editTodo(e, todos, listContainer);
    editCard.style.visibility = 'hidden';
    contentContainer.classList.remove('blur');
});