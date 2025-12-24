<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminNewsletterController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Newsletter');
    }
}
