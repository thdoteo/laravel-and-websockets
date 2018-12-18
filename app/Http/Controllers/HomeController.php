<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(Guard $auth)
    {
        $user = $auth->user();
        $key = "demo";
        $token = [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'exp' => time() + 60
        ];
        $token = JWT::encode($token, $key);
        return view('home', compact('token'));
    }
}
