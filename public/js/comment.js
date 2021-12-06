const commentHandler = async (event) => {
    event.preventDefault();
  
    const content = document.querySelector('#comment-content').value;
  
    if (content) {
      const response = await fetch('/api/posts', {
          method: 'POST',
          body: JSON.stringify({ content }),
          headers: { 'Content-Type' : 'application/json' },
      });
  
      if (response.ok) {
          document.location.replace('/');
      } else {
          alert(response.statusText)
      }
    }
  };

  document
    .querySelector('.comment-form')
    .addEventListener('submit', commentHandler);
  