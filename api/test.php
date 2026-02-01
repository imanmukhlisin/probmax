<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Vercel PHP Diagnostic</h1>";

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
$env_keys = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_CONNECTION'];
foreach ($env_keys as $key) {
    $val = getenv($key);
    echo "$key: " . ($val ? "✅ Present" : "❌ MISSING") . "<br>";
}

echo "<h2>5. Database Connection Test</h2>";
$host = getenv('DB_HOST');
$port = getenv('DB_PORT') ?: '5432';
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "✅ Database connection SUCCESSFUL!<br>";
    
    $stmt = $pdo->query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Tables found: " . count($tables) . "<br>";
    echo "<pre>";
    print_r($tables);
    echo "</pre>";

} catch (Exception $e) {
    echo "❌ Database connection FAILED: " . $e->getMessage() . "<br>";
}
