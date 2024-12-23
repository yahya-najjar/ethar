@extends('frontend.layouts.app')

@section('style')

    <link rel="stylesheet" href="{{ asset('frontend/assets/css/about.css') }}">
@endsection

@section('content')

    <div class="container mt-4 mb-5">
        <h2 class="visually-hidden">أنت هنا</h2>
        <nav aria-label="أنت هنا">
            <ol class="breadcrumb ms-5 ms-md-0">
                <li class="breadcrumb-item"><a href="/">الرئيسية</a></li>
                <li class="breadcrumb-item text-primary-green"><span>فرص التبرع</span></li>
                <li class="breadcrumb-item"><a href="/category/{{$category->slug}}">{{ $category->name }}</a></li>
            </ol>
        </nav>

        <div class="container">
            <div class="row mb-0 mb-sm-4 cards-wrapper" role="region" aria-label="المشاريع الموصى بها">
                <h3 class="visually-hidden">المشاريع الموصى بها</h3>

                @foreach($category->campaigns as $campaign)
                    @include('frontend.campaign-card', ['campaign' => $campaign])
                @endforeach
            </div>
        </div>
    </div>

@endsection
