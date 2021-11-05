//ES2015-ES6, built with classes instead of prototypes
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    //create table row
    const row = document.createElement('tr');

    //insert columns
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td> <a href='#' class='delete'>X</a></td>`;
    list.appendChild(row);
  }

  //alert
  showAlert(message, className) {
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
  }

  //delete book
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  //clear fields
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//local storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//Load books
document.addEventListener('DOMContentLoaded', Store.displayBooks);

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

  //validate
  if (title === '' || author === '' || isbn === '') {
    //alert user
    ui.showAlert('Please fill in all fields.', 'error');
  } else {
    //add book to list
    ui.addBookToList(book);

    //add to local storage
    Store.addBook(book);

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
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show alert
  ui.showAlert('Book deleted!', 'success');

  e.preventDefault();
});
