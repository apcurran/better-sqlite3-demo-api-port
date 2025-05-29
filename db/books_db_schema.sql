CREATE TABLE book (
    book_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    pages INTEGER NOT NULL,
    genre TEXT NOT NULL
          CHECK (genre IN (
              'fantasy',
              'sci-fi',
              'mystery',
              'non-fiction',
              'fiction',
              'romance',
              'horror'
          )),
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES author (author_id)
);

CREATE TABLE author (
    author_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
);