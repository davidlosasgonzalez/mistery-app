require('dotenv').config();

const getDB = require('./db.js');
const axios = require('axios');

const { GEO_API_KEY } = process.env;

let connection;

async function main() {
	try {
		connection = await getDB();

		// Detenemos la asignación de claves foráneas.
		await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

		// Eliminar tablas si existen
		await connection.query('DROP TABLE IF EXISTS communities;');
		await connection.query('DROP TABLE IF EXISTS provinces;');
		await connection.query('DROP TABLE IF EXISTS councils;');
		await connection.query('DROP TABLE IF EXISTS users;');
		await connection.query('DROP TABLE IF EXISTS events;');
		await connection.query('DROP TABLE IF EXISTS events_photos;');
		await connection.query('DROP TABLE IF EXISTS favourites;');
		await connection.query('DROP TABLE IF EXISTS comments;');
		await connection.query('DROP TABLE IF EXISTS ratings;');

		console.log('Tablas borradas');

		// Communities
		await connection.query(`
            CREATE TABLE IF NOT EXISTS communities (
                id INT PRIMARY KEY, 
                name VARCHAR(50) NOT NULL UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP
            );
        `);

		// Provinces
		await connection.query(`
            CREATE TABLE IF NOT EXISTS provinces (
                id INT PRIMARY KEY, 
                name VARCHAR(50) NOT NULL UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP,
                id_community INT NOT NULL,
                FOREIGN KEY (id_community) REFERENCES communities (id) 	
            );
        `);

		// Councils
		await connection.query(`
            CREATE TABLE IF NOT EXISTS councils (
                id INT PRIMARY KEY AUTO_INCREMENT, 
                name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP,
                id_province INT NOT NULL,
                FOREIGN KEY (id_province) REFERENCES provinces (id) 	
            );
        `);

		// Users
		await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT, 
                name VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP
            );
        `);

		//
		await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT PRIMARY KEY AUTO_INCREMENT, 
                type VARCHAR(50) NOT NULL,
                description VARCHAR(300),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                modified_at TIMESTAMP,
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
                text VARCHAR(50) NOT NULL,
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
		try {
			const communitiesResponse = await axios.get(
				`http://apiv1.geoapi.es/comunidades?key=${GEO_API_KEY}`
			);

			const communities = communitiesResponse.data.data;

			// Insertamos las comunidades.
			for (const community of communities) {
				await connection.query(`
                    INSERT INTO communities (id, name) VALUES (${community.CCOM}, "${community.COM}");
                `);
			}

			console.log('Comunidades insertadas');

			// Insertamos las provincias.
			const provincesResponse = await axios.get(
				`http://apiv1.geoapi.es/provincias?key=${GEO_API_KEY}`
			);

			const provinces = provincesResponse.data.data;

			for (const province of provinces) {
				const { CCOM } = communities.find(
					(community) => community.CCOM === province.CCOM
				);
				await connection.query(`
                    INSERT INTO provinces (id, name, id_community) VALUES (${province.CPRO}, "${province.PRO}", ${CCOM});
                `);
			}

			console.log('Provincias insertadas');

			let councilsCounter = 1.923;

			// Insertamos los municipios.
			for (const province of provinces) {
				const councilsResponse = await axios.get(
					`http://apiv1.geoapi.es/municipios?key=${GEO_API_KEY}&CPRO=${province.CPRO}`
				);
				for (const council of councilsResponse.data.data) {
					await connection.query(`
                        INSERT INTO councils (name, id_province) VALUES ("${council.DMUN50}", ${council.CPRO});
                    `);
				}
				console.log(`Lista municipios ${councilsCounter.toFixed(2)}%`);
				councilsCounter += 1.923;
			}
			console.log('Municipios insertados');

			// Insertamos usuarios.
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("david98", "david.rego@gmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("zeus123", "jandro_1990@gmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("porcoteixo", "isabel.mora@yahoo.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("Gallu", "renatinho43@hotmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("Filomeno", "ferguson@gmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("robocop", "eusebio_martinez@gmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("GatoVolador", "mariadiva@yahoo.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("Kike", "lucia3452@hotmail.com", "123456");'
			);
			await connection.query(
				'INSERT INTO users (name, email, password) VALUES ("Cazafantasmas", "españolito98@gmail.com", "123456");'
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
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (2, 4);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (2, 1);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (3, 5);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (3, 6);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (5, 2);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (6, 4);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (7, 2);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (9, 3);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (7, 4);'
			);
			await connection.query(
				'INSERT INTO favourites (id_user, id_event) VALUES (9, 6);'
			);

			console.log('Lugares favoritos insertados.');

			// Comments
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 6, 3);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 2, 3);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 1, 5);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 1, 3);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 7, 1);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 6, 1);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 3, 4);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 4, 3);'
			);
			await connection.query(
				'INSERT INTO comments (text, id_user, id_event) VALUES ("Lorem impsum dolor amet.", 8, 6);'
			);

			console.log('Comentarios insertados.');

			// Ratings
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (3, 1, 4);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (5, 4, 1);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (2, 2, 4);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (4, 8, 6);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (5, 1, 4);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (3, 3, 5);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (5, 7, 2);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (5, 4, 2);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (2, 2, 1);'
			);
			await connection.query(
				'INSERT INTO ratings (score, id_user, id_event) VALUES (1, 7, 3);'
			);

			console.log('Puntuaciones insertadas.');
			console.log('Proceso completado. ¡BBDD actualizada!');
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		console.log(error);
	} finally {
		if (connection) connection.release();
	}
}

main();
