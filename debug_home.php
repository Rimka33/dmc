<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $controller = new App\Http\Controllers\Api\HomeController;
    $response = $controller->index();
    echo "SUCCESS\n";
    echo json_encode($response->getData(), JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo "ERROR\n";
    echo $e->getMessage()."\n";
    echo $e->getTraceAsString()."\n";
}
