import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TitleBar from "./AppComponents/TitleBar";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import Bookshelves from "./AppComponents/Bookshelves";
import Book from "./AppComponents/Book";

const BooksApp = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [bookMap, setBookMap] = useState(new Map());
  const [searching, setSearching] = useState(false);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [combinedBooks, setCombinedBooks] = useState([]);

  const mapBooks = (books) => {
    const map = new Map();
    books.map((book) => map.set(book.id, book));
    return map;
  };

  const moveBook = (book, newShelf) => {
    const newBooks = books.map((b) => {
      if (b.id === book.id) {
        book.shelf = newShelf;
        return book;
      }
      return b;
    });
    if (!bookMap.has(book.id)) {
      book.shelf = newShelf;
      newBooks.push(book);
    }
    setBooks(newBooks);
    BooksAPI.update(book, newShelf);
    setBookMap(mapBooks(newBooks));
  };

  useEffect(() => {
    BooksAPI.getAll().then((data) => {
      setBooks(data);
      setBookMap(mapBooks(data));
    });
  }, []);

  useEffect(
    () => {
      const searchAddition = searchedBooks.map((book) => {
        if (bookMap.has(book.id)) {
          return bookMap.get(book.id);
        } else {
          return book;
        }
      });
      setCombinedBooks(searchAddition);
    },
    [searchedBooks]
  );

  useEffect(
    () => {
      setSearching(true);
      if (query) {
        BooksAPI.search(query).then((data) => {
          if (data.error) {
            setSearchedBooks([]);
          } else {
            if (searching) {
              setSearchedBooks(data);
            }
          }
        });
      }

      return () => {
        setSearching(false);
        setSearchedBooks([]);
      };
    },
    [query]
  );

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="list-books">
                <TitleBar />
                <div className="list-books-content">
                  <Bookshelves books={books} moveBook={moveBook} />
                </div>
                <div className="open-search">
                  <Link to="/search">
                    <button>Add a book</button>
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <div className="search-books">
                <div className="search-books-bar">
                  <Link to="/">
                    <button className="close-search">Close</button>
                  </Link>
                  <div className="search-books-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search by title or author"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">
                    {combinedBooks.map((b) => (
                      <li key={b.id}>
                        <Book book={b} changeShelf={moveBook} />
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default BooksApp;
