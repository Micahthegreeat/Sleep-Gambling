fetch('http://localhost:8080/index', {
  method: 'GET',
  headers: {
    'token': '5676545'
  }
})
.then(response => {
  if (!response.ok) {
    // Handle HTTP errors (e.g., 401, 403, 404, 500)
    console.error('Network response was not ok:', response.statusText);
    throw new Error('Network response was not ok');
  }
  return response.json(); // Or response.text() if not JSON
})
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});