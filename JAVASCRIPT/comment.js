document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    console.log('Task ID:', taskId);  // Check the value of taskId
    let currentPage = 1;
    const tasksPerPage = 10;

    if (!taskId) {
        console.error('Task ID is missing');
        alert('Task ID is missing from the URL');
        return; // Stop further execution if taskId is missing
    }

    const fetchTaskDetails = async (taskId) => {
        try {
            if (!taskId) {
                throw new Error('Task ID is required');
            }
            
            const response = await fetch(`http://172.16.2.6:4000/task/${taskId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch task details: ${response.statusText}`);
            }
            
            const task = await response.json();
            
            if (!task) {
                throw new Error('No task data received');
            }
            
            const taskTitleElement = document.getElementById('taskTitle');
            const taskDescElement = document.getElementById('taskDesc');
    
            if (taskTitleElement && taskDescElement) {
                taskTitleElement.innerText = task.tTitle || 'No Title Available';
                taskDescElement.innerText = task.tDesc || 'No Description Available';
            } else {
                console.error('Element(s) with id "taskTitle" or "taskDesc" not found');
            }
        } catch (error) {
            console.error('Error fetching task details:', error);
            
            // Optionally update the UI to reflect the error
            const taskTitleElement = document.getElementById('taskTitle');
            const taskDescElement = document.getElementById('taskDesc');
            
            if (taskTitleElement && taskDescElement) {
                taskTitleElement.innerText = 'Error fetching task title';
                taskDescElement.innerText = 'Error fetching task description';
            }
        }
    };
    

    const fetchComments = async (page = 1) => {
        try {
            const response = await fetch(`http://172.16.2.6:4000/comments/${taskId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const comments = await response.json();
            
            console.log('Fetched comments:', comments);
            
            const commentsList = document.getElementById('commentsTable').getElementsByTagName('tbody')[0];
            
            if (commentsList) {
                commentsList.innerHTML = ''; // Clear existing comments only if the element exists
                
                comments.forEach((comment, index) => {
                    const row = commentsList.insertRow();
                    
                    const cell1 = row.insertCell(0);
                    cell1.textContent = index + 1;
    
                    const cell2 = row.insertCell(1);
                    cell2.textContent = comment.tComments;
    
                    const cell3 = row.insertCell(2);
                    cell3.textContent = comment.tcAssignedTo;
    
                    const cell4 = row.insertCell(3);
                    const options = { timeZone: 'Asia/Kolkata' };
                    const formattedDate = new Date(comment.tcCreatedOn).toLocaleString('en-IN', options);
                    cell4.textContent = formattedDate;
                });
            } else {
                console.error('Element with id "commentsTable" or tbody not found');
            }
            
            // Ensure these are valid before invoking
            if (comments.tasks && comments.totalPages) {
                populateTaskTable(comments.tasks, page, tasksPerPage);
                setupPagination(comments.totalPages, page);
                currentPage = page; // Update the current page
            } else {
                console.warn('No tasks or pagination info found in comments response');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
   

    const populateTaskTable = (comments, currentPage, limit) => {
        const taskTableBody = document.getElementById('taskTableBody');
        taskTableBody.innerHTML = ''; // Clear existing rows
    
        comments.forEach((comments, index) => {
          const newRow = commentsTableBody.insertRow();
          newRow.innerHTML = `
            <td>${(currentPage - 1) * limit + index + 1}</td>
            <td>${comments.tComments}</td>
            <td>${comments.tcAssignedTo}</td>
            <td>${new Date(comments.tcCreatedOn).toLocaleDateString()}</td>
            <td class="project-actions text-right">
              <a class="btn btn-info btn-sm" href="#"><i class="fas fa-pencil-alt"></i> Edit</a>
              <a class="btn btn-danger btn-sm" href="#"><i class="fas fa-trash-alt"></i> Delete</a>
            </td>
          `;
        });
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
    
    //   const populateAssignedToSelect = async () => {
    //     try {
    //       const response = await fetch('http://http://172.16.2.6:4000/api/users');
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch users');
    //       }
    //       const users = await response.json();
    //       return users;
    //     } catch (error) {
    //       console.error('Error fetching users:', error);
    //       alert('Failed to fetch users. Please try again later.');
    //       return [];
    //     }
    //   }; 

    // Task ID should be fetched from the URL or defined properly
// const taskId = new URLSearchParams(window.location.search).get('taskId');

// Add comment form submission
const addCommentForm = document.getElementById('addCommentForm');
addCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const commentText = document.getElementById('commentText').value.trim();
    const commentedBy = document.getElementById('commentedBy').value.trim();

    // Validation check
    if (!commentText || !commentedBy) {
        alert('Comment and commenter name are required');
        return;
    }

    try {
        // Data for comment
        const comment = {
            tComments: commentText,
            tcAssignedTo: commentedBy,
            tcCreatedOn: new Date().toISOString()
        };

        // POST request to add comment
        const response = await fetch(`http://172.16.2.6:4000/add/comments/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        console.log('Comment added successfully');
        document.getElementById('commentText').value = '';
        document.getElementById('commentedBy').value = '';

        // Optionally refresh comments after adding
        fetchComments();
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again later.');
    }
});

