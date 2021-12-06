const editHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const content = document.querySelector('#post-content').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1 
    ]

    if (title && content) {
        const response = await fetch('/api/posts'+id, {
            method: 'POST',
            body: JSON.stringify({ 
                title: title, 
                content: content }),
            headers: { 'Content-Type' : 'application/json' },
        });
    
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText)
        }
    }
};

document
.querySelector('#edit-btn')
.addEventListener('submit', editHandler);