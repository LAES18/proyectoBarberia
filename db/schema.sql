-- Barberia application schema only. No production users or haircut rows.
-- The backend also creates missing tables with Sequelize on startup.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  role TEXT NOT NULL DEFAULT 'barbero',
  percentage FLOAT NOT NULL DEFAULT 50,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS haircuts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barberId INTEGER NOT NULL REFERENCES users(id),
  price FLOAT NOT NULL,
  date DATE NOT NULL,
  cutNumber INTEGER NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  tip FLOAT NOT NULL DEFAULT 0,
  discount FLOAT NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS haircuts_barber_id_date
  ON haircuts (barberId, date);
