<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Vercel PHP Diagnostic - HELLO!</h1>";
echo "Jika Anda melihat tulisan ini, berarti Script PHP Jalan. <br>";

echo "<h2>1. Basic PHP Info</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Current File: " . __FILE__ . "<br>";

echo "<h2>2. Extension Check</h2>";
$extensions = ['pdo', 'pdo_pgsql', 'pgsql', 'openssl', 'mbstring'];
foreach ($extensions as $ext) {
    echo "Extension '$ext': " . (extension_loaded($ext) ? "✅ Loaded" : "❌ NOT LOADED") . "<br>";
}

echo "<h2>3. Available PDO Drivers</h2>";
print_r(PDO::getAvailableDrivers());

echo "<h2>4. Environment Variables Check</h2>";
$env_keys = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_CONNECTION', 'APP_KEY'];
foreach ($env_keys as $key) {
    $val = getenv($key);
    echo "$key: " . ($val ? "✅ Present" : "❌ MISSING") . "<br>";
}

echo "<h2>5. Database Connection & Seeding Test</h2>";
$host = getenv('DB_HOST');
$port = getenv('DB_PORT') ?: '5432';
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "✅ Database connection SUCCESSFUL!<br>";
    
    // Check if roles table is empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM roles");
    $count = $stmt->fetchColumn();
    echo "Current roles count: $count <br>";

    if ($count == 0) {
        echo "⚙️ Seeding roles...<br>";
        $pdo->exec("INSERT INTO roles (name, created_at, updated_at) VALUES 
            ('Admin', NOW(), NOW()), 
            ('Consultant', NOW(), NOW()), 
            ('Student', NOW(), NOW())");
        echo "✅ Roles SEEDED successfully!<br>";
    } else {
        echo "ℹ️ Roles table already has data. skipping seed.<br>";
    }

    echo "<h3>Current Roles:</h3>";
    $stmt = $pdo->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1'><tr><th>ID</th><th>Name</th></tr>";
    foreach ($roles as $r) {
        echo "<tr><td>{$r['id']}</td><td>{$r['name']}</td></tr>";
    }
    echo "</table>";

    echo "<h3>Current Users:</h3>";
    $stmt = $pdo->query("SELECT id, username, email, role_id FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (count($users) == 0) {
        echo "⚠️ No users found in database.<br>";
    } else {
        echo "<table border='1'><tr><th>ID</th><th>Username</th><th>Email</th><th>Role ID</th></tr>";
        foreach ($users as $u) {
            echo "<tr><td>{$u['id']}</td><td>{$u['username']}</td><td>{$u['email']}</td><td>{$u['role_id']}</td></tr>";
        }
        echo "</table>";
    }

    echo "<h3>Diagnostic Summary:</h3>";
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Tables found: " . count($tables) . "<br>";
    echo "<pre>";
    print_r($tables);
    echo "</pre>";

} catch (Exception $e) {
    echo "❌ Database connection FAILED: " . $e->getMessage() . "<br>";
}
