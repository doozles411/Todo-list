import { manageData } from './storage';
import { format } from 'date-fns';

export const changeDOM = (() => {

    function renderProjectList(todos, listContainer) {

        const projectContainer = document.querySelector('.projects-list');
        projectContainer.innerHTML = '';

        const projectsObject = Object.assign({}, todos);
        delete projectsObject.all;
        delete projectsObject.today;
        delete projectsObject.week;

        for (const project in projectsObject) {

            const projectItem = document.createElement('div');
            projectItem.classList.add('projects-item');

            const projectTitle = document.createElement('button');
            projectTitle.classList.add('projects-name');
            projectTitle.textContent = project;
            projectTitle.addEventListener('click', e => manageTodosRender(e, todos, listContainer));
            projectTitle.addEventListener('click', e => highlightSelectedFilter(e));

            let uncheckedTodos = 0;
            projectsObject[project].forEach(todo => {
                if (!todo.checked) {
                    uncheckedTodos++;
                }
            });
            
            const projectCounter = document.createElement('p');
            projectCounter.classList.add('projects-counter');
            projectCounter.textContent = uncheckedTodos;

            projectItem.appendChild(projectTitle);
            projectItem.appendChild(projectCounter);
            projectContainer.appendChild(projectItem);

            if (manageData.getSelectedProject() === project) {
                highlightReloadedFilter(project);
            } else if (manageData.getSelectedProject() === 'all') {
                highlightReloadedFilter('all');
            } else if (manageData.getSelectedProject() === 'today') {
                highlightReloadedFilter('today');
            } else if (manageData.getSelectedProject() === 'week') {
                highlightReloadedFilter('week');
            } else {
                highlightReloadedFilter('all');
            }
        };
        
        let allUncheckedTodos = 0;
        for (const todoList in todos) {
            todos[todoList].forEach(todo => {
                if (!todo.checked) {
                    allUncheckedTodos++;
                }
            })
        };
        const allCount = document.querySelector('.all');
        allCount.textContent = allUncheckedTodos;

        let todayUncheckedTodos;
        todayUncheckedTodos = todos.today.reduce((total, value) => {
            return total + !value.checked;
        }, 0);
        const projectsObjectTwo = Object.assign({}, todos);
        delete projectsObjectTwo.today;
        for (const projectTwo in projectsObjectTwo) {
            projectsObjectTwo[projectTwo].forEach(todo => {
                    const today = new Date();
                    const todoDate = new Date(todo.dueDate);
                    if (
                        today.getDate() === todoDate.getDate() &&
                        today.getMonth() === todoDate.getMonth() &&
                        today.getFullYear() === todoDate.getFullYear()
                    ) {
                        if (!todo.checked) {
                            todayUncheckedTodos++;
                        }
                    }
            });
        }
        const todayCount = document.querySelector('.today');
        todayCount.textContent = todayUncheckedTodos;

        let weekUncheckedTodos;
        weekUncheckedTodos = todos.week.reduce((total, value) => {
            return total + !value.checked;
        }, 0);
        const projectsObjectThree = Object.assign({}, todos);
        delete projectsObjectThree.week;
        for (const projectThree in projectsObjectThree) {
            projectsObjectThree[projectThree].forEach(todo => {
                const today = new Date();
                const todoDate = new Date(todo.dueDate);
                const msDifference = Math.abs(today.getTime() - todoDate.getTime());
                const dayDifference = msDifference / (24*60*60*1000);
                if (dayDifference <= 7) {
                    if (!todo.checked) {
                        weekUncheckedTodos++;
                    }
                }
            });
        }
        const weekCount = document.querySelector('.week');
        weekCount.textContent = weekUncheckedTodos;
    }

    function highlightSelectedFilter(e) {

        const filterBtns = document.querySelectorAll('.filters-btn');
        const projectBtns = document.querySelectorAll('.projects-name');

        filterBtns.forEach(item => {
            item.classList.remove('clicked');
        });

        projectBtns.forEach(item => {
            item.classList.remove('clicked');
        });

        e.target.classList.add('clicked');
    }

    function highlightReloadedFilter(projectName) {

        const filterBtns = document.querySelectorAll('.filters-btn');
        const projectBtns = document.querySelectorAll('.projects-name');

        filterBtns.forEach(item => {
            item.classList.remove('clicked');
        });

        projectBtns.forEach(item => {
            item.classList.remove('clicked');
        });

        filterBtns.forEach(btn => {
            if (projectName === 'all' && btn.classList.contains('all-btn')) {
                btn.classList.add('clicked');
            } else if (projectName === 'today' && btn.classList.contains('today-btn')) {
                btn.classList.add('clicked');
            } else if (projectName === 'week' && btn.classList.contains('week-btn')) {
                btn.classList.add('clicked');
            }
        });

        projectBtns.forEach(btn => {
            if (btn.textContent === projectName) {
                btn.classList.add('clicked');
            }
        });
    }

    function renderEmptyProject(e, todos, listContainer) {

        const contentContainer = document.getElementById('content');
        const emptyContainer = document.querySelector('.empty-project-card');
        const emptyExit = document.getElementById('empty-cancel');
        const emptyTitle = document.querySelector('.empty-name');
        const emptyAdd = document.querySelector('.empty-add');
        const deleteProject = document.querySelector('.empty-delete');
        const allBtn = document.querySelector('.all-btn');
        const addNewCard = document.querySelector('.add-new-card');
        const addNewDate = document.getElementById('new-date');
        const dateObject = new Date();
        const month = format(dateObject, 'MM');
        const day = format(dateObject, 'dd');
        const year = format(dateObject, 'yyyy');
        const currentDay = `${year}-${month}-${day}`;
        
        emptyTitle.innerHTML = '';
        emptyTitle.textContent = manageData.getSelectedProject();
        
        emptyContainer.style.visibility = 'visible';
        contentContainer.classList.add('blur');

        emptyExit.addEventListener('click', () => {
            renderAllTodos(todos, listContainer);
            manageData.setSelectedProject('all');
            highlightReloadedFilter('all');
            emptyContainer.style.visibility = 'hidden';
            contentContainer.classList.remove('blur');
        });

        emptyAdd.addEventListener('click', () => {
            addNewDate.setAttribute('value', currentDay);
            emptyContainer.style.visibility = 'hidden';
            addNewCard.style.visibility = 'visible';
        });

        deleteProject.addEventListener('click', () => {
            delete todos[manageData.getSelectedProject()];
            localStorage.setItem('todos', JSON.stringify(todos));
            renderProjectList(todos, listContainer);
            manageData.setSelectedProject('all');
            renderAllTodos(todos, listContainer);
            allBtn.classList.add('clicked');
            emptyContainer.style.visibility = 'hidden';
            contentContainer.classList.remove('blur');
        });
    }

    function manageTodosRender(e, todos, listContainer) {

        if (e.target.textContent === 'All') {
            manageData.setSelectedProject('all');
            renderAllTodos(todos, listContainer);
            highlightSelectedFilter(e);
        } else if (e.target.textContent === 'Today') {
            manageData.setSelectedProject('today');
            renderTodayTodos(todos, listContainer);
            highlightSelectedFilter(e);
        } else if (e.target.textContent === 'This week') {
            manageData.setSelectedProject('week');
            renderWeekTodos(todos, listContainer);
            highlightSelectedFilter(e);
        } else {
            manageData.setSelectedProject(e.target.textContent);

            let projectLength = todos[manageData.getSelectedProject()].length;

            todos[manageData.getSelectedProject()].forEach(todo => {
                if (todo.checked) {
                    projectLength--;
                }
            });

            if (projectLength < 1) {
                renderEmptyProject(e, todos, listContainer);
            } else {
                renderProjectTodos(todos, listContainer);
                highlightSelectedFilter(e);
            }
        }
    }

    function renderAllTodos(todos, listContainer) {

        listContainer.innerHTML = '';

        for (const project in todos) {

            todos[project].forEach((todo, i) => {

                const todoItem = document.createElement('div');
                todoItem.classList.add('list-item');
                todoItem.classList.add(`${todo.priority}-priority`);
                todoItem.setAttribute('data-index', i);
                todoItem.setAttribute('data-project', `${todo.project}`);

                const itemLeft = document.createElement('div');
                itemLeft.classList.add('item-left');

                const checkboxIcon = document.createElement('i');
                checkboxIcon.classList.add('fa-regular', 'fa-square');
                checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));
                
                const itemName = document.createElement('p');
                itemName.classList.add('item-description');
                itemName.textContent = todo.title;
                itemLeft.appendChild(checkboxIcon);
                itemLeft.appendChild(itemName);
             
                const itemRight = document.createElement('div');
                itemRight.classList.add('item-right');
               
                const notesBtn = document.createElement('button');
                notesBtn.classList.add('item-notes');
                notesBtn.textContent = 'NOTES';
                notesBtn.addEventListener('click', e => renderNotesCard(e, todos[project]));
             
                const dateText = document.createElement('p');
                dateText.classList.add('item-date');
                const dateObject = new Date(todo.dueDate);
                const month = format(dateObject, 'MMM');
                const day = format(dateObject, 'do');
                dateText.textContent = `${month} ${day}`;
             
                const editIcon = document.createElement('i');
                editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
          
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                itemRight.appendChild(notesBtn);
                itemRight.appendChild(dateText);
                itemRight.appendChild(editIcon);
                itemRight.appendChild(deleteIcon);
                todoItem.appendChild(itemLeft);
                todoItem.appendChild(itemRight);

                if (todo.checked) {
                    toggleTodoReload(todoItem);
                };
              
                listContainer.appendChild(todoItem);
            });
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodayTodos(todos, listContainer) {

        listContainer.innerHTML = '';

        for (const project in todos) {
            
            if (project !== 'today') {
                
                todos[project].forEach((todo, i) => {
                    
                    const today = new Date();
                    const todoDate = new Date(todo.dueDate);

                    if (
                        !todo.checked &&
                        today.getDate() === todoDate.getDate() &&
                        today.getMonth() === todoDate.getMonth() &&
                        today.getFullYear() === todoDate.getFullYear()
                    ) {
                        const todoItem = document.createElement('div');
                        todoItem.classList.add('list-item');
                        todoItem.classList.add(`${todo.priority}-priority`);
                        todoItem.setAttribute('data-index', i);
                        todoItem.setAttribute('data-project', `${todo.project}`);

                        const itemLeft = document.createElement('div');
                        itemLeft.classList.add('item-left');

                        const checkboxIcon = document.createElement('i');
                        checkboxIcon.classList.add('fa-regular', 'fa-square');
                        checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));

                        const itemName = document.createElement('p');
                        itemName.classList.add('item-description');
                        itemName.textContent = todo.title;
                        itemLeft.appendChild(checkboxIcon);
                        itemLeft.appendChild(itemName);

                        const itemRight = document.createElement('div');
                        itemRight.classList.add('item-right');

                        const notesBtn = document.createElement('button');
                        notesBtn.classList.add('item-notes');
                        notesBtn.textContent = 'NOTES';
                        notesBtn.addEventListener('click', e => renderNotesCard(e, todos[project]));

                        const dateText = document.createElement('p');
                        dateText.classList.add('item-date');
                        const dateObject = new Date(todo.dueDate);
                        const month = format(dateObject, 'MMM');
                        const day = format(dateObject, 'do');
                        dateText.textContent = `${month} ${day}`;

                        const editIcon = document.createElement('i');
                        editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                        editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
                
                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                        deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                        itemRight.appendChild(notesBtn);
                        itemRight.appendChild(dateText);
                        itemRight.appendChild(editIcon);
                        itemRight.appendChild(deleteIcon);
                        todoItem.appendChild(itemLeft);
                        todoItem.appendChild(itemRight);
                        listContainer.appendChild(todoItem);
                    }
                });
            }
        }

        const todoList = todos[manageData.getSelectedProject()];

        if (todoList.length === 0) {
            return;
        }

        todoList.forEach((todo, i) => {

            if (!todo.checked) {

                const todoItem = document.createElement('div');
                todoItem.classList.add('list-item');
                todoItem.classList.add(`${todo.priority}-priority`);
                todoItem.setAttribute('data-index', i);
                todoItem.setAttribute('data-project', `${todo.project}`);

                const itemLeft = document.createElement('div');
                itemLeft.classList.add('item-left');

                const checkboxIcon = document.createElement('i');
                checkboxIcon.classList.add('fa-regular', 'fa-square');
                checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));

                const itemName = document.createElement('p');
                itemName.classList.add('item-description');
                itemName.textContent = todo.title;
                itemLeft.appendChild(checkboxIcon);
                itemLeft.appendChild(itemName);

                const itemRight = document.createElement('div');
                itemRight.classList.add('item-right');

                const notesBtn = document.createElement('button');
                notesBtn.classList.add('item-notes');
                notesBtn.textContent = 'NOTES';
                notesBtn.addEventListener('click', e => renderNotesCard(e, todoList));

                const dateText = document.createElement('p');
                dateText.classList.add('item-date');
                const dateObject = new Date(todo.dueDate);
                const month = format(dateObject, 'MMM');
                const day = format(dateObject, 'do');
                dateText.textContent = `${month} ${day}`;

                const editIcon = document.createElement('i');
                editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
          
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                itemRight.appendChild(notesBtn);
                itemRight.appendChild(dateText);
                itemRight.appendChild(editIcon);
                itemRight.appendChild(deleteIcon);
                todoItem.appendChild(itemLeft);
                todoItem.appendChild(itemRight);
                listContainer.appendChild(todoItem);
            }
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderWeekTodos(todos, listContainer) {
        
        listContainer.innerHTML = '';

        for (const project in todos) {
            
            if (project !== 'week') {

                todos[project].forEach((todo, i) => {

                    const today = new Date();
                    const todoDate = new Date(todo.dueDate);
                    const msDifference = Math.abs(today.getTime() - todoDate.getTime());
                    const dayDifference = msDifference / (24*60*60*1000);

                    if (!todo.checked && dayDifference <= 7) {

                        const todoItem = document.createElement('div');
                        todoItem.classList.add('list-item');
                        todoItem.classList.add(`${todo.priority}-priority`);
                        todoItem.setAttribute('data-index', i);
                        todoItem.setAttribute('data-project', `${todo.project}`);

                        const itemLeft = document.createElement('div');
                        itemLeft.classList.add('item-left');

                        const checkboxIcon = document.createElement('i');
                        checkboxIcon.classList.add('fa-regular', 'fa-square');
                        checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));

                        const itemName = document.createElement('p');
                        itemName.classList.add('item-description');
                        itemName.textContent = todo.title;
                        itemLeft.appendChild(checkboxIcon);
                        itemLeft.appendChild(itemName);

                        const itemRight = document.createElement('div');
                        itemRight.classList.add('item-right');

                        const notesBtn = document.createElement('button');
                        notesBtn.classList.add('item-notes');
                        notesBtn.textContent = 'NOTES';
                        notesBtn.addEventListener('click', e => renderNotesCard(e, todos[project]));

                        const dateText = document.createElement('p');
                        dateText.classList.add('item-date');
                        const dateObject = new Date(todo.dueDate);
                        const month = format(dateObject, 'MMM');
                        const day = format(dateObject, 'do');
                        dateText.textContent = `${month} ${day}`;

                        const editIcon = document.createElement('i');
                        editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                        editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
                
                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                        deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                        itemRight.appendChild(notesBtn);
                        itemRight.appendChild(dateText);
                        itemRight.appendChild(editIcon);
                        itemRight.appendChild(deleteIcon);
                        todoItem.appendChild(itemLeft);
                        todoItem.appendChild(itemRight);
                        listContainer.appendChild(todoItem);
                    }
                });
            }
        }

        const todoList = todos[manageData.getSelectedProject()];

        if (todoList.length === 0) {
            return;
        }

        todoList.forEach((todo, i) => {

            if (!todo.checked) {

                const todoItem = document.createElement('div');
                todoItem.classList.add('list-item');
                todoItem.classList.add(`${todo.priority}-priority`);
                todoItem.setAttribute('data-index', i);
                todoItem.setAttribute('data-project', `${todo.project}`);

                const itemLeft = document.createElement('div');
                itemLeft.classList.add('item-left');

                const checkboxIcon = document.createElement('i');
                checkboxIcon.classList.add('fa-regular', 'fa-square');
                checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));

                const itemName = document.createElement('p');
                itemName.classList.add('item-description');
                itemName.textContent = todo.title;
                itemLeft.appendChild(checkboxIcon);
                itemLeft.appendChild(itemName);

                const itemRight = document.createElement('div');
                itemRight.classList.add('item-right');

                const notesBtn = document.createElement('button');
                notesBtn.classList.add('item-notes');
                notesBtn.textContent = 'NOTES';
                notesBtn.addEventListener('click', e => renderNotesCard(e, todoList));

                const dateText = document.createElement('p');
                dateText.classList.add('item-date');
                const dateObject = new Date(todo.dueDate);
                const month = format(dateObject, 'MMM');
                const day = format(dateObject, 'do');
                dateText.textContent = `${month} ${day}`;

                const editIcon = document.createElement('i');
                editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
          
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                itemRight.appendChild(notesBtn);
                itemRight.appendChild(dateText);
                itemRight.appendChild(editIcon);
                itemRight.appendChild(deleteIcon);
                todoItem.appendChild(itemLeft);
                todoItem.appendChild(itemRight);
                listContainer.appendChild(todoItem);
            }
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderProjectTodos(todos, listContainer) {
        
        const todoList = todos[manageData.getSelectedProject()];
        
        listContainer.innerHTML = '';

        if (todoList.length === 0) {
            return;
        }

        todoList.forEach((todo, i) => {

            if (!todo.checked) {

                const todoItem = document.createElement('div');
                todoItem.classList.add('list-item');
                todoItem.classList.add(`${todo.priority}-priority`);
                todoItem.setAttribute('data-index', i);
                todoItem.setAttribute('data-project', `${todo.project}`);

                const itemLeft = document.createElement('div');
                itemLeft.classList.add('item-left');

                const checkboxIcon = document.createElement('i');
                checkboxIcon.classList.add('fa-regular', 'fa-square');
                checkboxIcon.addEventListener('click', e => toggleTodoCheckbox(e, todos, listContainer));

                const itemName = document.createElement('p');
                itemName.classList.add('item-description');
                itemName.textContent = todo.title;
                itemLeft.appendChild(checkboxIcon);
                itemLeft.appendChild(itemName);

                const itemRight = document.createElement('div');
                itemRight.classList.add('item-right');

                const notesBtn = document.createElement('button');
                notesBtn.classList.add('item-notes');
                notesBtn.textContent = 'NOTES';
                notesBtn.addEventListener('click', e => renderNotesCard(e, todoList));

                const dateText = document.createElement('p');
                dateText.classList.add('item-date');
                const dateObject = new Date(todo.dueDate);
                const month = format(dateObject, 'MMM');
                const day = format(dateObject, 'do');
                dateText.textContent = `${month} ${day}`;

                const editIcon = document.createElement('i');
                editIcon.classList.add('fa-solid', 'fa-pen-to-square');
                editIcon.addEventListener('click', e => renderEditCard(e, todos[project]));
          
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa-solid', 'fa-trash-can');
                deleteIcon.addEventListener('click', e => manageData.deleteTodo(e, todos, listContainer));
                itemRight.appendChild(notesBtn);
                itemRight.appendChild(dateText);
                itemRight.appendChild(editIcon);
                itemRight.appendChild(deleteIcon);
                todoItem.appendChild(itemLeft);
                todoItem.appendChild(itemRight);
                listContainer.appendChild(todoItem);
            }
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function toggleTodoCheckbox(e, todos, listContainer) {

        const checkedTodo = e.target.parentElement.parentElement;
        const checkbox = e.target;

        checkbox.classList.toggle('fa-square');
        checkbox.classList.toggle('fa-square-check');
        
        const todoItems = checkedTodo.children;
        const itemsLeft = todoItems[0];
        const itemsRight = todoItems[1];
        const itemTitle = itemsLeft.children[1];
        const itemNotes = itemsRight.children[0];
        const itemDate = itemsRight.children[1];
        const itemEdit = itemsRight.children[2];

        itemTitle.classList.toggle('selected');
        itemTitle.classList.toggle('strike');
        itemNotes.classList.toggle('done');
        itemDate.classList.toggle('selected');
        itemEdit.classList.toggle('selected');
        
        const item = checkedTodo.dataset.index;
        const project = checkedTodo.dataset.project;
        todos[project][item].checked = !todos[project][item].checked;

        localStorage.setItem('todos', JSON.stringify(todos));
        
        renderProjectList(todos, listContainer);
    }

    function toggleTodoReload(todoItem) {
    
        const todoItems = todoItem.children;
        const itemsLeft = todoItems[0];
        const itemsRight = todoItems[1];
        const checkbox = itemsLeft.children[0];
        const itemTitle = itemsLeft.children[1];
        const itemNotes = itemsRight.children[0];
        const itemDate = itemsRight.children[1];
        const itemEdit = itemsRight.children[2]; 
       
        checkbox.classList.remove('fa-square');
        checkbox.classList.add('fa-square-check');
        itemTitle.classList.toggle('selected');
        itemTitle.classList.toggle('strike');
        itemNotes.classList.toggle('done');
        itemDate.classList.toggle('selected');
        itemEdit.classList.toggle('selected');
    }

    function renderNotesCard(e, todos) {
        
        const item = e.target.parentElement.parentElement.dataset.index;
        const notesCard = document.querySelector('.notes-card');
        const notesTitle = document.querySelector('.notes-header');
        const notesProject = document.querySelector('.notes-todo');
        const notesDueDate = document.querySelector('.notes-date');
        const notesPriority = document.querySelector('.notes-priority');
        const notesDetails = document.querySelector('.notes-details');
        const contentContainer = document.getElementById('content');
        
        notesTitle.innerHTML = '';
        notesProject.innerHTML = '';
        notesDueDate.innerHTML = '';
        notesPriority.innerHTML = '';
        notesDetails.innerHTML = '';

        const day = format(new Date(todos[item].dueDate), 'do');
        const month = format(new Date(todos[item].dueDate), 'MMM');
        const year = format(new Date(todos[item].dueDate), 'yyyy');
        notesDueDate.textContent = `${month} ${day}, ${year}`;

        notesTitle.textContent = todos[item].title;
        notesProject.textContent = todos[item].project;
        notesPriority.textContent = todos[item].priority[0].toUpperCase() + todos[item].priority.slice(1);
        notesDetails.textContent = todos[item].details;

        notesCard.style.visibility = 'visible';
        contentContainer.classList.add('blur');
    }

    function renderEditCard(e, todos) {

        const item = e.target.parentElement.parentElement.dataset.index;
        const project = e.target.parentElement.parentElement.dataset.project;

        const editCard = document.querySelector('.edit-card');
        const editTitle = document.querySelector('.edit-name');
        const editDetails = document.querySelector('.edit-details');
        const editDueDate = document.getElementById('edit-date');
        const editPriorityLow = document.getElementById('edit-low-label');
        const editPriorityMedium = document.getElementById('edit-medium-label');
        const editPriorityHigh = document.getElementById('edit-high-label');
        const editLow = document.getElementById('edit-low');
        const editMedium = document.getElementById('edit-medium');
        const editHigh = document.getElementById('edit-high');
        const contentContainer = document.getElementById('content');

        editTitle.dataset.index = item;
        editTitle.dataset.project = project;

        editTitle.innerHTML = '';
        editDetails.innerHTML = '';

        editTitle.textContent = todos[item].title;
        editDetails.textContent = todos[item].details;

        const dateObject = new Date(todos[item].dueDate);
        const month = format(dateObject, 'MM');
        const day = format(dateObject, 'dd');
        const year = format(dateObject, 'yyyy');
        const currentDay = `${year}-${month}-${day}`;

        editDueDate.removeAttribute('value');
        editDueDate.setAttribute('value', currentDay);

        if (editPriorityLow.classList.contains('low-checked')) {
            editPriorityLow.classList.remove('low-checked');
            editPriorityLow.classList.add('low');
        }
        if (editPriorityMedium.classList.contains('medium-checked')) {
            editPriorityMedium.classList.remove('medium-checked');
            editPriorityMedium.classList.add('medium');
        }
        if (editPriorityHigh.classList.contains('high-checked')) {
            editPriorityHigh.classList.remove('high-checked');
            editPriorityHigh.classList.add('high');
        }

        if (todos[item].priority === 'low') {
            editLow.checked = true;
            editPriorityLow.classList.remove('low');
            editPriorityLow.classList.add('low-checked');
        } else if (todos[item].priority === 'medium') {
            editMedium.checked = true;
            editPriorityMedium.classList.remove('medium');
            editPriorityMedium.classList.add('medium-checked');
        } else if (todos[item].priority === 'high') {
            editHigh.checked = true;
            editPriorityHigh.classList.remove('high');
            editPriorityHigh.classList.add('high-checked');
        }

        editCard.style.visibility = 'visible';
        contentContainer.classList.add('blur');

        editLow.addEventListener('click', () => {
            if (editPriorityLow.classList.contains('low')) {
                editPriorityLow.classList.remove('low');
                editPriorityLow.classList.add('low-checked');
            }
            if (editPriorityMedium.classList.contains('medium-checked')) {
                editPriorityMedium.classList.remove('medium-checked');
                editPriorityMedium.classList.add('medium');
            }
            if (editPriorityHigh.classList.contains('high-checked')) {
                editPriorityHigh.classList.remove('high-checked');
                editPriorityHigh.classList.add('high');
            }
        });

        editMedium.addEventListener('click', () => {
            if (editPriorityLow.classList.contains('low-checked')) {
                editPriorityLow.classList.remove('low-checked');
                editPriorityLow.classList.add('low');
            }
            if (editPriorityMedium.classList.contains('medium')) {
                editPriorityMedium.classList.remove('medium');
                editPriorityMedium.classList.add('medium-checked');
            }
            if (editPriorityHigh.classList.contains('high-checked')) {
                editPriorityHigh.classList.remove('high-checked');
                editPriorityHigh.classList.add('high');
            }
        });

        editHigh.addEventListener('click', () => {
            if (editPriorityLow.classList.contains('low-checked')) {
                editPriorityLow.classList.remove('low-checked');
                editPriorityLow.classList.add('low');
            }
            if (editPriorityMedium.classList.contains('medium-checked')) {
                editPriorityMedium.classList.remove('medium-checked');
                editPriorityMedium.classList.add('medium');
            }
            if (editPriorityHigh.classList.contains('high')) {
                editPriorityHigh.classList.remove('high');
                editPriorityHigh.classList.add('high-checked');
            }
        });
    }

    return {
        renderProjectList,
        highlightSelectedFilter,
        highlightReloadedFilter,
        renderEmptyProject,
        manageTodosRender,
        renderAllTodos,
        renderTodayTodos,
        renderWeekTodos,
        renderProjectTodos,
        toggleTodoCheckbox,
        toggleTodoReload,
        renderNotesCard,
        renderEditCard
    };
})();