// Handle adding a new comment row dynamically
document.getElementById('addCommentButton').addEventListener('click', function() {
    const commentsTable = document.getElementById('commentsTable').getElementsByTagName('tbody')[0];

    // Create a new row for adding a comment
    const newRow = commentsTable.insertRow();

    // S No cell
    const cell1 = newRow.insertCell(0);
    cell1.textContent = commentsTable.rows.length + 1;

    // Comment input cell
    const cell2 = newRow.insertCell(1);
    const commentText = document.createElement('input');
    commentText.type = 'text';
    commentText.className = 'form-control';
    commentText.placeholder = 'Enter your comment';
    cell2.appendChild(commentText);

    // Commented by cell
    const cell3 = newRow.insertCell(2);
    const commentedBy = document.createElement('input');
    commentedBy.type = 'text';
    commentedBy.className = 'form-control';
    commentedBy.placeholder = 'Enter your name';
    cell3.appendChild(commentedBy);

    // Date cell
    const cell4 = newRow.insertCell(3);
    const date = new Date().toLocaleDateString();
    cell4.textContent = date;

    // Save and Cancel buttons cell
    const cell5 = newRow.insertCell(4);
    const saveButton = document.createElement('button');
    saveButton.className = 'btn btn-success btn-sm';
    saveButton.textContent = 'Save';
    saveButton.style.marginRight = '4px';
    const cancelButton = document.createElement('button');
    cancelButton.className = 'btn btn-secondary btn-sm';
    cancelButton.textContent = 'Cancel';
    cell5.appendChild(saveButton);
    cell5.appendChild(cancelButton);

    // Cancel button functionality
    cancelButton.addEventListener('click', function() {
        newRow.remove();
    });

    // Save button functionality
    saveButton.addEventListener('click', async function() {
        const commentText = commentText.value.trim();
        const commenterName = commentedBy.value.trim();

        if (!commentText || !commenterName) {
            alert('Please fill in all fields before saving.');
            return;
        }

        const comment = {
            tComments: commentText,
            tcAssignedTo: commenterName,
            tcCreatedOn: new Date().toISOString()
        };

        try {
            const response = await fetch(`http://172.16.2.6:4000/add/comments/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            });

            if (response.ok) {
                console.log('Comment saved successfully');
                // Update the row with entered values
                cell2.textContent = commentText;
                cell3.textContent = commenterName;
                cell4.textContent = new Date(comment.tcCreatedOn).toLocaleDateString();

                // Replace save and cancel buttons with edit and delete
                cell5.innerHTML = `
                    <a class="btn btn-info btn-sm" href="#"><i class="fas fa-pencil-alt"></i> Edit</a>
                    <a class="btn btn-danger btn-sm" href="#"><i class="fas fa-trash"></i> Delete</a>
                `;
            } else {
                throw new Error('Failed to save comment');
            }
        } catch (error) {
            console.error('Error saving comment:', error);
            alert('Failed to save comment. Please try again.');
        }
    });
});

// Fetch task details and comments initially
fetchTaskDetails();
fetchComments();
fetchTaskDetails(taskId);

});
