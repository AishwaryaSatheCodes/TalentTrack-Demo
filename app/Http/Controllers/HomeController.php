<?php

namespace App\Http\Controllers;
use Inertia\Inertia;  // <-- This is the correct import
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
       return inertia('Home');
    }

    public function features(){
        return inertia('Features');
    }
}
