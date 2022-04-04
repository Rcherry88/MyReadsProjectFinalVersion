import React from "react";
import Shelf from "./Shelf";

const Bookshelves = ({ books, moveBook }) => {
  const inProgress = books.filter((book) => book.shelf === "currentlyReading");
  const addToMyList = books.filter((book) => book.shelf === "wantToRead");
  const completed = books.filter((book) => book.shelf === "read");

  return (
    <div>
      <Shelf title="Currently Reading" books={inProgress} moveBook={moveBook} />
      <Shelf title="Want To Read" books={addToMyList} moveBook={moveBook} />
      <Shelf title="Read" books={completed} moveBook={moveBook} />
    </div>
  );
};

export default Bookshelves;
