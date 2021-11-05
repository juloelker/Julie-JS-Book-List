//ES5, built with prototypes instead of classes
//Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

//UI Constructor
function UI() {}

//add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');
  //create table row
  const row = document.createElement('tr');

  //insert columns
  row.innerHTML = `<td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td> <a href='#' class='delete'>X</a></td>`;
  list.appendChild(row);
};

//alert
UI.prototype.showAlert = function (message, className) {
  //create a div
  const div = document.createElement('div');
  //add class
  div.className = `alert ${className}`;
  //create text node
  div.appendChild(document.createTextNode(message));
  //get parent
  const container = document.querySelector('.container');
  //get form
  const form = document.querySelector('#book-form');
  //insert alert
  container.insertBefore(div, form);
  //timeout after 3 sec
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
};

//delete book
UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
};

//clear fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};

//local storage ES5
function Store() {}

Store.prototype.getBooks = function () {
  let books;
  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
};

Store.prototype.displayBooks = function () {
  const books = Store.prototype.getBooks();
  books.forEach(function (book) {
    const ui = new UI();
    ui.addBookToList(book);
  });
};
//error on line 82, not a function, need to instantiate it with a constant I think?
Store.prototype.addBook = function (book) {
  const books = Store.prototype.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

Store.prototype.removeBook = function (isbn) {
  const books = Store.prototype.getBooks();
  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
};

//Load books
document.addEventListener('DOMContentLoaded', Store.prototype.displayBooks);

//Event Listener for Add Book
document.querySelector('#book-form').addEventListener('submit', function (e) {
  //get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  //instantiate new book
  const book = new Book(title, author, isbn);

  //instantiate UI
  const ui = new UI();

  //instantiate local storage
  const store = new Store();

  //validate
  if (title === '' || author === '' || isbn === '') {
    //alert user
    ui.showAlert('Please fill in all fields.', 'error');
  } else {
    //add book to list
    ui.addBookToList(book);

    //add to local storage
    store.addBook(book);

    //show alert
    ui.showAlert('Book added!', 'success');

    //clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event listener for delete book
document.getElementById('book-list').addEventListener('click', function (e) {
  //instantiate UI
  const ui = new UI();

  //delete the book
  ui.deleteBook(e.target);

  //remove from local storage
  Store.prototype.removeBook(
    e.target.parentElement.previousElementSibling.textContent
  );

  //show alert
  ui.showAlert('Book deleted!', 'success');

  e.preventDefault();
});
