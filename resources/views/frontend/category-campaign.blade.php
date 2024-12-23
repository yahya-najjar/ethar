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
                @if($campaign->category)
                    <li class="breadcrumb-item text-primary-green"><span>فرص التبرع</span></li>
                    <li class="breadcrumb-item"><a href="/category/{{$campaign->category->slug}}">{{ $campaign->category->name }}</a></li>
                @else
                    <li class="breadcrumb-item text-primary-green"><span>برامجنا</span></li>
                    <li class="breadcrumb-item"><a href="/program/{{$campaign->program->slug}}">{{ $campaign->program->name }}</a></li>
                @endif
                <li class="breadcrumb-item active" aria-current="page">{{ $campaign->title }}</li>
            </ol>
        </nav>


        <div class="row">
            <div class="col-md-6 col-12 mb-3">
                <div class="card card-shadow border-rounded">
                    <h6 class="title pt-3 px-3" aria-level="2">{{ $campaign->title }}</h6>
                    <div class="position-relative overflow-hidden center-items-vertically details-image" style="width: 100%">
                        <img loading="lazy"
                             class="rounded-top-35 p-3 w-100"
                             src="{{ Storage::url($campaign->image) }}" onerror="this.src='/assets/images/Default_card.svg';this.onerror='';" alt="&#x627;&#x644;&#x643;&#x633;&#x648;&#x629; &#x627;&#x644;&#x634;&#x62A;&#x648;&#x64A;&#x629; &#x644;&#x644;&#x623;&#x633;&#x631; &#x627;&#x644;&#x645;&#x62A;&#x639;&#x641;&#x641;&#x629;">
                    </div>
                    <p class="p-3 m-0">{{ $campaign->description }}</p>
                    <div class="align-items-center bg-light-grey d-flex justify-content-between px-3 py-2">
                        <div class="font-semibold">
                            <span class="text-primary-blue">رقم الحالة</span><span class="text-primary-green ms-2">{{$campaign->id}}</span>
                        </div>
                        <div class="font-semibold">
                            <a target="_blank" href="https://wa.me/?text={{ urlencode('Check out this campaign from Ethar: ' . route('campaign', $campaign->id)) }}" class="btn btn-dark-grey d-flex px-3 py-1 rounded-pill share-help ghiras_share align-items-center"  title="شارك التبرع عبر وسائل التواصل الاجتماعي">
                                <span class="text-primary-blue me-2">مشاركة</span>
                                <i class="fas fa-share-alt share-icon text-primary-green"></i>
                            </a>
                        </div>
                    </div>
                    <div class="row p-3">
                        <div class="col">
                            <span class="text-primary-green font-semibold">تم جمع</span>
                            <label class="text-primary-blue d-block h5 font-regular fw-light">{{ $campaign->raised_amount }}<small class="ms-2 text-nowrap">$</small></label>
                        </div>
                        <div class="col">
                            <span class="text-primary-green font-semibold">المبلغ المتبقي</span>
                            <label class="text-primary-blue d-block h5 font-regular fw-light MaxValSpan">{{  $campaign->leftAmount }}<small class="ms-2 text-nowrap">$</small></label>
                        </div>
                    </div>
                    <div class="rangeslider3 w-100 px-3 pt-3" id="js-rangeslider-0">
                        <div class="rangeslider-fill-lower">
                            <div class="rangeslider-thumb" id="donut-48130" style="width: {{  $campaign->percentage }}%" role="slider" aria-valuemin="0" aria-valuenow="{{  $campaign->percentage }}" aria-valuemax="100" aria-label="تم جمع">
                                <div class="range-output" style="transform: rotate(0deg);">
                                    <output class="output" name="output" for="range">{{  $campaign->percentage }}%</output>
                                </div>
                            </div>
                        </div>

                        <style>
                            #donut-48130 {
                                width: {{$campaign->percentage}}%;
                                animation: donutLoad-48130 2s ease;
                                animation-direction: alternate;
                            }

                            @keyframes donutLoad-48130 {
                                0%   {width: 0;}
                                100% {width: {{$campaign->percentage}}%;}
                            }
                        </style>                        </div>
                    <hr />
                    <div id="divMoreInfo" class="px-3">
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-12 mb-3 donation-form">
                <form method="post" id="details_donation" class="position-relative mb-5" action="/projects/donateproject">

                    <input type="hidden" name="CartItems[0].caseId" value="48130" />
                    <input type="hidden" name="CartItems[0].initiativeType" value="Project" />
                    <input type="hidden" id="initiativeType" value="1" />
                    <input type="hidden" name="CartItems[0].title" value="&#x627;&#x644;&#x643;&#x633;&#x648;&#x629; &#x627;&#x644;&#x634;&#x62A;&#x648;&#x64A;&#x629; &#x644;&#x644;&#x623;&#x633;&#x631; &#x627;&#x644;&#x645;&#x62A;&#x639;&#x641;&#x641;&#x629;" />
                    <input type="hidden" name="CartItems[0].amount" class="cart-amount" value="" />
                    <input type="hidden" id="cartTotalMax" name="cartTotalMax" value="141111.00" />
                    <input type="hidden" id="cartTotalMin" name="cartTotalMin" value="1" />
                    <div class="cart-wrapper" data-id="48130">
                        <div class="card card-shadow border-rounded p-3">
                            <div class="title-with-amounts">
                                <h6 class="title mb-3" aria-level="3">مبلغ التبرع</h6>
                                <div class="ProhectDetailsSubBox">
                                    <div class="price-details d-flex flex-lg-nowrap flex-wrap justify-content-center justify-content-lg-between mb-3">
                                        <button type="button" class="btn btn-white border px-3 me-1 input-radius flex-fill pre-amount single-amount amount-from-details" data-amount="10" aria-label="10 USD" aria-pressed="false">10<small class="ms-1">$</small></button>
                                        <button type="button" class="btn btn-white border px-3 me-1 input-radius flex-fill pre-amount single-amount amount-from-details" data-amount="50" aria-label="50 USD" aria-pressed="false">50<small class="ms-1">$</small></button>
                                        <button type="button" class="btn btn-white border px-3 me-1 input-radius flex-fill pre-amount single-amount amount-from-details" data-amount="100" aria-label="100 USD" aria-pressed="false">100<small class="ms-1">$</small></button>
                                        <div class="input-group mt-1 mt-lg-0">
                                            <input class="only-number form-control border-end-0 input-another-amount cart-amount amount-from-details"
                                                   id="item-48130-amount"
                                                   name="amount" placeholder="قيمة المبلغ" value=""
                                                   autocomplete="off" maxlength="7" inputmode="numeric"
                                                   pattern="\d*" aria-label="مبلغ آخر (USD)" />
                                            <span class="input-group-text bg-white border-start-0" id="basic-addon2"><small class="text-primary-green">$</small></span>
                                        </div>
                                    </div>
                                    <span class="fs-12px text-danger d-none" id="mainAmountErr">مبلغ التبرع مطلوب</span>
                                </div>
                                <span class="field-validation-valid" data-valmsg-for="cart_total_hidden" data-valmsg-replace="true" role="alert"></span>
                            </div>

                            <style>
                                .select2-container--default .select2-selection--single {
                                    border-radius: .65rem 0 0 .65rem !important;
                                }

                                span.error {
                                    color: #dc3545 !important;
                                    font-size: 13px;
                                }
                            </style>


                            <div class="d-flex align-items-center justify-content-between pb-3">
                                <div class="addToCartWrapper w-100 d-flex">
                                    <button class="btn btn-gradient flex-fill me-2 donate-now" data-retry-payment="true" type="submit" id="submit-details">
                                        تبرع الآن
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input name="__RequestVerificationToken" type="hidden" value="CfDJ8F6blf7zzxRDpkFRMPt9Y59bGrkcFrGUGQ3_J9cNpIx_RAcP6yt9zm25NWk8RG0_bWrHsJRY6o-N5w9CsRf9An19veaFCP_rRGMSqKU80dLthF94baxXbmXByHVRa1SW9qIZJMRD23fWDDRygrnFI5M" /></form>
                <div class="card align-items-center border-0 bg-smoke-white-2 border-rounded-15 py-3 mb-3">
                    <div>
                        <img src="{{ asset('frontend/assets/images/projects/icon-eye.svg') }}" class="icon-shadow me-3 mb-2" alt="" />
                        <span class="text-primary-blue font-semibold me-2">الزيارات</span>
                        <span class="text-primary-green h5 me-2 numberOfVisits"></span>
                        <span class="text-primary-green"> {{ $campaign->visits }}زيارة</span>
                    </div>
                </div>
                <div class="card align-items-center border-0 bg-smoke-white-2 border-rounded-15 py-3 mb-3">
                    <div>
                        <img src="{{ asset('frontend/assets/images/projects/icon-last-donation.svg') }}" class="icon-shadow me-3 mb-2" alt="" />
                        <span class="text-primary-blue font-semibold me-2">آخر عملية تبرع قبل</span>
                        <span class="text-primary-green h5 me-2">{{ $campaign->donations()->latest()->first() ? $campaign->donations()->latest()->first()->create_at : '7 hours ago' }}</span>
                        <span class="text-primary-green"></span>
                    </div>
                </div>
                <div class="card align-items-center border-0 bg-smoke-white-2 border-rounded-15 py-3 mb-3">
                    <div>
                        <img src="{{ asset('frontend/assets/images/projects/icon-hand.svg') }}" class="icon-shadow me-3 mb-2" alt="" />
                        <span class="text-primary-blue font-semibold me-2">عدد عمليات التبرع</span>
                        <span class="text-primary-green h5 me-2">{{ $campaign->donations()->count() > 0 ? $campaign->donations()->count()  : 37 }}</span>
                        <span class="text-primary-green">عملية</span>
                    </div>
                </div>
                <div class="card align-items-center border-0 bg-smoke-white-2 border-rounded-15 pt-3 pb-4">
                    <div>
                        <img src="{{ asset('frontend/assets/images/projects/icon-users.svg') }}" class="icon-shadow me-3" alt="" />
                        <span class="text-primary-blue font-semibold me-2">عدد المستفيدين</span>
                        <span class="text-primary-green h5 me-2">{{ $campaign->beneficiaries_count }}</span>
                        <span class="text-primary-green">حتى الآن</span>
                    </div>
                    <div class="text-primary-green ms-5">
                        <span>العدد المستهدف</span>
                        <span class="font-semibold mx-2">{{ $campaign->beneficiaries_goal }}</span>
                        <span>مستفيد</span>
                    </div>
                </div>
            </div>
        </div>
    </div>



@endsection
