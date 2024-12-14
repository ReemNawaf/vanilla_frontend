const apiUrl = "http://0.0.0.0:5004";

var recommend_img;
// Handle image selection from file input
function handleFileSelect(event, task) {
    const fileInput = event.target;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    recommend_img = formData;
    // Upload the image to the backend API
    uploadImage(formData, task);
}

// Upload the selected image to the backend
async function uploadImage(formData, task) {
    
    try {
        console.log("Uploading image...");
        console.log(`${apiUrl}/upload_image_${task}`);

        const response = await fetch(`${apiUrl}/upload_image_${task}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Error uploading image: ${response.statusText}`);
        
        const data = await response.json();

        console.log(data);
        console.log(data.imageUrl);

        displayUploadedImage(task, data.imageUrl);

        console.log("Image uploaded successfully!");
    } catch (error) {
        console.log("Upload failed: ${error.message}");
    }
}

// Display uploaded image
function displayUploadedImage(task, imageUrl) {
    const uploadedImageElement = document.getElementById(`image_${task}`);
    const uploadedImageMessage = document.getElementById(`text_${task}`);
    
    uploadedImageElement.src = imageUrl;
    uploadedImageElement.style.display = "block";
    uploadedImageMessage.style.display = "none";
}

// Handle "Run the Model" button click
document.getElementById('recommend').addEventListener('click', async () => {
    console.log("Running model...");
    const recommendationsSection = document.getElementById('recommendationsSection');

    try {
        recommendationsSection.innerHTML = "Running model...";

        for (var pair of recommend_img.entries()) {
            console.log(pair[0]+ ', ' + pair[1].name); 
        }

        console.log(`xx: ${apiUrl}/recommend`);
        
        const response = await fetch(`${apiUrl}/recommend`, {
            method: 'POST',
            body: recommend_img
        });
        
        if (!response.ok) throw new Error(`Error running model: ${response.statusText}`);
        
        const data = await response.json();
        console.log(data);
        displayRecommendations(data.user_image_class, data.recommendations);

        recommendationsSection.style.display = "block";
    } catch (error) {
        recommendationsSection.innerHTML = `Model run failed: ${error.message}`;
    }
});


// Display model recommendations
function displayRecommendations(user_image_class, recommendations) {
    const recommendationsSection = document.getElementById('recommendationsSection');
    recommendationsSection.innerHTML = ''; // Clear any existing content
    
    // Create the recommendation element
    const rElement = document.createElement('div');
    rElement.classList.add('image-titles'); // Add class after element is created
    
    // Set the content of the recommendationElement
    rElement.innerHTML = `
        <h2>Image is ${user_image_class}</h2>
        <h3>Recommended pieces to complete the outfit</h3>
    `;

    recommendationsSection.appendChild(rElement);
    recommendationsSection.style.display = "block";
    

    const recommendationsContainer = document.getElementById('recommendationsContainer');// Add class after element is created
    recommendationsContainer.innerHTML = ''; // Clear any existing content
    
    // Iterate over recommendations and display them
    for (let i = 0; i < recommendations.length; i++) {
        const item = recommendations[i];

        // Create a new recommendation element
        const recommendationElement = document.createElement('div');
        recommendationElement.classList.add('clothing-item');

        // Set inner HTML dynamically using template literals
        recommendationElement.innerHTML = `
            <img src=${item.path} alt="Recommended Image" />
            <h4>Label: ${item.label}</h4>
            <p>Similarity: ${item.similarity}</p>
        `;

        recommendationsContainer.appendChild(recommendationElement);
    }

    recommendationsContainer.style.display = "block";
    
    
}


