"use strict";

const { db } = require("./index");

/**
 * @returns {void}
 */
function resetDb() {
    const schema = `
        CREATE TABLE author (
            author_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        );

        CREATE TABLE book (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
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
                ON DELETE CASCADE
        );
    `;
    
    const seeds = `
        INSERT INTO
            author (author_id, first_name, last_name)
        VALUES
            (1, 'J.R.R.', 'Tolkien'),
            (2, 'Agatha', 'Christie'),
            (3, 'Neil', 'Gaiman'),
            (4, 'Mary', 'Shelley'),
            (5, 'Carl', 'Sagan'),
            (6, 'Octavia E.', 'Butler'),
            (7, 'Jane', 'Austen'),
            (8, 'Andy', 'Weir'),
            (9, 'Stephen', 'King');

        INSERT INTO
            book (book_id, title, year, pages, genre, author_id)
        VALUES
            (1, 'The Hobbit', 1937, 310, 'fantasy', 1),
            (2, 'Murder on the Orient Express', 1934, 256, 'mystery', 2),
            (3, 'American Gods', 2001, 480, 'fantasy', 3),
            (4, 'Frankenstein; or, The Modern Prometheus', 1818, 280, 'horror', 4),
            (5, 'Cosmos', 1980, 370, 'non-fiction', 5),
            (6, 'Kindred', 1979, 288, 'sci-fi', 6),
            (7, 'Pride and Prejudice', 1813, 350, 'romance', 7),
            (8, 'Coraline', 2002, 170, 'horror', 3),
            (9, 'Contact', 1985, 432, 'sci-fi', 5),
            (10, 'And Then There Were None', 1939, 260, 'mystery', 2),
            (11, 'Project Hail Mary', 2021, 496, 'sci-fi', 8),
            (12, 'The Shining', 1977, 447, 'horror', 9),
            (13, 'The Fellowship of the Ring', 1954, 423, 'fantasy', 1),
            (14, 'Persuasion', 1817, 249, 'romance', 7),
            (15, 'Parable of the Sower', 1993, 345, 'sci-fi', 6);
    `;

    // remove tables first
    db.exec("DROP TABLE IF EXISTS book;");
    db.exec("DROP TABLE IF EXISTS author;");
    // re-create tables
    db.exec(schema);
    // re-seed data
    db.exec(seeds);
}

module.exports = {
    resetDb,
};
