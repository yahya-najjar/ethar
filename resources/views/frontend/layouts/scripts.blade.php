<script src="{{ asset('frontend/lib/jquery/dist/jquery.min.js') }}"></script>
<script src="{{ asset('frontend/assets/js/jquery.filter_input.min.js') }}"></script>
<script src="{{ asset('frontend/lib/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('frontend/assets/js/tiptop.js') }}"></script>

<!-- Custom Script -->
<script src="{{ asset('frontend/static/js/common.js?v=fyQ7EjhV8EaD23oPMIMdzNIDHCgSMOuXeTuHaWu4Sbc') }}"></script>

<script src="{{ asset('frontend/lib/calendar/jquery.plugin.js') }}"></script>

<script src="{{ asset('frontend/lib/calendar/jquery.calendars.js') }}"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars.plus.js') }}"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars.picker.js') }}"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars.ummalqura.js') }}"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars.ummalqura-ar.js') }}"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars-ar.js') }}" type="text/javascript"></script>
<script src="{{ asset('frontend/lib/calendar/jquery.calendars.picker-ar.js') }}" type="text/javascript"></script>


<!-- SELECT2 -->
<script src="{{ asset('frontend/assets/js/select2.full.min.js') }}"></script>
<script src="{{ asset('frontend/assets/js/ar.js') }}"></script>
<script src="{{ asset('frontend/assets/js/jquery.unobtrusive-ajax.js') }}"></script>
<!-- Toggle Boostrap -->
<script>
    function AddClass(cc) { document.documentElement.classList.add(cc) };
    var avif = new Image();
    avif.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    avif.onload = function () { AddClass("avif") };
    avif.onerror = function () {
        var webp = new Image();
        webp.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
        webp.onload = function () { AddClass("webp") }
    }


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) { return new bootstrap.Tooltip(tooltipTriggerEl) });

    //Display Loading Message to Screen Readers.
    if (document.readyState == 'loading') $('#srNotificationArea').attr('aria-live', 'assertive').html('يجري تحميل الصفحة');
    function handleAmountEditOnChange(parent) {
        var inputValue = +$(parent + " .payment-info-box .amount").val();
        $('#editAmountBtn').attr('aria-label', 'المبلغ: ' + inputValue + ' ريال سعودي. اضغط لتعديل مبلغ التبرع');
        $(parent + " .payment-info-box .amount-display").html(inputValue);
        $("#qd_amount").val(inputValue);
        let amountQuick = $('.amount-quick');
        let qd_amount = $('.qd_amount')
        if (amountQuick.length) {
            amountQuick.each(function (index, element) {
                $(element).html(inputValue);
            });
        }
        if (qd_amount.length) {
            qd_amount.each(function (index, element) {
                $(element).val(inputValue);
            });
        }
        $(parent + " .payment-info-box .amount-display").addClass("toggle-hide");
    }

    function showInputAmount(parent) {
        var inputElem = $(parent + " .payment-info-box input");
        var amountDisplayElem = $(parent + " .payment-info-box .amount-display");
        if (!inputElem.hasClass("error") && !$(parent + " .payment-info-box").hasClass("editing")) {
            if (inputElem.hasClass("toggle-hide")) {
                inputElem.removeClass("toggle-hide").attr('aria-hidden', 'false').attr('tabindex', '0');
                setTimeout(function () { inputElem.focus(), 200 });
                amountDisplayElem.addClass("toggle-hide");
                $(parent + " .payment-info-box").addClass("editing");
            }
        }
    }

    function hideInputAmount(parent) {
        var inputElem = $(parent + " .payment-info-box input");
        var amountDisplayElem = $(parent + " .payment-info-box .amount-display");
        var amount = $("#qd_amount_modified").val();
        $("#qd_amount_edited").val(amount);
        if (!inputElem.hasClass("error")) {
            inputElem.addClass("toggle-hide").attr('aria-hidden', 'true').attr('tabindex', '-1');
            amountDisplayElem.removeClass("toggle-hide");
            setTimeout(function () {
                $(parent + " .payment-info-box").removeClass("editing");
                $('#editAmountBtn').focus();
            }, 200);
        }
    }

    var addCartToStorage = function (cartObj) {
        var cartStr = JSON.stringify(cartObj);
        sessionStorage.setItem("ihsan_cart", cartStr);

    }

    var getCartObj = function () {
        var cart = sessionStorage.getItem("ihsan_cart");
        return JSON.parse(cart);
    }

    var clearCartStorage = function () {
        sessionStorage.removeItem("ihsan_cart");
    }

    var confirmRemove = function (id, bindCartToPage = true) {
        this.id = id;
        remnove_cart_item(this.id, bindCartToPage);
        //ConfirmDialog("تأكيد", "هل أنت متأكد من حذف التبرع", (id) => remnove_cart_item(this.id, bindCartToPage));
    }

    var remove_cart_item_subsidy = function (id, bindCartToPage) {
        var cartObj = getCartObj()
        var itemToRemoveIndex = cartObj.findIndex(x => x.id == id);
        if (itemToRemoveIndex > -1) {
            cartObj.splice(itemToRemoveIndex, 1);
            addCartToStorage(cartObj);

            //window.updateCart();
            if (bindCartToPage) {
                window.bindCartToPage();
            }
        }
    }

    var bindCartControlsToCards = function () {

        var cartObj = getCartObj();
        if (!cartObj) return;
        cartObj.forEach(c => {
            var caseIdInput = $("input[name=id][value=" + c.id + "]");
            if (caseIdInput && caseIdInput.length > 0) {
                if ((caseIdInput.closest("form").find(".initiativeType") && caseIdInput.closest("form").find(".initiativeType").val() == c.type)
                    || (caseIdInput.closest("form").find("input[name=type]") && caseIdInput.closest("form").find("input[name=type]").val() == c.type)) {
                    var form = caseIdInput.parents("form");
                    // replaceAddToCart(form);
                }
            }
            var cartContainer = $("#cart_ctr");
            if (cartContainer && cartContainer.length > 0) {
                var caseIdInput_html = $("input[name=id]");
                if (caseIdInput_html && caseIdInput_html.length > 0 && caseIdInput_html.val() == c.id) {
                    // replaceAddToCart(cartContainer);
                }
            }
        })
    }

    var update_cart_item_amount = function (id) {
        var val = document.getElementById("amount_input_" + id);
        var amount = val.value;
        //if (amount < 0) return;
        if (!(/^\d+$/.test(Number(amount)))) return false;

        var cartObj = getCartObj();

        var itemToUpdateIndex = cartObj.findIndex(x => x.id == id);
        if (itemToUpdateIndex > -1) {
            cartObj[itemToUpdateIndex].amount = amount;
            addCartToStorage(cartObj);
            //window.updateCart();
        }
    }

    var replaceAddToCart = function (cardForm) {
        cardForm.find('.cart-ctr, .already-donate').toggleClass('d-flex').toggle();
        cardForm.find('.cart-ctr-subsidy, .already-donate-subsidy').toggleClass('d-flex').toggle();
    }

    var togglePanels = function (show, hide) {
        if (show) {
            show.addClass("d-flex");
            show.css("display", "");
        }
        if (hide) {
            hide.removeClass("d-flex");
            hide.css("display", "none");
        }
    }

    var remnove_cart_item = function (id, bindCartToPage) {
        var cartObj = getCartObj()
        var itemToRemoveIndex = cartObj.findIndex(x => x.id == id);
        if (itemToRemoveIndex > -1) {
            cartObj.splice(itemToRemoveIndex, 1);
            addCartToStorage(cartObj);
            //window.updateCart();
            if (bindCartToPage) {
                window.bindCartToPage();
            }
        }
    }

    window.updateCart = function () {
        var cartTotalContainer = $("#cart_total");
        var total = 0;
        var cartItems = getCartObj();
        if (cartTotalContainer) {
            var cartItems = getCartObj();
            if (cartItems && cartItems.length > 0) {
                cartItems.forEach(x => {
                    let value = x.amount
                    if (!(/^\d+$/.test(value))) return false;
                    total += Number(x.amount)
                });
            }
            cartTotalContainer.text(total);
            var totalHiddenInput = $("#cart_total_hidden");
            if (totalHiddenInput) totalHiddenInput.val(total);
        }

        if (cartItems) {
            let length = cartItems.length;
            if ($('.cart_count .badge').length === 0) {
                $(".cart_count").prepend("<sup class=\"badge\">" + length + "</sup>");
            }
            else {
                if (length === 0) {
                    $(".cart_count .badge").remove();
                    sessionStorage.removeItem("ihsan_cart");
                }
                else
                    $(".cart_count .badge").text(length);
            }
        }
    }

    var navigateToDonation = function (i, url, id) {
        const amount = document.getElementById(`item-${id}-amount`).value || null;
        window.location.href = `${url}?amount=${amount}`;
    }

    var navigateToMolDetail = function (i, url) {
        var input = $(i);
        var form = input.parents("form");
        var amountInput = form.find("input[name=cartamount]");
        var url = url + '&amount=' + (amountInput && amountInput.val());
        window.location.href = url;
    }

    var navigateToZakahDetail = function (i, url) {
        var input = $(i);
        var form = input.parents("form");
        var isValid = form.valid();
        if (!isValid) {
            form.submit();
            return;
        }
        var amountInput = form.find("input[name=cartamount]");
        var url = url + '?amount=' + (amountInput && amountInput.val());
        window.location.href = url;
    }

    window.switchCartPanels = function (cardForm) {
        if (!cardForm) return;
        var idInput = cardForm.find("input[name=id]");
        if (!idInput) return;
        var cartCtr = cardForm.find("div.cart-ctr");

        var alreadyDonate = cardForm.find("div.already-donate");

        if (cartCtr.hasClass("d-flex")) togglePanels(alreadyDonate, cartCtr);
        else togglePanels(cartCtr, alreadyDonate)
    }

    var copyToClipboard = function () {
        try {
            var copyText = document.getElementById("ghiras_link_text");
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
            document.execCommand("copy");
        }
        catch (error) {
        }
    }

    //function BindCartEvents() {

    //    $('button[name=addToCatrBtn]').click(function () {
    //        $(this).closest('.cart-ctr-subsidy').toggleClass('d-flex').toggle();
    //        $(this).closest('.subsidy-card-cotrols').find(".already-donate-subsidy").toggleClass('d-flex').toggle();
    //        $(this).closest('.subsidy-card-cotrols').find(".already-donate-subsidy").toggleClass('d-none').toggle();
    //    });
    //    $('button[name=removeFromCart]').click(function () {
    //        $(this).closest('.already-donate-subsidy').toggleClass('d-flex').toggle();
    //        $(this).closest('.subsidy-card-cotrols').find(".cart-ctr-subsidy").toggleClass('d-flex').toggle();
    //        $(this).closest('.subsidy-card-cotrols').find(".cart-ctr-subsidy").toggleClass('d-none').toggle();

    //    });
    //}



    $(document).ready(function () {

        //BindCartEvents();

        $(".pre-amount").click(function () {
            var amount = this.dataset.amount;
            $("#qd_amount").val(amount);
            $("#qd_amount").trigger("change");
        });
        $(document).on("click", ".ghiras_share", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dataSets = $(e.currentTarget).data();
            var urlRout = '/all/share?caseid=' + dataSets.caseid + '&initiativetype=' + dataSets.casetype + '&casename=' + dataSets.casetitle + '&campaigncreatorid=' + dataSets.campaigncreatorid + '';
            if (dataSets.caseid) {
                $.ajax({
                    type: "Get",
                    url: urlRout,
                    success: function (response) {
                        var result = response;
                        var describtion = `أجر لك وأجر لي %0aساهم معي في التبرع لـ (${dataSets.casetitle}) عبر %23منصة_آيثار:`;
                        $("#facebookShareLink").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + result + "&quote=" + describtion);
                        $("#twitterShareLink").attr("href", "https://twitter.com/intent/tweet?url=" + " " + result + "&text=" + describtion + "&hashtags=");
                        $("#whatsappShareLink").attr("href", "https://wa.me/?text=" + describtion + "%0a" + result);
                        $("#ghiras_link_text").val(result);
                        var myModal = document.getElementById('share-modal');
                        var modal = bootstrap.Modal.getOrCreateInstance(myModal)
                        modal.show()
                    },
                    error: function (err) {
                    }
                });
            }

        });

        $("body").on("keydown keyup change", "input.cart-amount", function (e) {
            var maxvalue = parseInt($(this).closest(".card").find('.MaxValueBoxValue').text().replace(/,/g, ""))
            if ($(this).val() > maxvalue
                && e.keyCode !== 46
                && e.keyCode !== 8
            ) {
                e.preventDefault();
                $(this).val(maxvalue);
            }
        })

        $("body").on("focus", "input.cart-amount", function () {
            $('.MaxValueBox').removeClass('ShowMaxValueBox')
            $(this).closest(".card").find('.MaxValueBox').addClass('ShowMaxValueBox')

        });

        $("body").on("focusout", "input.cart-amount", function () {
            $('.MaxValueBox').removeClass('ShowMaxValueBox')
        });

        bindCartControlsToCards();

        init_fields_validations();
        //window.updateCart();

        $("body").on("reset", "form[name=addToCart]", function (e) {
            e.preventDefault();
            var idInput = $(e.currentTarget).find("input[name=id]");
            if (!idInput) return;
            remnove_cart_item(idInput.val(), false);
            var cardForm = $(e.currentTarget);

            window.switchCartPanels(cardForm);

        });


        var itemTypes = [
            { type: "Project", val: "&#x645;&#x634;&#x631;&#x648;&#x639;" },
            { type: "SpecialNeeds", val: "&#x627;&#x644;&#x643;&#x641;&#x627;&#x631;&#x627;&#x62A;" },
            { type: "Zakah", val: "&#x627;&#x644;&#x632;&#x643;&#x627;&#x629;" },
            { type: "Rescue", val: "&#x625;&#x63A;&#x627;&#x62B;&#x629;" },
        ];

        $("body").on("submit", "form[name=addToCart]", function (e) {
            handleAddToCart(e);
        });

        $("body").on("click", "button[name=addToCatrBtn]", function (e) {

            handleAddToSubsidyCart(e);
        });

        function handleAddToCart(e) {
            e.preventDefault();
            var cardForm = $(e.currentTarget);
            var amountInput = $(e.currentTarget).find("input[name=cartamount]");
            var titleInput = $(e.currentTarget).find("input[name=title]");
            var typeInput = $(e.currentTarget).find("input[name=type]");
            var idInput = $(e.currentTarget).find("input[name=id]");
            var contributionTypeInput = $(e.currentTarget).find("input[name=contributionType]");
            var attachmentURL = $(e.currentTarget).find("input[name=AttachmentURL]").val();

            var cartItemAmount = amountInput.val();
            var cartItemTitle = titleInput && titleInput.val();
            var cartItemId = idInput && idInput.val();
            var cartItemType = typeInput && typeInput.val();
            var contributionType = contributionTypeInput && contributionTypeInput.val();


            if (cartItemAmount < 0) return;
            if (!amountInput) return;
            if (!checkMax(amountInput)) return;

            var typeNameValue = null;
            for (var i = 0; i < itemTypes.length; i++) {
                if (itemTypes[i].type == cartItemType)
                    typeNameValue = itemTypes[i].val;
            }
            var cartItem = {
                amount: cartItemAmount,
                title: cartItemTitle,
                id: cartItemId,
                type: cartItemType,
                typeName: typeNameValue,
                contributionType: contributionType,
                attachmentURL: attachmentURL
            }

            try {

                var cartobj = getCartObj();
                if (!cartobj)
                    cartobj = [];
                else {

                    var itemExistsIndex = cartobj.findIndex(x => x.id == cartItem.id);
                    if (itemExistsIndex > -1) cartobj.splice(itemExistsIndex, 1);

                }

                cartobj.push(cartItem)
                addCartToStorage(cartobj);
                //window.updateCart();
                replaceAddToCart(cardForm);

            } catch (e) {
                clearCartStorage();
                alert("unable to update the cart, please try again");
            }
        }

        function handleAddToSubsidyCart(e) {
            e.preventDefault();

            var cardForm;
            //if ( window.location.href.indexOf("all") > -1 )
            //    cardForm = $(e.currentTarget).closest("form");
            //else
            cardForm = $(e.currentTarget);


            var amountInput = $(e.currentTarget).closest("form").find(".calcAmount");
            var titleInput = $(e.currentTarget).closest("form").find(".title");
            var typeInput = $(e.currentTarget).closest("form").find(".initiativeType");
            var idInput = $(e.currentTarget).closest("form").find(".caseId");
            var contributionTypeInput = $(e.currentTarget).closest("form").find(".contributionType");
            //var ImageBytes = $(e.currentTarget).closest("form").find(".ImageBytes");
            var attachmentURL = $(e.currentTarget).closest("form").find(".attachmentURL").val();

            var cartItemAmount = amountInput.val();
            var cartItemTitle = titleInput && titleInput.val();
            var cartItemId = idInput && idInput.val();
            var cartItemType = typeInput && typeInput.val();
            var contributionType = contributionTypeInput && contributionTypeInput.val();

            if (cartItemAmount < 0) return;
            if (!amountInput) return;
            if (!checkMax(amountInput)) return;

            var typeNameValue = null;
            for (var i = 0; i < itemTypes.length; i++) {
                if (itemTypes[i].type == cartItemType)
                    typeNameValue = itemTypes[i].val;
            }

            var cartItem = {
                amount: cartItemAmount,
                title: cartItemTitle,
                id: cartItemId,
                type: cartItemType,
                typeName: typeNameValue,
                contributionType: contributionType,
                attachmentURL: attachmentURL
            }

            try {
                var cartobj = getCartObj();
                if (!cartobj)
                    cartobj = [];
                else {
                    var itemExistsIndex = cartobj.findIndex(x => x.id == cartItem.id);
                    if (itemExistsIndex > -1) cartobj.splice(itemExistsIndex, 1);
                }

                cartobj.push(cartItem);
                addCartToStorage(cartobj);
                //window.updateCart();
                replaceAddToCart(cardForm);

            } catch (e) {
                clearCartStorage();
                alert("unable to update the cart, please try again");
            }
        }

    });
    (function () {
        function id(v) { return document.getElementById(v); }
    }());

    $(document).ready(function () {
        $('#navbarMenu').on('shown.bs.offcanvas', function () {
            $('#closeMenuFocusout').focus();
        });
        $(".qd-apple-button").click(function () {
            $("#is_quickDonation").val("true");
        });
        $("#closeNavbar").click(function () {
            $(".navbar-collapse").removeClass("open")
        });
    });

    $(document).ready(function () {
        $('#savedCardCvv').hide();
        $('.img-visa-2').hide();
        $('.img-mastercard-2').hide();
        $('.img-dimmed-2').show();
    });

    $("#cards-dropdown").on('change', function () {
        var selectedtext = $("#cards-dropdown option:selected").text();
        var selected = $(this).val();
        if (selected > 0) {
            $('#NewCard').hide();
            $('#savedCardCvv').show();
            if (selectedtext[0] === "5") {
                $('.img-mastercard-2').show();
                $('.img-visa-2').hide();
                $('.img-dimmed-2').hide();
            }
            else if (selectedtext[0] === "4") {
                $('.img-mastercard-2').hide();
                $('.img-visa-2').show();
                $('.img-dimmed-2').hide();
            }
            else {
                $('.img-mastercard-2').hide();
                $('.img-visa-2').hide();
                $('.img-dimmed-2').show();
            }
        }
        else if (selected == 0) {
            $('#NewCard').show();
            $('#savedCardCvv').hide();
            $('.img-dimmed-2').show();
            $('.img-mastercard-2').hide();
            $('.img-visa-2').hide();
        }
    });

    $(function () {
        $('[data-bs-toggle="popover"]').popover()
    })
