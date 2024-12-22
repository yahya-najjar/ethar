@extends('frontend.layouts.app')

@section('style')

    <link rel="stylesheet" href="{{ asset('frontend/assets/css/about.css') }}">
@endsection

@section('content')

    <div class="container position-relative">
        <h2 class="visually-hidden">أنت هنا</h2>
        <nav aria-label="أنت هنا">
            <ol class="breadcrumb breadcrumb-onslider text-white">
                <li class="breadcrumb-item"><a class="text-white" href="/">الرئيسية</a></li>
                <li class="breadcrumb-item text-white"><span>عن إحسان</span></li>
                <li class="breadcrumb-item text-white active" aria-current="page">من نحن</li>
            </ol>
        </nav>
    </div>
    <section class="about-main center-items-vertically position-relative">
        <div class="container position-relative z-index-1070">
            <h1 class="text-white">عن إحسان</h1>
            <div class="row">
                <div class="col-12 col-sm-8 col-md-7">
                    <p class="text-white text-justify">جــــاءت منظومــــة إحســــان الصادرة بالأمر السامي رقم (48019) وتاريخه (1441/08/13هـ) لتعمـل علـى اسـتثمار البيانـات والـذكاء الاصطناعـي لتعظيـم أثـر المشـاريع والخدمـات التنمويـة واسـتدامتها، مـن خـلال تقديـم الحلــــول التقنيــــة المتقدمــــة وبنــــاء منظومــــة فاعلــــة عبــــر الشــــراكات مــــع القطاعــــات الحكوميــــة والخاصــــة وغيــــر الربحيــــة، بهــــدف تعزيــــز دور المملكــــة العربيــــة الســــعودية الريــــادي فــــي الأعمــــال التنمويــــة والخيريــــة، ورفــــع مســــاهمة القطــــاع غيــــر الربحــــي فــــي إجمالــــي الناتــــج المحلــــي.</p>
                </div>
            </div>
            <div class="about-main-logos mt-4">
                <img src="{{ asset('frontend/assets/images/logo-color.png') }}" class="me-4" alt="ehsan logo" />
                <img src="{{ asset('frontend/assets/images/logo-color.png') }}" alt="sdaia logo" />
            </div>
        </div>
        <img src="{{ asset('frontend/assets/images/white-plant-vector-lg.svg') }}" class="end--10px opacity-50 position-absolute w-33 z-index-1070" />
    </section>
    <div class="position-relative">
        <img class="end--10px position-absolute top-200px z-index-1070 w-sm-70px" src="{{ asset('frontend/assets/images/snapel-gray-lg.svg') }}" />
        <img class="d-md-block d-none position-absolute start--10px top-100px z-index-1070" src="{{ asset('frontend/assets/images/one-bg.svg') }}" />
        <img class="bottom-200px position-absolute start--10px w-350px d-none d-md-block" src="{{ asset('frontend/assets/images/snapel-green-lg.svg') }}" />
        <section class="about-vision">
            <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">إحسان ورؤية 2030</h2>
            <div class="container position-relative z-index-1070">
                <div class="d-flex justify-content-center my-5 flex-column flex-md-row">
                    <div class="text-center">
                        <div class="about-vision-icon arrow-lg-1">
                            <img src="{{ asset('frontend/assets/images/1.svg') }}" class="vector-icon w-sm-70px" />
                        </div>
                        <img src="{{ asset('frontend/assets/images/1-2.svg') }}" class="d-block d-md-none w-fit-content m-auto position-relative top--15px" />
                        <p class="fs-18px text-grey-4">وطن طموح</p>
                    </div>

                    <img class="d-none d-md-block" src="/src/images/aboutpage/about-vision/left-arrow-up.svg" />
                    <div class="d-flex flex-column text-center">
                        <img src="/assets/images/aboutpage/about-vision/2-2.svg" class="dashed-line h-18px m-auto w-fit-content d-block d-md-none" />
                        <div class="about-vision-icon arrow-lg-2 m-auto w-fit-content">
                            <img src="/assets/images/aboutpage/about-vision/2-1.svg" class="dashed-circle w-90px d-block d-md-none" />
                            <img src="/assets/images/aboutpage/about-vision/2.svg" class="p-1 vector-icon w-sm-80px" />
                        </div>
                        <img src="/assets/images/aboutpage/about-vision/2-3.svg" class="dashed-line-2 d-block d-md-none w-fit-content m-auto" />
                        <p class=" fs-18px text-grey-4">مواطنه مسؤول</p>
                    </div>
                    <img class="d-none d-md-block" src="/src/images/aboutpage/about-vision/left-arrow-down.svg">
                    <div class="d-flex flex-column text-center">
                        <img src="/assets/images/aboutpage/about-vision/3-2.svg" class="dashed-line h-18px m-auto w-fit-content d-block d-md-none" />
                        <div class="about-vision-icon m-auto w-fit-content">
                            <img src="/assets/images/aboutpage/about-vision/3-1.svg" class="dashed-circle d-block d-md-none w-90px" />
                            <img src="/assets/images/aboutpage/about-vision/3.svg" class="vector-icon w-sm-80px p-1" />
                        </div>
                        <p class="fs-18px text-grey-4">رفع مساهمة القطاع غير الربحي</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="about-mission bg-body-tertiary pb-60px pt-1">
            <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">
                الرؤية والرسالة
            </h2>
            <div class="m-auto w-75 d-flex flex-wrap justify-content-center mb-4 px-md-4">
                <div class="bg-white col-md-5 col-12 d-block p-4 rounded-10px shadow me-3 text-center mt-4">
                    <div class="position-relative">
                        <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                        <h5 class="mt-10px position-absolute text-primary top-0 w-100">رؤيــة إحسان</h5>
                    </div>
                    <p class="px-4 text-grey-4 mt-2">
                        تمكين قطاع العمل الخيري والتنموي رقمياً للمحافظة على المشاركة المجتمعية الفعّالة وتعظيم الأثر وتحقيق مركزاً متقدماً
                        على المستوى العالمي.

                    </p>
                </div>
                <div class="bg-white col-md-5 col-12 d-block p-4 rounded-10px shadow text-center mt-4">
                    <div class="position-relative">
                        <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                        <h5 class="mt-10px position-absolute text-primary top-0 w-100">رسالــة إحسان</h5>
                    </div>
                    <p class="px-4 text-grey-4 mt-2">
                        تمكين قطاع العمل الخيري والتنموي الاجتماعي في المملكة من خلال الاستفادة من المعلومات القائمة على البيانات؛ لتفعيل الربط الرقمي بين المتبرعين والجهات الخيرية، وتسويق العمل الخيري، وتقديم الإرشادات للجهات الخيرية واستخدام البيانات التي تم إنشاؤها.
                    </p>
                </div>
            </div>
        </section>
        <section class="about-goals bg-grey">
            <div class="container">
                <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">
                    الأهداف
                </h2>
                <div class="row justify-content-center px-md-5 px-2">
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">إنشـــاء</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">منصة رقمية تفاعلية وشاملة تركّز على تجربة المستخدم</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">اعتمـــاد</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">استخدام المنصة الرقمية من قبل المتبرّعين وجهات جمع التبرّعات من خلال التسويق.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">تنسيـــق</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">التوافق بين أصحاب المصلحة في القطاع الخيري المحلي بشأن الأدوار والمسؤوليات.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">تعزيــــز</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">الحملات التسويقية التي تستهدف مشاركين جدد في الأنشطة الخيرية.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">تمكيــن</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">فرص التطوّع ودفع المستخدمين إلى المشاركة في الأنشطة الخيرية عبر المنصة.</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">تقديــم</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">الإرشـــادات إلـــى جهــات جمـــــــع التبرّعات من أجل تعزيز العمليات وتسريع التبني الرقمي</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">إعــداد</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px"> قاعـدة بيانـــات خاصـــة بقطـــاع التبرّعـات وإعـــداد أبحاث تحتوي معلومات قائمة على البيانات</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">تحسيـن</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">أداء وترتيــب المملكــة العربيـــة السعودية في المؤشرات العالمية الخاصة بالعطاء الخيري.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">توظيــف</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">
                                    القدرات الرقمية والذكاء الاصطناعي علــى المستـــوى الداخلـــي وإبـــرام الشراكات المحلية والدولية اللازمة.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-3">
                        <div class="about-goals-box align-items-baseline d-flex">
                            <img class="me-1 w-22px" src="/src/images/aboutpage/about-goals/icon-about-goals.svg" />
                            <div class="">
                                <h5 class="font-bold fs-28px text-primary-blue">ضمــان</h5>
                                <p class="fs-20px text-grey-4 fs-sm-14px">
                                    الشفافية ورفع تقارير عن أنشطة المنصة الرقمية
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="about-rakaez bg-body-tertiary pb-60px pt-1">
            <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">
                الركائــــز
            </h2>
            <div class="m-auto w-75 d-flex flex-wrap justify-content-center mb-4 px-md-4">
                <div class="bg-white col-md-3 d-block p-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                    <div class="position-relative">
                        <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                        <h5 class="mt-10px position-absolute text-primary top-0 w-100">الركيزة الأولى</h5>
                    </div>
                    <p class="px-4 text-grey-4 font-semibold mt-2">
                        تسهيل رحلة التبرّع الرقمية
                    </p>
                </div>
                <div class="bg-white col-md-3 d-block p-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                    <div class="position-relative">
                        <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                        <h5 class="mt-10px position-absolute text-primary top-0 w-100">الركيزة الثانية</h5>
                    </div>
                    <p class="px-4 text-grey-4 font-semibold mt-2">
                        تشجيع  المشاركة المجتمعية
                    </p>
                </div>
                <div class="bg-white col-md-3 d-block p-4 rounded-10px shadow text-center mt-4">
                    <div class="position-relative">
                        <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                        <h5 class="mt-10px position-absolute text-primary top-0 w-100">الركيزة الثالثة</h5>
                    </div>
                    <p class="px-4 text-grey-4 font-semibold mt-2">
                        تسريع عملية تطوير الممكّنات
                    </p>
                </div>
            </div>
        </section>
        <section class="about-features">
            <div class="container position-relative">
                <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">
                    المــزايــــا
                </h2>

                <div class="m-auto d-flex flex-wrap justify-content-center mb-4 px-md-2">
                    <div class="col-md-4 col-12">
                        <div class="bg-white py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">السهــولة</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                فـي متنـاول اليـد تسهل مـن عملية التبـرع فـي أي وقت وأي مكان

                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 col-12">
                        <div class="bg-white d-block py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">التنـــوع</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                مجالات متنوعة في فرص التبرع تغطي العديد من جوانب العمل الخيري
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 col-12">
                        <div class="bg-white d-block py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">الشفافيــــة</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                نتبع أعلى معايير الشفافية في الممارسات الإدارية والماليـة
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 col-12">
                        <div class="bg-white d-block py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">التقاريــــر</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                العناية بالمتبرعين من خلال تزويدهم بتقاريـر تعكس أثر تبرعاتهم
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 col-12">
                        <div class="bg-white d-block py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">الأمـــــان</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                تطبق المنصة أعلـى المعايير التقنية في أمـن المعلومات
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4 col-12">
                        <div class="bg-white d-block py-4 rounded-10px shadow me-0 me-md-4 text-center mt-4">
                            <div class="position-relative">
                                <div class="bg-body-tertiary bg-with-img h-50px m-auto rounded-circle w-50px bg-with-img position-relative"></div>
                                <h5 class="mt-10px position-absolute text-primary top-0 w-100">السرعـــــة</h5>
                            </div>
                            <p class="px-4 text-grey-4 mt-2 fs-14px">
                                خيارات متعددة لتسريع عمليـة التبـرع أهمها خاصية التبرع السريع
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="about-donation pt-2 pb-5 bg-body-tertiary">
            <div class="container position-relative">
                <h2 class="m-auto position-relative px-10px section-title text-center text-primary-blue w-fit-content z-index-2 mt-5 mb-4">
                    مجالات التبرع
                </h2>
                <div class="d-flex flex-wrap justify-content-center w-75 m-auto">
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/icon-1.svg" alt="تعليمي" />
                        </div>
                        <label>تعليمي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/icon-3.svg" alt="صحي" />
                        </div>
                        <label>صحي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/house.svg" alt="سكنــي" />
                        </div>
                        <label>سكنــي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/mosque.svg" alt="دينــي" />
                        </div>
                        <label>دينــي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/icon-2.svg" alt="اجتماعي" />
                        </div>
                        <label>اجتماعي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/veg.svg" alt="غذائــي" />
                        </div>
                        <label>غذائــي</label>
                    </div>
                    <div class="col-md col-4 about-donation-key">
                        <div class="donation-key-circle">
                            <img src="/assets/images/aboutpage/about-donation/icon-8.svg" alt="وغيرها" />
                        </div>
                        <label>وغيرها</label>
                    </div>
                </div>
            </div>
        </section>

@endsection
