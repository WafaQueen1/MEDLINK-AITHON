import bcrypt from 'bcryptjs';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: "postgresql://postgres:Rami1412%23@localhost:5432/pharmatec_db"
});

async function updatePassword() {
    const hash = await bcrypt.hash('password123', 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'patient@pharmatec.com'", [hash]);
    console.log("Password updated successfully for patient@pharmatec.com");
    process.exit(0);
}

updatePassword();
