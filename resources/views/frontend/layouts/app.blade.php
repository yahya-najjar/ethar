<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="google-site-verification" content="sBtO8lO8mP-uhXzfSWACwglKFfAVNSXffD7DF_UBL3o" />
    <meta name="facebook-domain-verification" content="6hznv36latc7ty6scwvn3njd634mal" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <link rel="canonical" href="https://ehsan.sa/">
    <meta name="keywords" content="تبرع,آيثار,فرجت,أضحية,أضاحي,زكاة,صدقة,كفارة,إغاثة,هدية,عقيقة" />
    <meta name="theme-color" content="#2d6c81" />

    <meta name="apple-itunes-app" content="app-id=1602515092">
    <meta name="keywords" content="تبرع, تبرعات, موقع تبرعات, برنامج تبرعات, تبرع اون لاين, منصة تبرع, تبرع صدقة جارية, اهداء تبرع, موقع تبرع, تبرعات خيرية, تبرع احسان, تبرع بالدم, سقيا الماء, متجر تبرع, جمعية تبرع, تبرع جمعية خيرية, تبرع يومي, تبرع شهري, تبرع دوري, تبرع وقف, تطبيق تبرع, تبرع رسائل, رسالة تبرع, تبرع سريع, تبرع عام, تبرع محتاج, تبرع فقير, استقطاع تبرع, تبرع باسم شخص, بطاقات تبرع, استقطاع شهري, زكاة الفطر,الزكاة و الدخل,مصلحة الزكاة والدخل,طريقة حساب الزكاة,حكم الزكاة,زكاة المال,زكاة الذهب,حساب الزكاة,حكم زكاة الفطر,حساب زكاة المال,تعريف الزكاة,مقدار الزكاة,حاسبة الزكاة,كفالة يتيم,كفالة اليتيم,صدقة يتيم,تبرع يتيم,كافل اليتيم,فضل كفالة اليتيم,كفالة يتيم شهرياً,طريقة كفالة يتيم,احسان كفالة يتيم,كيف اكفل يتيم,جمعية كفالة يتيم,شروط كفالة اليتيم,كفالة أرملة,كفالة أرامل,جمعية كفالة أرملة,كفالة مطلقة,كفالة الأيتام
, صدقة جارية, تبرع صدقة جارية, أفضل الصدقة, صدقة الفطر, أنواع الصدقة الجارية, ماهي الصدقة, طرق الصدقة اليومية, حفر بئر صدقة جارية, صدقة جارية للمرحوم, أنواع الصدقات, صدقة سقيا الماء, وقف الصدقة الجارية, اهداء صدقة جارية, ماهي الصدقة, صدقة جارية للميت, كفاره, ما هي كفارة اليمين, ما هي كفارة يمين, قيمة الكفارة, كفارة صيام, كفارة الكذب, دفع كفارة اليمين, كفارة صيام رمضان, كفارة المجلس, اطعام عشرة مساكين, أنواع الكفارة, كم كفارة اليمين, اخراج كفارة اليمين, كم سعر كفارة اليمين, حساب كفارة يمين, جمعية كفارة يمين, جمعية خيرية كفارة, شروط كفارة اليمين, تسديد كفارة يمين, اطعام مسكين, اطعام ستين مسكين, طعام مسكين,     " />

    <title>@yield('title', '&#x627;&#x644;&#x635;&#x641;&#x62D;&#x629; &#x627;&#x644;&#x631;&#x626;&#x64A;&#x633;&#x64A;&#x629; - منصة آيثار ')</title>
    <!-- Include styles -->
    @include('frontend.layouts.css')
    @yield('style')
</head>
<body data-url='/ramadan-data' data-total-amount="/waqf/total-data" data-total-amount-target="totalWaqf">
    <div class="wrapper layout-1">
        <!-- Navigation -->
        @include('frontend.layouts.header')

        <!-- Main content -->
        <main id="maincontent" class="home-page">
            @yield('content')
        </main>

    </div>
    <!-- Footer -->
    @include('frontend.layouts.footer')

    <!-- Include scripts -->
    @include('frontend.layouts.scripts')
</body>
</html>
