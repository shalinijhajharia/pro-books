import React from "react";
import { Link } from "react-router-dom";

import { getAll, search, update } from "./BooksAPI";
import Book from "./Book";

const MAX_QUERY_RESULTS = 50;
const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

class BooksSearch extends React.Component {
  state = {
    value: "",
  };
  timer = null;

  handleChange = (e) => {
    clearTimeout(this.timer);
    this.setState({ value: e.target.value });
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      clearTimeout(this.timer);
      this.triggerChange();
    }
  };

  triggerChange = () => {
    const { value } = this.state;

    if (value === "") {
      this.setState({
        books: [],
      });
      return;
    }

    search(value, MAX_QUERY_RESULTS)
      .then((matchingBooks) => {
        if (Array.isArray(matchingBooks) || matchingBooks.length > 0) {
          getAll().then((booksOnShelf) => {

            this.setState({
              books: matchingBooks.map((book) => {
                let matchingBook = booksOnShelf.find(
                  (bookOnShelf) => bookOnShelf.id === book.id
                );
                return { ...book, shelf: matchingBook ? matchingBook.shelf : "" }
              }),
              validSetBooks: true,
            });
          });
        } else {
          this.setState({
            books: [],
            validSetBooks: false,
          });
        }
      })
      .catch((error) => {
        console.log(`BookSearch search error: ${error}`);
        this.setState({
          books: [],
          validSetBooks: false,
        });
      });
  };

  updateBookToShelf = (id, newShelf) => {
    const updatedBook = this.state.books.filter((book) => book.id === id)[0];
    updatedBook.shelf = newShelf;
    this.setState((prevState) => ({
      books: [...prevState.books.filter((book) => book.id !== id), updatedBook],
    }));

    update({ id }, newShelf).catch((error) => {
      console.log(`BookSearch update error: ${error}`);
    });
  };

  state = {
    books: [],
    value: "",
  };

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              value={this.state.value}
              placeholder="Search by title or author"
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.validSetBooks &&
              this.state.books
                .sort((a,b) => a.title === b.title ? 0 : a.title > b.title ? 1 : -1)
                .map((book) => {
                  return (
                    <li key={book.id}>
                      <Book
                        book={book}
                        bookSize="small"
                        updateBookToShelf={this.updateBookToShelf}
                      />
                    </li>
                  );
                })}
          </ol>
        </div>
      </div>
    );
  }
}

export default BooksSearch;