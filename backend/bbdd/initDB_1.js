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

    // Reactivamos la asignación de claves foráneas.
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Tablas creadas');

    // Almacenamos los datos de todos los lugares.

    const communitiesResponse = await axios.get(`http://apiv1.geoapi.es/comunidades?key=${GEO_API_KEY}`);

    const communities = communitiesResponse.data.data;

    // Insertamos las comunidades.
    for (const community of communities) {
      await connection.query(`
        INSERT INTO communities (id, name) VALUES (${community.CCOM}, "${community.COM}");
      `);
    }

    console.log('Comunidades insertadas');

    // Insertamos las provincias.
    const provincesResponse = await axios.get(`http://apiv1.geoapi.es/provincias?key=${GEO_API_KEY}`);

    const provinces = provincesResponse.data.data;

    for (const province of provinces) {
      const { CCOM } = communities.find((community) => community.CCOM === province.CCOM);
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

    console.log('Proceso completado. Ahora debes ejecutar [initDB.js].');
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) connection.release();
  }
}

main();
