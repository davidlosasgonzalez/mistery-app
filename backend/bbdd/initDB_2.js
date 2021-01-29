require('dotenv').config();

const getDB = require('./db.js');

let connection;

async function main() {
  try {
    connection = await getDB();

    // Detenemos la asignación de claves foráneas.
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Eliminar tablas si existen
    await connection.query('DROP TABLE IF EXISTS users;');
    await connection.query('DROP TABLE IF EXISTS events;');
    await connection.query('DROP TABLE IF EXISTS events_photos;');
    await connection.query('DROP TABLE IF EXISTS favourites;');
    await connection.query('DROP TABLE IF EXISTS comments;');
    await connection.query('DROP TABLE IF EXISTS ratings;');

    console.log('Tablas borradas');

    // Users
    await connection.query(`
			CREATE TABLE IF NOT EXISTS users (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
				name VARCHAR(50) UNIQUE,
				email VARCHAR(50) NOT NULL UNIQUE,
				password VARCHAR(512) NOT NULL,
				avatar VARCHAR(50),
				active BOOLEAN DEFAULT false,
        reg_code VARCHAR(100),
        recovery_code VARCHAR(100),
				lastAuthUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				deleted BOOLEAN DEFAULT false,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
    `);

    // Events
    await connection.query(`
			CREATE TABLE IF NOT EXISTS events (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				type VARCHAR(50) NOT NULL,
				description VARCHAR(300),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMP,
				deleted BOOLEAN DEFAULT false,
				id_council INT NOT NULL,
				FOREIGN KEY (id_council) REFERENCES councils (id),
				id_user INT NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users (id)
			);
		`);

    // Event's photos
    await connection.query(`
			CREATE TABLE IF NOT EXISTS events_photos (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				photo VARCHAR(50) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				id_event INT NOT NULL,
				FOREIGN KEY (id_event) REFERENCES events (id)
			);
	  `);

    // Favourite
    await connection.query(`
			CREATE TABLE IF NOT EXISTS favourites (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMP,
				id_user INT NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users (id),
				id_event INT NOT NULL,
				FOREIGN KEY (id_event) REFERENCES events (id)
			);
		`);

    // Comments
    await connection.query(`
			CREATE TABLE IF NOT EXISTS comments (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				text VARCHAR(300) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMP,
				id_user INT NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users (id),
				id_event INT NOT NULL,
				FOREIGN KEY (id_event) REFERENCES events (id)
			);
		`);

    // Ratings
    await connection.query(`
			CREATE TABLE IF NOT EXISTS ratings (
				id INT PRIMARY KEY AUTO_INCREMENT, 
				score TINYINT UNSIGNED NOT NULL,
				CONSTRAINT ratings_score_CK1 CHECK (score IN (1,2,3,4,5)),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				modified_at TIMESTAMP,
				id_user INT NOT NULL,
				FOREIGN KEY (id_user) REFERENCES users (id),
				id_event INT NOT NULL,
				FOREIGN KEY (id_event) REFERENCES events (id)
			);
		`);

    // Reactivamos la asignación de claves foráneas.
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Tablas creadas');

    // Almacenamos los datos de todos los lugares.

    // Insertamos usuarios.
    await connection.query(
      'INSERT INTO users (name, email, password, active, role) VALUES ("david98", "david.rego@gmail.com", SHA2("123456", 512), true, "admin");'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("zeus123", "jandro_1990@gmail.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("porcoteixo", "isabel.mora@yahoo.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("Gallu", "renatinho43@hotmail.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("Filomeno", "ferguson@gmail.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("robocop", "eusebio_martinez@gmail.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("GatoVolador", "mariadiva@yahoo.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("Kike", "lucia3452@hotmail.com", SHA2("123456", 512), true);'
    );
    await connection.query(
      'INSERT INTO users (name, email, password, active) VALUES ("Cazafantasmas", "españolito98@gmail.com", SHA2("123456", 512), true);'
    );

    console.log('Usuarios insertados.');

    // Insertamos lugares misteriosos.
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Apariciones", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 4239, 1);'
    );
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Poltergeist", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 4244, 4);'
    );
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Mimofonías", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 342, 6);'
    );
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Apariciones", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 499, 2);'
    );
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Apariciones", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 2013, 9);'
    );
    await connection.query(
      'INSERT INTO events (type, description, id_council, id_user) VALUES ("Combustión espontánea", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus nihil nobis quidem veritatis. Aut blanditiis non maiores, reprehenderit nisi voluptatibus nam officiis minima optio? Rerum nostrum, nisi veniam provident itaque dolores maiores aut commodi, sed porro vero laborum illum sit?", 2021, 7);'
    );

    console.log('Lugares misteriosos insertados.');

    // Insertamos lugares favoritos.
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (2, 4);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (2, 1);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (3, 5);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (3, 6);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (5, 2);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (6, 4);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (7, 2);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (9, 3);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (7, 4);');
    await connection.query('INSERT INTO favourites (id_user, id_event) VALUES (9, 6);');

    console.log('Lugares favoritos insertados.');

    // Comments
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 6, 3);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 2, 3);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 1, 5);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 1, 3);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 7, 1);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 6, 1);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 3, 4);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 4, 3);');
    await connection.query('INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 8, 6);');

    console.log('Comentarios insertados.');

    // Ratings
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (3, 1, 4);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (5, 4, 1);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (2, 2, 4);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (4, 8, 6);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (5, 1, 4);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (3, 3, 5);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (5, 7, 2);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (5, 4, 2);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (2, 2, 1);');
    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (1, 7, 3);');

    console.log('Puntuaciones insertadas.');
    console.log('Proceso completado. ¡BBDD actualizada!');
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) connection.release();
  }
}

main();
