@extends('frontend.layouts.app')


@section('content')
    <div id="homeCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-inner" role="region" aria-label="جديد آيثار">
            <h2 class="visually-hidden">جديد آيثار</h2>
            <div class="carousel-indicators align-items-center">
                <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0"
                        class="carousel-indicators_item active"
                        aria-current="true"
                        aria-label="الانتقال إلى الشريحة رقم 1"></button>
                <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1"
                        class="carousel-indicators_item "
                        aria-current="false"
                        aria-label="الانتقال إلى الشريحة رقم 2"></button>
                <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2"
                        class="carousel-indicators_item "
                        aria-current="false"
                        aria-label="الانتقال إلى الشريحة رقم 3"></button>
                <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="3"
                        class="carousel-indicators_item "
                        aria-current="false"
                        aria-label="الانتقال إلى الشريحة رقم 4"></button>
                <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="4"
                        class="carousel-indicators_item "
                        aria-current="false"
                        aria-label="الانتقال إلى الشريحة رقم 5"></button>
                <button type="button" class="carousel-indicators_item toggle-player toggle-player_pause"
                        aria-pressed="false" aria-label="إيقاف حركة الشرائح">
                    <i class="fas fa-pause" aria-hidden="true"></i>
                    <i class="fas fa-play d-none" aria-hidden="true"></i>
                </button>
            </div>
            @foreach($sliders as $key => $slide)
                <div class="carousel-item {{$key == 0 ? 'active' : ''}}" role="region" aria-roledescription="شريحة"
                     aria-label="&#x62E;&#x62F;&#x645;&#x629; &#x62A;&#x64A;&#x633;&#x631;&#x62A;">
                    <picture>
                        <img class="" src="{{ Storage::url($slide->image) }}" alt="" />
                    </picture>
                    <div class="carousel-content px-4 px-md-5 mx-md-4 text-center text-md-start position-absolute translate-middle-y"
                         style="color:#ffffff;">
                        <h1 aria-level="3" class="text-center px-xl-5 text-md-start">{{ $slide->name }}</h1>
                        <p class="px-xl-5">{{ $slide->slogan }}</p>
                        <a href="https://ehsan.sa/tyassarat/judicialbills" class="btn rounded-pill px-5 fw-bold fs-5 mx-xl-5"
                           style="color:#0a0a0a; background-color:#ffffff">
                            &#x62A;&#x628;&#x631;&#x639; &#x627;&#x644;&#x622;&#x646;
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
        <button class="carousel-control-prev d-none d-md-flex" type="button" data-bs-target="#homeCarousel"
                data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">الشريحة السابقة</span>
        </button>
        <button class="carousel-control-next d-none d-md-flex" type="button" data-bs-target="#homeCarousel"
                data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">الشريحة التالية</span>
        </button>
    </div>


    <section class="unique-donation" aria-label="من فرص التبرع">
        <div class="container">
            <div class="line-with-words my-5">
                <img width="300" class="mx-auto" src="{{ asset('frontend/assets/images/ahseno-ayah.svg') }}" alt="وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" />
            </div>
            <section class="my-3 mb-4 py-md-5 py-4  rounded-2"id="waqf-header">
                <div class="container text-center d-md-flex justify-content-between align-items-center px-md-4">
                    <div class="text-md-start">
                        <h2 class="text-white mb-3">وقف آيثار</h2>
                        <p class="text-white text-justify fs-28px">صدقة جارية يدوم نفعها ويتضاعف أجرها.</p>
                    </div>
                </div>
            </section>
        </div>
        <div>
            <ul class="nav nav-pills justify-content-center" id="unique-donation-tabs" role="tablist"
                aria-label="أنواع فرص التبرع" data-a11y="parent">
                @foreach($categories as $key => $category)
                <li class="nav-item" role="presentation">
                    <a class="nav-link {{ $key == 0 ? 'active' : '' }}" id="pills-{{$category->slug}}-tab" data-bs-toggle="pill" href="#{{$category->slug}}-tab"
                       role="tab" aria-controls="projects-tab" aria-selected="true" data-a11y="child">
                        {{$category->name}} <img loading="lazy" src="{{ Storage::url($category->image) }}" alt="" />
                    </a>
                </li>
                @endforeach
            </ul>
        </div>
        <div class="tab-content bg-smoke-white-3 py-4" id="unique-donation-tabContent">
            @foreach($categories as $key => $category)
                <div class="tab-pane fade show {{ $key == 0 ? 'active' : '' }}" id="{{$category->slug}}-tab" role="tabpanel"
                 aria-labelledby="pills-{{$category->slug}}-tab">
                <div class="container">
                    <div class="row mb-0 mb-sm-4 cards-wrapper" role="region" aria-label="المشاريع الموصى بها">
                        <h3 class="visually-hidden">المشاريع الموصى بها</h3>


                        @foreach($category->campaigns as $campaign)
                            @include('frontend.campaign-card', ['campaign' => $campaign])
                        @endforeach
                     </div>
                    <div class="text-center mb-sm-5 mt-5 MobileBtn">
                        <a class="btn btn-primary-green rounded-pill px-5" aria-label="المزيد  " href="/category/{{$category->slug}}">المزيد  </a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>
    <section id="sponsers">
        <div class="container">
            <section class="sponsers pb-5 pt-3" aria-label="الجهات الإشرافية">
                <div class="line-with-words mb-4">
                    <div class="line me-5"></div>
                    <h5 id="sponsers" class="mb-0 title" aria-level="2">الجهات الإشرافية</h5>
                    <div class="line ms-5"></div>
                </div>
                <div class="sponsers-items px-0 px-lg-5">
                    <div class="d-none d-md-flex align-items-center justify-content-around justify-content-lg-between">
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/dar-aytam.jpeg') }}" alt="وزارة الداخلية" />
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/dnb.svg') }}" alt="وزارة المالية" />
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/hilal.jpeg') }}" alt="وزارة الصحة" />
                        <img style="width: 120px;" loading="lazy" src="{{ asset('frontend/assets/images/sponsors/kafa.jpeg') }}" alt="البنك المركزي السعودي" />
                       </div>
                    <div class="d-flex flex-wrap flex-md-nowrap align-items-center justify-content-around justify-content-lg-between mt-0 mt-md-5">
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/mahdi.jpeg') }}" alt="وزارة التعليم" />
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/makassed.jpeg') }}" alt="وزارة التجارة" />
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/rmf.jpeg') }}" alt="وزارة الموارد البشرية والتنمية الاجتماعية" />
                        <img loading="lazy" src="{{ asset('frontend/assets/images/sponsors/salib.svg') }}" class="" alt="red cross" />
                    </div>
                </div>

            </section>
        </div>
    </section>

    <section class="statistics">
        <div class="container position-relative d-flex flex-column justify-content-around" role="region"
             aria-label="آيثار في أرقام">
            <h3 class="text-center mb-4" aria-level="2">آيثار في أرقام</h3>
            <div class="row justify-content-center mb-3 text-center box py-4">
                <div class="col-md-4 col-12 pb-4">
                    <div class="mx-auto mb-3">
                        <img width="45" src="{{ asset('frontend/assets/images/ramadan1444.svg') }}" alt="إجمالي تبرعات وقف آيثار"
                             aria-hidden="true" />
                    </div>
                    <label class="title text-truncate mb-4">إجمالي تبرعات وقف آيثار</label>
                    <!-- // should be change to waqf amount -->
                    <div>
                        <span id="total-amount" class="amount">30,000</span>
                        <span class="currency ms-2">$</span>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center mb-2 text-center box py-5">
                <div class="col-md-4 col-12 pb-4">

                    <div class="icon mx-auto mb-3">
                        <img width="25" src="{{ asset('frontend/assets/images/icon-donations.svg') }}" alt="إجمالي التبرعات"
                             aria-hidden="true" />
                    </div>
                    <div class="title text-truncate mb-4">إجمالي التبرعات</div>
                    <div>
                        <span class="amount">
                            81,787
                        </span>
                        <span class="currency ms-2">$</span>
                    </div>
                </div>

                <div class="col-md-4 col-12 pb-4">

                    <div class="icon mx-auto mb-3">
                        <img width="25" src="{{ asset('frontend/assets/images/icon-add-user.svg') }}" alt="عدد المستفيدين"
                             aria-hidden="true" />
                    </div>
                    <div class="title text-truncate mb-1">
                        عدد المستفيدين من البرامج الخيرية و التنموية
                        <br/>
                        لعام
                        2024
                        حتى الآن
                    </div>
                    <div>
                        <span class="amount">
                            2,942
                            <small>مستفيد</small>
                        </span>
                    </div>
                </div>
                <div class="col-md-4 col-12 pb-4">

                    <div class="icon mx-auto mb-3">
                        <img width="25" src="{{ asset('frontend/assets/images/icon-add-user.svg') }}" alt="عدد عمليات التبرع"
                             aria-hidden="true" />
                    </div>
                    <div class="title text-truncate mb-4">
                        عدد عمليات التبرع
                    </div>
                    <div>
                        <span class="amount">
                            182,209
                             <small>عملية</small>
                        </span>
                    </div>
                </div>
            </div>
            <h5 class="text-center mt-md-3" role="presentation">
                <img width="300" src="{{ asset('frontend/assets/images/lntnalo-ayah.svg') }}" alt="لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ" />
            </h5>
        </div>
    </section>
@endsection
