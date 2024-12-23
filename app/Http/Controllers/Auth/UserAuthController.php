<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('frontend.auth.login');
    }

    public function showRegisterForm()
    {
        return view('frontend.auth.register');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('client')->attempt($credentials)) {
            return redirect()->route('homepage');
        }

        return back()->withErrors(['email' => 'Invalid credentials.']);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:clients,email'], // Adjust table name if different
            'password' => ['required', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $client = Client::query()->create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        auth('client')->login($client);

        return redirect()->route('homepage')->with('success', 'Registration successful!');
    }

    public function logout()
    {
        Auth::guard('client')->logout();

        return redirect()->route('homepage');
    }

    public function dashboard()
    {
        return view('user.dashboard'); // Create a Blade view for user dashboard
    }
}
