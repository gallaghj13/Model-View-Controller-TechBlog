const sendToPost = async (event) => {
    event.preventDefault();

    document.location.replace('/dashboard/newPost');
};

document.querySelector('.newPost').addEventListener('click', sendToPost);