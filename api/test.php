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

    $stmt = $pdo->query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Tables found: " . count($tables) . "<br>";
    echo "<pre>";
    print_r($tables);
    echo "</pre>";

} catch (Exception $e) {
    echo "❌ Database connection FAILED: " . $e->getMessage() . "<br>";
}
