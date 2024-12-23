<header class="fixed-top"
        data-srOpenNotification='تم فتح القائمة الجانبية. لإغلاق القائمة، اضغط على زر "القائمة" أو اضغط مفتاح الهروب'
        data-srCloseNotification='تم إغلاق القائمة الجانبية' role="banner">
    <input type="hidden" value="" id="isLoggedIn" />
    <a href="#maincontent" class="d-none d-md-block btn btn-primary-green px-5 btnSkipToMainContent">التخطي إلى المحتوى
        الرئيسي</a>
    <div class="nav-top d-none d-md-block position-relative" style="z-index: 9999;">
        <div class="container position-relative">
            <a href="/" class="navbar-brand"><img loading="lazy" src="{{ asset('frontend/assets/images/logo-color.png') }}" alt="منصة آيثار، منصة وطنية للعمل الخيري"></a>
            <div class="nav nav-underline align-items-center justify-content-end">
                @if(auth('client')->check())
                    <a class="nav-link p-0 mt-1 pe-3" href="#" onclick="event.preventDefault(); document.getElementById('user-logout-form').submit();">
                        <img class="icon" src="{{ asset('frontend/assets/images/icon-profile.svg') }}" alt="تسجيل الخروج" />
                        <span class="text-primary-blue">تسجيل الخروج</span>
                    </a>
                    <form id="user-logout-form" action="{{ route('user.logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                @else
                    <a class="nav-link p-0 mt-1 pe-3" href="{{ route('user.login') }}">
                        <img class="icon" src="{{ asset('frontend/assets/images/icon-profile.svg') }}" alt="تسجيل الدخول" />
                        <span class="text-primary-blue">تسجيل الدخول</span>
                    </a>
                @endif
            </div>
        </div>
    </div>
    <div class="navbar navbar-expand-md navbar-light bg-white p-0">
        <div class="container">
            <button id="mobileMenuBtn" class="navbar-toggler p-0 border-0 ms-3" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#navbarMenu" aria-expanded="false" aria-label="القائمة" accesskey="ق">
                <span class="navbar-toggler-icon" aria-hidden="true"></span>
            </button>
            <a href="#maincontent" class="d-block d-md-none btnSkipToMainContent">التخطي إلى المحتوى الرئيسي</a>
            <a href="/" class="navbar-brand d-block d-md-none me-0 ps-3"><img loading="lazy" src="{{ asset('frontend/assets/images/logo-color.png') }}" alt="منصة آيثار، منصة وطنية للعمل الخيري"></a>
            <div class="d-block d-md-none d-flex align-items-end me-3">
                <a class="border-0 me-3 cart_count" href="/cart" id="cart">
                    <sup class="cartCount badge d-none"></sup>
                    <img class="icon" src="{{ asset('frontend/assets/images/icon-shopping_cart.svg') }}" alt="سلة تبرعاتك" />
                </a>
                @if(auth('client')->check())
                    <a class="" href="#" onclick="event.preventDefault(); document.getElementById('user-logout-form').submit();">
                        <i class="fas fa-user" aria-label="تسجيل الخروج" style="font-size: 23px;"></i>
                    </a>
                    <form id="user-logout-form" action="{{ route('user.logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                @else
                    <a href="{{ route('user.login') }}">
                        <i class="fas fa-user" aria-label="تسجيل الدخول" style="font-size: 23px;"></i>
                    </a>
                @endif
            </div>
            <nav class="navbar-collapse offcanvas offcanvas-start w-75" id="navbarMenu" aria-label="القائمة الجانبية"
                 aria-describedby="mainMenuDescription">
                <div id="closeMenuFocusout" data-bs-dismiss="offcanvas" class="d-block d-md-none"
                     style="height: 100%;position: absolute;top: 0;width: 25%;left: 0;" role="button"
                     aria-label="القائمة" tabindex="0" aria-expanded="true" accesskey="ق"></div>
                <div class="navbar-mobile d-flex flex-column justify-content-between w-100">
                    <div class="d-block d-md-flex align-items-md-center">
                        <div class="d-block d-md-none text-end pt-3">
                            <button id="closeNavbar" class="btn pb-0" type="button" aria-hidden="true" tabindex="-1"><i
                                    class="fas fa-chevron-right" style="font-size: 22px;"></i></button>
                        </div>
                        <div class="d-flex d-md-none border-bottom">
                            <a class="nav-link pt-0" href="/auth/login">
                                <img class="icon" src="{{ asset('frontend/assets/images/icon-profile.svg') }}" alt="تسجيل الدخول" />
                                <span class="user-name text-primary-blue">تسجيل الدخول</span>
                            </a>
                        </div>
                        <ul class="navbar-nav me-auto" aria-label="القائمة الرئيسية"
                            aria-owns="extraMenuItem1 extraMenuItem2 extraMenuItem3">
                            <li class="nav-item active">
                                <a class="nav-link" href="/"
                                   aria-current="page" accesskey="0">الرئيسية</a>
                            </li>
                            <li class="nav-item dropdown ">
                                <a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-bs-toggle="dropdown"
                                   aria-haspopup="true" aria-expanded="false"
                                   aria-current="false">فرص التبرع</a>
                                <div class="dropdown-menu border-0">
                                    <div class="container d-flex flex-wrap flex-column flex-md-row justify-content-center p-0 p-md-2"
                                         role="list" aria-labelledby="dropdown01">
                                        <div role="listitem">
                                            <a class="dropdown-item" href="/all" accesskey="ك">
                                                <div
                                                    class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                    <img loading="lazy" src="{{ asset('frontend/assets/images/icon-all.svg') }}" alt="" />
                                                    الكل
                                                </div>
                                            </a>
                                        </div>
                                        @foreach($categories as $category)
                                        <div role="listitem">
                                            <a class="dropdown-item" href="/category/{{$category->slug}}"
                                               accesskey="م">
                                                <div
                                                    class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                    <img src="{{ Storage::url($category->image) }}" alt="" />
                                                    {{ $category->name }}
                                                </div>
                                            </a>
                                        </div>
                                        @endforeach
                                    </div>
                                </div>
                            </li>
                            <li class="nav-item dropdown ">
                                <a class="nav-link dropdown-toggle" href="#" id="dropdown02" data-bs-toggle="dropdown"
                                   aria-haspopup="true" aria-expanded="false"
                                   aria-current="false">برامجنا</a>
                                <div class="dropdown-menu border-0">
                                    <div class="container d-flex  flex-wrap flex-column flex-md-row justify-content-center p-0 p-md-2"
                                         role="list" aria-labelledby="dropdown02">
                                        @foreach($programs as $program)
                                        <div role="listitem">
                                            <a class="dropdown-item" href="/program/{{$program->slug}}" accesskey="ر">
                                                <div
                                                    class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                    <img loading="lazy" src="{{ Storage::url($program->icon) }}" alt="" />
                                                    {{ $program->name }}
                                                </div>
                                            </a>
                                        </div>
                                        @endforeach
                                    </div>
                                </div>
                            </li>
                            <li class="nav-item dropdown ">
                                <a class="nav-link dropdown-toggle" href="#" id="dropdown03" data-bs-toggle="dropdown"
                                   aria-haspopup="true" aria-expanded="false" aria-current="false">عن
                                    آيثار</a>
                                <div class="dropdown-menu border-0">
                                    <div class="container d-flex flex-column flex-md-row justify-content-center p-0"
                                         role="list" aria-labelledby="dropdown03">
                                        <div role="listitem">
                                            <a class="dropdown-item" accesskey="ع" href="{{ route('about') }}">
                                                <div
                                                    class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                    <img loading="lazy" src="{{ asset('frontend/assets/images/icon-about.svg') }}" alt="" />
                                                    من نحن
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="nav-item d-md-none">
                                <a class="nav-link" href="/majordonors" aria-current=""
                                   accesskey="ا">أبرز المحسنين</a>
                            </li>
                            <li class="nav-item d-md-none">
                                <a class="nav-link" href="/gheraslist" aria-current=""
                                   accesskey="ء">سفراء غراس</a>
                            </li>
                        </ul>
                        <a class="btn btn-gradient px-lg-5 d-none d-md-block" href="{{ route('donate') }}">تبرع
                            الآن</a>
                    </div>
                    <div class="d-block d-md-none">
                        <ul class="navbar-nav me-auto" aria-label="القائمة الإضافية">
                            <li id="extraMenuItem1" class="nav-item" aria-hidden="false">
                                <a class="nav-link"
                                   href="/completed?initiativeType=CompletedProject">الفرص
                                    المكتملة</a>
                            </li>
                            <li id="extraMenuItem3"
                                class="align-items-center d-flex flex-wrap justify-content-center mb-4 mb-md-0"
                                aria-hidden="false" aria-label="حمل تطبيق آيثار" role="group">

                                <span class="nav-link w-100">
                                    حمل تطبيق آيثار
                                </span>
                                <a target="_blank"
                                   href="#"
                                   class="me-3">
                                    <img loading="lazy" src="{{ asset('frontend/assets/images/app-store.svg') }}" alt="تنزيل التطبيق من متجر App Store" />
                                </a>
                                <a target="_blank"
                                   href="#">
                                    <img loading="lazy" src="{{ asset('frontend/assets/images/play-store.svg') }}" alt="تنزيل التطبيق من متجر Google Play" />
                                </a>

                            </li>
                        </ul>
                    </div>
                </div>
                <span id="mainMenuDescription" class="visually-hidden" aria-hidden="true">استعمل مفتاح الانتقال للتنقل
                    بين عناصر القائمة الجانبية، ومفتاح الهروب لإغلاقها.</span>
            </nav>
        </div>
    </div>
</header>
