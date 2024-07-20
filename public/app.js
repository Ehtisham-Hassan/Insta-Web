function showInput() {
    var inputField = document.getElementById('commentInput');
    var addButton = document.getElementById('showCommentInput');
    
    // Toggle input field visibility
    if (inputField.style.display === 'none') {
        inputField.style.display = 'inline-block';
        addButton.textContent = 'Hide Comment';
    } else {
        inputField.style.display = 'none';
        addButton.textContent = 'Add Comment';
    }
}