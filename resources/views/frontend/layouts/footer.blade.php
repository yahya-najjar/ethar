<footer class="footer-large" role="presentation">
    <div class="content-1"></div>
    <div class="content-3">
        <div class="container">
            <div class="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center">
                <nav class="nav fs-16px d-flex flex-column flex-md-row hide-in-payment" role="Complementary"
                     aria-label="تواصل معنا">
                    <a class="nav-link nav-link-txt me-3 me-lg-0 mb-3 mb-lg-0 text-white" target="_blank"
                       href="https://twitter.com/Etharlb" rel="noopener" aria-label="تابعنا على Twitter">
                        <i class="fab fa-twitter me-2 fs-5" aria-hidden="true"></i>تويتر منصة آيثار
                    </a>

                    <a class="nav-link nav-link-txt me-3 me-lg-0 mb-3 mb-lg-0 text-white" href="tel:8001247000"
                       rel="noopener" aria-label="تواصل معنا عن طريق مركز الاتصال: 800 124 7000" accesskey="ك">
                        <i class="fas fa-phone me-2 rotate-90deg fs-5" aria-hidden="true"></i>مركز الاتصال
                        8001247000
                    </a>
                </nav>

                <div class="links fs-16px" role="Complementary" aria-label="روابط تهمك">
                    <a class="app-link faq-link hide-in-payment" href="/smsdonation"
                       accesskey="ص">
                        التبرع بالرسائل النصية
                    </a>
                    <a class="app-link faq-link" accesskey="س" href="/home/faq">
                        الأسئلة الشائعة
                    </a>
                    <a class="app-link faq-link" accesskey="خ" href="/privacy">
                        سياسة الخصوصية
                    </a>
                    <a class="app-link faq-link" accesskey="ل" href="/accessibility">
                        إمكانية الوصول
                    </a>

                    <a class="app-link faq-link" accesskey="ا" href="/serviceagreement">
                        اتفاقية مستوى الخدمة
                    </a>

                </div>
            </div>
        </div>
    </div>
    <div class="content-4">
        <div class="container">
            <div class="align-items-center d-flex flex-md-nowrap flex-wrap justify-content-between" role="contentinfo">
                <span class="order-2 order-md-0 fs-16px">
                    جميع الحقوق محفوظة لمنصة آيثار
                    2024
                </span>
                <div class="align-items-center d-flex d-md-inline justify-content-around mb-4 mb-md-0 order-1 order-md-0 col-12 col-md-5 hide-in-payment">
                    <span class="fs-16px">حمل تطبيق آيثار</span>
                    <a target="_blank"
                       href="#"
                       class="mx-0 mx-md-3">
                        <img loading="lazy" src="{{ asset('frontend/assets/images/app-store.svg') }}" alt="تنزيل التطبيق من متجر App Store" class="me-md-2" />
                    </a>
                    <a target="_blank" href="#">
                        <img loading="lazy" src="{{ asset('frontend/assets/images/play-store.svg') }}" alt="تنزيل التطبيق من متجر Google Play" class="me-md-2" />
                    </a>
                </div>
                <div class="align-items-center d-flex flex-column order-3 order-md-0">
                    <span>Powered by</span>
                    <div class="mt-2" id="SdaiaLogo">
                        <p>Abdurahman Almostafa</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</footer>
<span id="srNotificationArea" class="sr-only" aria-live="polite" role="status"></span>
<div class="modal fade share-modal" id="share-modal" tabindex="-1" role="dialog" aria-labelledby="share-modal-text"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-rounded-15 px-4 py-3">
            <div class="modal-head mb-0">
                <button id="toggle-share-modal" class="btn btn-close" type="button" data-bs-toggle="modal"
                        data-bs-target="#share-modal" aria-label="إغلاق"></button>
            </div>
            <div class="text-center mt-0 mb-1">
                <img class="rounded mx-auto mb-5 d-block" src="{{ asset('frontend/assets/images/share-img.svg') }}" alt="twitter-icon" />
                <h5 id="share-modal-text" class="text-primary-green ">مشاركة عبر وسائل التواصل الاجتماعي</h5>
            </div>
            <div class="position-relative text-center font-semibold show-ghiras-text">
                    <span>
                        ليتم احتساب نقاط غراس، قم <a class="text-primary-blue text-underline" href="/auth/login">بتسجيل الدخول</a>
                    </span>
                <img class="custom-tooltip align-top" src="{{ asset('frontend/assets/images/icon-info.svg') }}" alt="مزيد من المعلومات" width="18" />
                <div class="custom-tooltip__text bg-lightyellow text-primary-blue" style=" width: 200px;">
                    خدمة تتيح لك
                    نشر فرص التبرع عبر وسائل التواصل، وكسب نقاط لكل عملية تبرع حصلت من الآخرين عن طريق نشرك.
                </div>
            </div>
            <div class="link-label mt-3">
                <i class="fa-2x fa-link fas me-2 text-light-grey"></i>
                <span class="text font-bold">رابط المشاركة</span>
            </div>
            <div class="share-link">
                <input style="direction:ltr;" id="ghiras_link_text" type="text" readonly aria-label="رابط المشاركة" />
                <button onclick="copyToClipboard()" class="btn btn-primary-green rounded-pill">نسخ الرابط</button>
            </div>
            <div class="social-icons">
                <a id="whatsappShareLink" class="btn watsapp"
                   href="whatsapp://send?text=GFG Example for whatsapp sharing" data-action="share/whatsapp/share"
                   target="_blank" rel="noopener">
                    <div>
                        <img loading="lazy" src="{{ asset('frontend/assets/images/whatsapp.svg') }}" alt="مشاركة عبر WhatsApp" />
                    </div>
                </a>
                <a id="twitterShareLink" class="btn twitter" href="" target="_blank" rel="noopener">
                    <div>
                        <img loading="lazy" src="{{ asset('frontend/assets/images/twitter.svg') }}" alt="مشاركة عبر Twitter" />
                    </div>
                </a>
                <a id="facebookShareLink" class="btn facebook" href="" target="_blank" rel="noopener">
                    <div>
                        <img loading="lazy" src="{{ asset('frontend/assets/images/facebook.svg') }}" alt="مشاركة عبر Facebook" />
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
