const express = require('express');

// serve ./index.html
const app = express();
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
