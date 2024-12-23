<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\Program;
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
    public function index()
    {
        return view('home');
    }

    public function about()
    {
        return view('frontend.about');
    }

    public function campaign($id)
    {
        $campaign = Campaign::query()->findOrFail($id);
        return view('frontend.category-campaign', compact('campaign'));
    }

    public function category($slug)
    {
        $category = Category::query()->where('slug', $slug)->first();
        return view('frontend.category', compact('category'));
    }

    public function program($slug)
    {
        $program = Program::query()->where('slug', $slug)->first();
        return view('frontend.program', compact('program'));
    }
}
