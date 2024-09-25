$(document).ready(function() {
  let items = [];
  let itemsRaw = [];

  // Fetch and display books
  $.getJSON('/api/books', function(data) {
      itemsRaw = data;
      items = data.map((val, i) => `<li class="bookItem" id="${i}">${val.title} - ${val.commentcount} comments</li>`);
      if (items.length >= 15) {
          items.push(`<p>...and ${data.length - 15} more!</p>`);
      }
      $('<ul/>', {
          'class': 'listWrapper',
          html: items.join('')
      }).appendTo('#display');
  });

  // Display book details and comments
  $('#display').on('click', 'li.bookItem', function() {
      $("#detailTitle").html(`<b>${itemsRaw[this.id].title}</b> (id: ${itemsRaw[this.id]._id})`);
      $.getJSON('/api/books/' + itemsRaw[this.id]._id, function(data) {
          let comments = data.comments.map(comment => `<li>${comment}</li>`);
          comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment" required></form>');
          comments.push(`<br><button class="btn btn-info addComment" id="${data._id}">Add Comment</button>`);
          comments.push(`<button class="btn btn-danger deleteBook" id="${data._id}">Delete Book</button>`);
          $('#detailComments').html(comments.join(''));
      });
  });

  // Delete book
  $('#bookDetail').on('click', 'button.deleteBook', function() {
      $.ajax({
          url: '/api/books/' + this.id,
          type: 'delete',
          success: function(data) {
              $('#detailComments').html(`<p style="color: red;">${data}</p><p>Refresh the page</p>`);
          }
      });
  });

  // Add comment
  $('#bookDetail').on('click', 'button.addComment', function() {
      let newComment = $('#commentToAdd').val();
      $.ajax({
          url: '/api/books/' + this.id,
          type: 'post',
          dataType: 'json',
          data: $('#newCommentForm').serialize(),
          success: function(data) {
              comments.unshift(newComment); // Adds new comment to the top of the list
              $('#detailComments').html(comments.join(''));
          }
      });
  });

  // Add new book
  $('#newBook').click(function(e) {
      e.preventDefault();
      if ($('#bookTitleToAdd').val().trim() === '') {
          alert('Please enter a book title.');
          return;
      }
      $.ajax({
          url: '/api/books',
          type: 'post',
          dataType: 'json',
          data: $('#newBookForm').serialize(),
          success: function(data) {
              $('#display').append(`<li class="bookItem" id="${data._id}">${data.title} - 0 comments</li>`);
              $('#bookTitleToAdd').val(''); // Clear input
          }
      });
  });

  // Delete all books
  $('#deleteAllBooks').click(function() {
      if (confirm("Are you sure you want to delete all books? This action cannot be undone.")) {
          $.ajax({
              url: '/api/books',
              type: 'delete',
              dataType: 'json',
              success: function(data) {
                  $('#display').empty();
                  $('#detailComments').empty();
                  $('#detailTitle').text('Select a book to see its details and comments');
                  alert(data);
              }
          });
      }
  });
});