</script>


<script src="{{ asset('frontend/static/js/app.js?v=VPYD99V4wSdr5Y4j06dtBaon_Cg6YR8xmKRsI0f8TLc') }}"></script>
<script src="{{ asset('frontend/static/js/zakatAlfiter.js') }}"></script>
<script src="{{ asset('frontend/static/js/validateMobileInGift.js') }}"></script>
<script src="{{ asset('frontend/static/js/validateOtp.js') }}"></script>

<div class="modal fade payment-privacy-modal" id="payment-privacy-modal" tabindex="-1" role="dialog"
     aria-labelledby="privacy-modal-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content border-0 border-rounded-15">
            <div class="modal-header align-items-center">
                <h5 id="privacy-modal-title" class="modal-title color-dark-green">سياسات التبرع</h5>
                <button id="toggle-payment-privacy-modal" class="btn btn-close py-0 ms-auto me-0" type="button"
                        data-bs-toggle="modal" data-bs-target="#payment-privacy-modal" aria-label="إغلاق"></button>
            </div>
            <div class="modal-body">
                <h6 class="text-primary-green">التمهيد:</h6>
                <p>الهدف من هذه السياسة تحديد المبادئ والتوجيهات اللازمة وآليات جمع الموارد المالية وعمل منظومة “آيثار”.
                </p>
                <h6 class="text-primary-green">التعريف والغرض:</h6>
                <p>آيثار هي منظومة وطنية غير ربحية، تقدم خدماتها وما تحصل عليه من تبرعات للمستفيدين الأشد احتياجاً عبر
                    شركائها.</p>
                <h6 class="text-primary-green">التزامات المتبرع:</h6>
                <ul>
                    <li>يقر المتبرع عند استخدامه لهذه المنصة بأهليته القانونية لإجراء التبرعات.</li>
                    <li>يوافق المتبرع على الشروط والأحكام، كما يوافق على حق المنظومة المُطلق في تعديلها وتغييرها في أي
                        مرحلة.</li>
                    <li>يقر المتبرع بسلامة ونقاء وشرعية مصدر الأموال محل التبرع وبصحة كافة البيانات ذات العلاقة بتبرعه.
                    </li>
                    <li>يفوض المتبرع منصة "آيثار" بالقيام بكافة الأعمال في سبيل إيصال التبرعات وإنهاء جميع الإجراءات ذات
                        العلاقة عبر شركاء المنصة سواء من الجهات الحكومية أو الجمعيات الأهلية المرخصة.</li>
                    <li>
                        يتحمل المتبرع المسئولية منفرداً في حال مخالفته أي من أنظمة او قوانين المملكة أو القوانين الدولية
                        الخاصة بــ :
                        <ul style="list-style: disc;">
                            <li>نظام مكافحة الإرهاب.</li>
                            <li>نظام مكافحة غسيل الأموال</li>
                            <li>أنظمة وقرارات الأمم المتحدة الموقع عليها من المملكة.</li>
                            <li>القرارات والقواعد ذات العلاقة بالممارسات المحظورة.</li>
                            <li>الأنظمة ذات العلاقة.</li>
                        </ul>
                    </li>
                </ul>
                <h6 class="text-primary-green">نظام الاسترداد :</h6>
                <ul>
                    <li>يُتاح طلب الاسترداد لمبلغ التبرع خلال مدة أقصاها (5) خمسة أيام من تاريخ تنفيذ العملية، ومن ثم
                        يتم دراسة الطلب.</li>
                    <li>يشترط في طلب الاسترداد أن يتم إثبات عملية التبرع بإرفاق الوثائق اللازمة.</li>
                    <li>لا يمكن استرداد مبالغ التبرعات لخدمة فُرجت وخدمة تيسرت، وكذلك برنامج قطاف وبرامج الولاء.</li>
                </ul>
                <h6 class="text-primary-green">أحكام أخرى:</h6>
                <ul>
                    <li>للمستخدم (المسجل) في المنصة الاطلاع على المبالغ المتبرع بها، وذلك من خلال صفحة "المستخدم".</li>
                    <li>في حالة تعثر المشروع المُتبرع لأجله -لسبب غير راجع للمنصة- فإن المتبرع يوافق على تحويل المبلغ
                        لمشروع مشابه من المشاريع المدرجة في المنصة وتلتزم المنصة بذلك.</li>
                    <li>في حال تعثر إيصال مبلغ التبرع لفواتير سداد الخدمات “فرجت –تيسرت “فإن المتبرع يوافق على تحويل المبلغ لحالة أخرى من الحالات المدرجة في منصة آيثار، وتكون الأولوية للفاتورة المطلوب سدادها من قبل المتبرع إن أمكن.</li>
                    <li>هذه السياسة قابلة للتعديل، ويسري العمل بأي تعديل قد يطرأ عليها فور نشره من خلال المنصة.</li>
                </ul>
            </div>
        </div>
    </div>
</div>
<script src="{{ asset('frontend/lib/jquery-validation/dist/jquery.validate.min.js') }}"></script>
<script src="{{ asset('frontend/lib/jquery-validation/dist/jquery.validate.unobtrusive.min.js') }}"></script>


<script src="{{ asset('frontend/static/js/home.js') }}"></script>
<script src="{{ asset('frontend/static/js/subsidy.js') }}"></script>
<script src="{{ asset('frontend/static/js/ramadan-statistics.js') }}"></script>
<script src="{{ asset('frontend/static/js/total-amount.js') }}"></script>

