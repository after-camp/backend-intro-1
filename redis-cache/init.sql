CREATE TABLE data_table (
                            id SERIAL PRIMARY KEY,
                            content TEXT NOT NULL
);

INSERT INTO data_table (content) VALUES ('Sample data from the database.');
