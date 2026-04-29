import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adminPool = new Pool({
  user: 'postgres',
  password: 'Rami1412#',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

const initDb = async () => {
  try {
    console.log('Création de la base de données pharmatec_db...');
    await adminPool.query('CREATE DATABASE pharmatec_db');
    console.log('✓ Base de données créée');
    
    await adminPool.end();

    const dbPool = new Pool({
      user: 'postgres',
      password: 'Rami1412#',
      host: 'localhost',
      port: 5432,
      database: 'pharmatec_db',
    });

    console.log('Exécution du schéma...');
    const schema = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );
    await dbPool.query(schema);
    console.log('✓ Schéma créé');

    console.log('Exécution des données de seed...');
    const seed = fs.readFileSync(
      path.join(__dirname, '../database/seed.sql'),
      'utf8'
    );
    await dbPool.query(seed);
    console.log('✓ Données insérées');

    await dbPool.end();
    console.log('\n✓ Base de données initialisée avec succès!');
  } catch (error) {
    if (error.message.includes('existe déjà') || error.message.includes('already exists')) {
      console.log('✓ La base de données pharmatec_db existe déjà');
      
      const dbPool = new Pool({
        user: 'postgres',
        password: 'Rami1412#',
        host: 'localhost',
        port: 5432,
        database: 'pharmatec_db',
      });

      try {
        console.log('Exécution du schéma...');
        const schema = fs.readFileSync(
          path.join(__dirname, '../database/schema.sql'),
          'utf8'
        );
        await dbPool.query(schema);
        console.log('✓ Schéma créé/actualisé');

        console.log('Exécution des données de seed...');
        const seed = fs.readFileSync(
          path.join(__dirname, '../database/seed.sql'),
          'utf8'
        );
        await dbPool.query(seed);
        console.log('✓ Données insérées');
      } catch (schemaError) {
        console.error('Erreur lors de l\'exécution du schéma:', schemaError.message);
      } finally {
        await dbPool.end();
      }
    } else {
      console.error('Erreur:', error.message);
      process.exit(1);
    }
  }
};

initDb();
