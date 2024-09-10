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
        <td id="taskDesc-${task._id}">${task.tDesc}</td>
        <td id="taskStatus-${task._id}">${task.tStatus.charAt(0).toUpperCase() + task.tStatus.slice(1)}</td>
        <td id="taskAssignedTo-${task._id}">${task.tAssignedTo.join(', ')}</td>
        <td>${new Date(task.tCreatedOn).toLocaleDateString()}</td>
        <td class="project-actions text-right">
          <button class="btn btn-info btn-sm edit-button" data-id="${task._id}"><i class="fas fa-pencil-alt"></i> Edit</button>
          <button class="btn btn-danger btn-sm delete-button" data-id="${task._id}"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.closest('button').dataset.id;
        await deleteTask(taskId);
        fetchTasks(currentPage); // Refresh task list after deletion
      });
    });

    // Add event listeners for edit buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const taskId = e.target.dataset.id;
        enableEditing(taskId);
      });
    });
  };

  const enableEditing = (taskId) => {
    const descCell = document.getElementById(`taskDesc-${taskId}`);
    const statusCell = document.getElementById(`taskStatus-${taskId}`);
    const assignedToCell = document.getElementById(`taskAssignedTo-${taskId}`);

    // Store current values to revert if canceled
    const originalDesc = descCell.textContent;
    const originalStatus = statusCell.textContent;
    const originalAssignedTo = assignedToCell.textContent;

    // Convert description to editable input
    descCell.innerHTML = `<input type="text" class="form-control" value="${originalDesc}" id="editDesc-${taskId}">`;

    // Convert status to a dropdown
    statusCell.innerHTML = `
      <select class="form-control" id="editStatus-${taskId}">
        <option value="pending">Pending</option>
        <option value="working">Working</option>
        <option value="onhold">Onhold</option>
        <option value="completed">Completed</option>
      </select>
    `;
    document.getElementById(`editStatus-${taskId}`).value = originalStatus.toLowerCase();

    // Convert assignedTo to a multiselect dropdown
    assignedToCell.innerHTML = `
      <select multiple class="form-control" id="editAssignedTo-${taskId}">
      </select>
    `;

    // Populate users in assignedTo select box
    populateAssignedToSelect().then(users => {
      const assignedToSelect = document.getElementById(`editAssignedTo-${taskId}`);
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.fullName;
        assignedToSelect.appendChild(option);
      });

      // Preselect the already assigned users
      originalAssignedTo.split(', ').forEach(assignedUser => {
        [...assignedToSelect.options].forEach(option => {
          if (option.textContent === assignedUser) {
            option.selected = true;
          }
        });
      });
    });

    // Replace the Edit button with Save and Cancel buttons
    const actionCell = descCell.parentElement.querySelector('.project-actions');
    actionCell.innerHTML = `
      <button class="btn btn-success btn-sm save-button" data-id="${taskId}">Save</button>
      <button class="btn btn-secondary btn-sm cancel-button" data-id="${taskId}">Cancel</button>
    `;

    // Save event listener
    actionCell.querySelector('.save-button').addEventListener('click', async () => {
      const updatedDesc = document.getElementById(`editDesc-${taskId}`).value;
      const updatedStatus = document.getElementById(`editStatus-${taskId}`).value;
      const updatedAssignedTo = [...document.getElementById(`editAssignedTo-${taskId}`).selectedOptions].map(option => option.value);

      const updateData = {
        tDesc: updatedDesc,
        tStatus: updatedStatus,
        tAssignedTo: updatedAssignedTo
      };

      try {
        const response = await fetch(`http://172.16.2.6:4000/edit/task/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          // Fetch updated task data and update the row
          const updatedTask = await response.json();
          descCell.textContent = updatedTask.tDesc;
          statusCell.textContent = updatedTask.tStatus.charAt(0).toUpperCase() + updatedTask.tStatus.slice(1);
          assignedToCell.textContent = updatedTask.tAssignedTo.join(', ');

          // Revert action buttons back to Edit and Delete
          actionCell.innerHTML = `
            <button class="btn btn-info btn-sm edit-button" data-id="${taskId}"><i class="fas fa-pencil-alt"></i> Edit</button>
            <button class="btn btn-danger btn-sm delete-button" data-id="${taskId}"><i class="fas fa-trash-alt"></i> Delete</button>
          `;
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task.');
      }
    });

    // Cancel event listener
    actionCell.querySelector('.cancel-button').addEventListener('click', () => {
      descCell.textContent = originalDesc;
      statusCell.textContent = originalStatus;
      assignedToCell.textContent = originalAssignedTo;

      // Revert action buttons back to Edit and Delete
      actionCell.innerHTML = `
        <button class="btn btn-info btn-sm edit-button" data-id="${taskId}"><i class="fas fa-pencil-alt"></i> Edit</button>
        <button class="btn btn-danger btn-sm delete-button" data-id="${taskId}"><i class="fas fa-trash-alt"></i> Delete</button>
      `;
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
      alert('Task Deleted successfully.');
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

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = i;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        fetchTasks(i);
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

  // Helper function to populate assigned to select box
  const populateAssignedToSelect = async () => {
    try {
      const response = await fetch('http://172.16.2.6:4000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Initial fetch
  fetchTasks();
});


