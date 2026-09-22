<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "--- Nettoyage complet de la base MySQL ---\n";
DB::statement('SET FOREIGN_KEY_CHECKS = 0;');

$tables = DB::select('SHOW TABLES');
$dbName = config('database.connections.mysql.database');
$col = "Tables_in_" . $dbName;

foreach ($tables as $table) {
    $tableName = $table->$col ?? array_values((array)$table)[0];
    echo "Suppression table : $tableName\n";
    DB::statement("DROP TABLE IF EXISTS `$tableName`");
}

DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
echo "--- Base nettoyee avec succes. Execution des migrations et seeders... ---\n";
