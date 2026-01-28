<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $controller = new App\Http\Controllers\Api\CategoryController;
    $response = $controller->index();
    echo "SUCCESS INDEX\n";

    $slug = 'ordinateurs-portables'; // Based on seeder
    $responseShow = $controller->show($slug);
    echo "SUCCESS SHOW\n";
} catch (\Exception $e) {
    echo "ERROR\n";
    echo $e->getMessage()."\n";
    echo $e->getTraceAsString()."\n";
}
