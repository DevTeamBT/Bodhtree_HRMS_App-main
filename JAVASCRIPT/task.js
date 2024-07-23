document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const tasksPerPage = 10;

  const fetchTasks = async (page = 1) => {
    try {
      const response = await fetch(`http://172.16.2.6:4000/tasks?page=${page}&limit=${tasksPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      populateTaskTable(data.tasks, page, tasksPerPage);
      setupPagination(data.totalPages, page);
      currentPage = page; // Update the current page
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please try again later.');
    }
  };

  const populateTaskTable = (tasks, currentPage, limit) => {
    const taskTableBody = document.getElementById('taskTableBody');
    taskTableBody.innerHTML = ''; // Clear existing rows

    tasks.forEach((task, index) => {
      const newRow = taskTableBody.insertRow();
      newRow.innerHTML = `
        <td>${(currentPage - 1) * limit + index + 1}</td>
        <td><a href="/HTML/comment.html?taskId=${task._id}">${task.tTitle}</a></td>
        <td>${task.tDesc}</td>
        <td>${task.tStatus.charAt(0).toUpperCase() + task.tStatus.slice(1)}</td>
        <td>${task.tAssignedTo.join(', ')}</td>
        <td>${new Date(task.tCreatedOn).toLocaleDateString()}</td>
        <td class="project-actions text-right">
          <button class="btn btn-info btn-sm edit-button" data-id="${task._id}"><i class="fas fa-pencil-alt"></i> Edit</button>
          <button class="btn btn-danger btn-sm delete-button" data-id="${task._id}"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.closest('button').dataset.id;
        await deleteTask(taskId);
        fetchTasks(currentPage); // Refresh task list after deletion
      });
    });

    // Add event listeners for edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.closest('button').dataset.id;
        const row = e.target.closest('tr');
        const task = tasks.find(t => t._id === taskId);
        editTask(row, task);
      });
    });
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://172.16.2.6:4000/task/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      alert('Task deleted successfully.');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task.');
    }
  };

  const setupPagination = (totalPages, currentPage) => {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = ''; // Clear existing buttons

    if (currentPage > 1) {
      const prevLi = document.createElement('li');
      prevLi.className = 'page-item';
      const prevA = document.createElement('a');
      prevA.className = 'page-link';
      prevA.href = '#';
      prevA.innerHTML = '&lt;';
      prevA.addEventListener('click', (e) => {
        e.preventDefault();
        fetchTasks(currentPage - 1);
      });
      prevLi.appendChild(prevA);
      paginationControls.appendChild(prevLi);
    }

    for (let page = 1; page <= totalPages; page++) {
      const li = document.createElement('li');
      li.className = `page-item ${page === currentPage ? 'active' : ''}`;
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = page;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        fetchTasks(page);
      });
      li.appendChild(a);
      paginationControls.appendChild(li);
    }

    if (currentPage < totalPages) {
      const nextLi = document.createElement('li');
      nextLi.className = 'page-item';
      const nextA = document.createElement('a');
      nextA.className = 'page-link';
      nextA.href = '#';
      nextA.innerHTML = '&gt;';
      nextA.addEventListener('click', (e) => {
        e.preventDefault();
        fetchTasks(currentPage + 1);
      });
      nextLi.appendChild(nextA);
      paginationControls.appendChild(nextLi);
    }
  };

  const populateAssignedToSelect = async () => {
    try {
      const response = await fetch('http://172.16.2.6:4000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again later.');
      return [];
    }
  };

  const editTask = async (row, task) => {
    // Clear existing content and create input fields for editing
    row.innerHTML = '';
  
    const cell1 = row.insertCell(0);
    cell1.textContent = row.rowIndex + 1;
  
    const cell2 = row.insertCell(1);
    cell2.textContent = task.tTitle; // Do not allow editing of task title
  
    const cell3 = row.insertCell(2);
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.className = 'form-control';
    descriptionInput.value = task.tDesc;
    cell3.appendChild(descriptionInput);
  
    const cell4 = row.insertCell(3);
    const statusSelect = document.createElement('select');
    statusSelect.className = 'form-control';
    ['pending', 'working', 'onhold', 'completed'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      if (status === task.tStatus) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    });
    cell4.appendChild(statusSelect);
  
    const cell5 = row.insertCell(4);
    const assignedToSelect = document.createElement('select');
    assignedToSelect.className = 'form-control';
    assignedToSelect.multiple = true;
  
    const users = await populateAssignedToSelect();
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user._id; // Assuming _id is used as value
      option.textContent = user.fullName;
      if (task.tAssignedTo.includes(user.fullName)) { // Check user.fullName instead of user._id
        option.selected = true;
      }
      assignedToSelect.appendChild(option);
    });
  
    cell5.appendChild(assignedToSelect);
  
    const cell6 = row.insertCell(5);
    const createdAtInput = document.createElement('input');
    createdAtInput.type = 'text';
    createdAtInput.className = 'form-control';
    createdAtInput.value = new Date().toLocaleDateString(); // Set to current date
    createdAtInput.disabled = true; // Make the creation date non-editable
    cell6.appendChild(createdAtInput);
  
    const cell7 = row.insertCell(6);
    const saveButton = document.createElement('button');
    saveButton.className = 'btn btn-primary btn-sm';
    saveButton.innerHTML = '<i class="fas fa-save"></i> Save';
    saveButton.addEventListener('click', async () => {
      const updatedTask = {
        tDesc: descriptionInput.value,
        tStatus: statusSelect.value,
        tAssignedTo: Array.from(assignedToSelect.selectedOptions).map(option => option.value),
        tCreatedOn: new Date().toISOString() // Update the creation date to current date
      };
  
      try {
        const response = await fetch(`http://localhost:4000/edit/task/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        if (!response.ok) {
          throw new Error('Failed to save task');
        }
        alert('Task updated successfully.');
        fetchTasks(currentPage); // Refresh task list after editing
      } catch (error) {
        console.error('Error saving task:', error);
        alert('Error saving task. Please try again later.');
      }
    });
  
    cell7.appendChild(saveButton);
  };
  
  const addTaskButton = document.getElementById('addTaskButton');
  addTaskButton.addEventListener('click', async () => {
    const taskTitle = document.getElementById('taskTitle').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskStatus = document.getElementById('taskStatus').value;
    const taskAssignedToSelect = document.getElementById('taskAssignedTo');
    const taskAssignedTo = Array.from(taskAssignedToSelect.selectedOptions).map(option => option.value);

    if (!taskTitle || !taskDescription) {
      alert('Please fill in all fields.');
      return;
    }

    const newTask = {
      tTitle: taskTitle,
      tDesc: taskDescription,
      tStatus: taskStatus,
      tAssignedTo: taskAssignedTo,
      tCreatedOn: new Date(),
    };

    try {
      const response = await fetch('http://172.16.2.6:4000/add/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      alert('Task added successfully.');
      fetchTasks(currentPage); // Refresh task list after adding
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task.');
    }
  });

  fetchTasks(); // Initial fetch on page load
});
