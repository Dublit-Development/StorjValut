window.addEventListener('DOMContentLoaded', async () => {
  var settings_injection = `<span id="settings_options">
        <label for="key_toggle">Manual Keys<br>
          <input id="key_toggle" name="key_toggle" type="checkbox">
        </label>
        <label for="auto_save">Auto-Save<br>
          <input id="auto_save" name="auto_save" type="checkbox">
        </label>
      </span>
      <label for="bucket-id">Bucket ID
        <input type="text" id="bucket_id" name="bucket-id">
      </label>
      <label for="bucket-id">Access Key
        <input type="text" id="bucket_id" name="bucket-id">
      </label>
      <label for="bucket-id">Secret Key
        <input type="text" id="bucket_id" name="bucket-id">
      </label>`;
  
  const dropzone = document.getElementById('dropzone');
  const deleteButton = document.createElement('button'); // Create a delete button element
  deleteButton.id = 'deleteFile'
  var uploadZone = document.getElementById('uploadZone')
  deleteButton.textContent = 'Remove'; // Set the text content of the delete button
  deleteButton.classList.add('delete'); // Add the necessary CSS class to the delete button
  var uploadButton = document.getElementById('export-btn')
  var currentFile = null; // Keep track of the current file
  var inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.style.display = 'none';

  uploadZone.appendChild(deleteButton); // Append the delete button to the file container
  uploadZone.appendChild(inputElement); 

  async function sendFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log(data)
    alert(data.message)
    currentFile = null; // Reset the current file after upload
    await getFileContents()
    await deleteButtonHandler()
    deleteButton.click()
  }


  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('highlight');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('highlight');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('highlight');
    dropzone.style.border = 'none';
    dropzone.style.maxHeight = '50vh';
    dropzone.style.maxWidth = '50vw';
    dropzone.style.minHeight = '300px';
    dropzone.style.minWidth = '300px';
    dropzone.style.height = 'auto';
    dropzone.style.width = 'auto';
    dropzone.style.boxShadow = '0px 0px 24px #22222270';
    const file = e.dataTransfer.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.includes('image')) {
        const image = new Image();
        image.src = reader.result;
        dropzone.innerHTML = '';
        dropzone.appendChild(image);
      } else {
        const fileIcon = document.createElement('i');
        fileIcon.classList.add('fas', 'fa-file-alt');
        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        const fileContainer = document.createElement('div');
        fileContainer.appendChild(fileIcon);
        fileContainer.appendChild(fileName);
        dropzone.innerHTML = '';
        dropzone.appendChild(fileContainer);
      }
    };

    reader.readAsDataURL(file);
    currentFile = file; // Set the current file to the dropped file
  });

  uploadButton.addEventListener('click', async () => {
    if (currentFile) {
      sendFile(currentFile); // Upload only the current file
    }
  });

  deleteButton.addEventListener('click', () => {
    dropzone.innerHTML = '<p>Drag and drop a file here</p>'; // Remove the uploaded file from the dropzone
    currentFile = null; // Reset the current file when file is deleted
    
    dropzone.style.boxShadow = '0px 0px 24px #00000000'; // remove the shadow
  });

  deleteButton.addEventListener('click', () => {
    dropzone.style.border = '2px dashed #ccc';
  });

  // Event to handle click event of dropzone to open file picker
  dropzone.addEventListener('click', () => {
    inputElement.click();
  });

  inputElement.addEventListener('change', function () {
    let file = inputElement.files[0];
    currentFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.includes('image')) {
        const image = new Image();
        image.src = reader.result;
        dropzone.innerHTML = '';
        dropzone.appendChild(image);
      } else {
        const fileIcon = document.createElement('i');
        fileIcon.classList.add('fas', 'fa-file-alt');
        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        const fileContainer = document.createElement('div');
        fileContainer.appendChild(fileIcon);
        fileContainer.appendChild(fileName);
        dropzone.innerHTML = '';
        dropzone.appendChild(fileContainer);
      }
    };
    reader.readAsDataURL(file);
  });

 async function getFileContents() {
    const response = await fetch('/list', {
      method: 'POST'
    });
    await response.json().then(async(data) => {
      document.getElementById('storageTable').innerHTML = `<tr id="table_header"><th id="file_name">File</th><th id="file_size">Size</th></tr>` //empty the table
      var files = data.message;
      var fileSizes = data.file_sizes;
      var totFiles = 0;
      var totSpace = 0;
      console.log(fileSizes)
      try {
        
        
        files.forEach(async (o) => {
          // now get the size for each, display it, and add to the total
          var currFileSize = fileSizes[totFiles];
          // the conversion is for bytes to megabytes
          document.getElementById('storageTable').innerHTML += `
                  <tr>
                    <td class="file_name">${o}</td>
                    <td class="file_size">${(currFileSize / 1048576).toFixed(3)}Mb</td>  
                    <td class="delete">x</td>
                  </tr>
                  `
          totFiles+=1;
          totSpace+=currFileSize;
        
          
      });
        document.getElementById('file_amount').innerText = totFiles;
        document.getElementById('space_occupied').innerText = (totSpace / 1048576).toFixed(3);
      } catch (error) {
        alert('Bucket is empty!')
      }
      
    });

   addDownloadEvenetListener();

}

  async function deleteFile(fileName) {
    document.getElementById('settings').click()
    const response = await fetch('/delete', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({file: fileName})
    });
    await response.json().then(async(data) => {
      await getFileContents();
      await deleteButtonHandler()
    });
  }

  async function deleteButtonHandler() {
    var deleteButtons = document.getElementsByClassName('delete');
    Array.from(deleteButtons).forEach(async (button) => {
      button.addEventListener('click', async () => {
        const fileName = button.parentNode.getElementsByClassName('file_name')[0].textContent;
        console.log(fileName)
        await deleteFile(fileName);
      });
    });
  }

  await getFileContents();
  await deleteButtonHandler();

  // popup for settings cog
  var isOpen = false;
  var settingsCog = document.getElementById('settings');
  var popup = document.getElementById('popup-window');
  settingsCog.addEventListener('click', () => {
    if(!isOpen){
      popup.innerHTML = settings_injection
      popup.style.display = 'block';
      setTimeout(async() => {
        popup.style.transform = 'translateX(0px)';
        isOpen = true;
      },10);
    }
    
  });
  // listener for closing
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && isOpen) {
      popup.style.transform = 'translateX(2400px)';
      setTimeout(() => {
        popup.style.display = 'none';
        isOpen = false;
      }, 50);
    }
  });

  //popup for downloading file
  async function addDownloadEvenetListener() {
    var items = document.getElementById('storageTable').getElementsByTagName('tr');
    Array.from(items).forEach(async (item) => {
      item.addEventListener('click', async (e) => {
        const fileName = item.getElementsByClassName('file_name')[0].textContent;
        const fileSize = item.getElementsByClassName('file_size')[0].textContent;
        const popup = document.getElementById('popup-window');
        popup.style.display = 'block';
        popup.innerHTML = `<div id="downloadItemContent">
        <a id="close_popup">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
        </a>
          <p>Download <b>${fileName}?</b></p>
          <p>File Size: <b>${fileSize}</b></p>
          <button id="download_button">Download</button>
        </div>`;
        
        popup.style.transform = 'translateX(0px)';
          
        
  
        // add download event listener
        var downloadButton = document.getElementById('download_button');
        downloadButton.addEventListener('click', async () => {
          var endpoint_url = '/download'; 
          // Make a POST request with the name of the file to download
          let response = await fetch(endpoint_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: fileName }) // send the file name
          });
          // Check if the request was successful
          if(response.ok) {
            let data = await response.blob(); 
            let url = window.URL.createObjectURL(data);
            
            // Create a link node
            let link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            // Cleanup
            window.URL.revokeObjectURL(url);
          } else {
            console.log("HTTP-Error: " + response.status);
          }

        });
        // add the close window event listener
        var closeButton = document.getElementById('close_popup').getElementsByTagName('svg')[0];
        closeButton.addEventListener('click', () => {
          popup.style.transform = 'translateX(2400px)';
          setTimeout(() => {
            popup.style.display = 'none';
            isOpen = false;
          }, 50);
        
        });
        
      });
    })
  }
  
});
