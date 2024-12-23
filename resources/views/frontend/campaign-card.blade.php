<div class="col-md-6 col-xl-4 col-12 mb-3 mb-xl-0 pb-3">
    <div class="card card-shadow pt-2 pb-3 pe-3 ps-3">
        <div class="custom-card-header d-flex justify-content-between align-items-center">
            <a class="card-details-link"  href="{{ route('campaign', ['id' => $campaign->id]) }}" role="link" tabindex="0" >
                <h6 class="title text-truncate " aria-level="4">{{ $campaign->title }}</h6>
            </a>
{{--            <button class="btn share-icon-btn share-help ghiras_share" data-caseId="48100" data-casetype="Project" data-caseTitle="" title="شارك التبرع عبر وسائل التواصل الاجتماعي" aria-label="مشاركة"><i class="fas fa-share-alt"></i></button>--}}
        </div>

        <div class="my-1 project-item-details">

            <a class="card-details-link"  href="{{ route('campaign', ['id' => $campaign->id]) }}" role="presentation" tabindex="-1" >
                <div class="project-img">
                    <img loading="lazy"
                         class="h-100 w-100"
                         src="{{ Storage::url($campaign->image) }}" onerror="this.src='{{asset('frontend/assets/images/Default_card.svg')}}';this.onerror='';" width="316" height="155" alt="{{ $campaign->title }}">
                    <div class="rangeslider1 w-100" id="js-rangeslider-0" aria-hidden="true">
                        24
                        <div class="rangeslider-fill-lower">
                            <div class="rangeslider-thumb" id="donut-48100" style="width: {{$campaign->percentage}}%" role="slider" aria-valuemin="0" aria-valuenow="{{$campaign->percentage}}" aria-valuemax="100" aria-label="تم جمع">
                                <div class="range-output" style="transform: rotate(0deg);">
                                    <output class="output" name="output" for="range">{{$campaign->percentage}}%</output>
                                </div>
                            </div>
                        </div>

                        <style>
                            #donut-48100 {
                                width: {{$campaign->percentage}}%;
                                animation: donutLoad-48100 2s ease;
                                animation-direction: alternate;
                            }

                            @keyframes donutLoad-48100 {
                                0%   {width: 0;}
                                100% {width: {{$campaign->percentage}}%;}
                            }
                        </style>                    </div>
                </div>
            </a>
            <div class="row mt-2">
                <div class="col">
                    <small class="text-primary-green">تم جمع</small>
                    <label class="text-primary-blue d-block h6 font-semibold">{{ $campaign->raised_amount }}<small class="ms-1 text-nowrap"> $</small><span class="visually-hidden">({{$campaign->percentage}}%)</span></label>
                </div>
                <div class="col">
                    <small class="text-primary-green">المبلغ المتبقي</small>
                    <label class="text-primary-blue d-block h6 font-semibold MaxValSpan">{{  $campaign->leftAmount }}<small class="ms-1 text-nowrap"> $</small></label>
                </div>
            </div>
        </div>

        <!-- actions -->

        <input type="hidden" name="id" value="{{$campaign->id}}" />
        <div class="d-flex cart-wrapper" data-id="48100">
            <div class="addToCartWrapper  w-100 d-flex">
                <div class="price-details">
                    <input class="float-start cart-amount only-number" placeholder="مبلغ التبرع" name="cartamount"
                           autocomplete="off"
                           id="item-48100-amount"
                           inputmode="numeric" pattern="\d*"
                           data-val-range-min="0"
                           data-val-range-max="283908.00" data-val-range="****" data-val="true" data-val-number="ارقام" aria-label="مبلغ التبرع - (USD)" />
                    <span class="text-light-grey float-end" aria-hidden="true">$</span>
                </div>

                <button class="btn btn-primary-blue flex-grow-1 mx-2 rounded-pill donate-now" type="button"
                        onclick="{{ route('donate', ['id' => $campaign]) }}">
                    تبرع الآن
                </button>
            </div>
        </div>        <hr />
        <div class="text-center">
            <a type="button" class="btn btn-block btn-sm p-0 text-muted" href="{{ route('campaign', ['id' => $campaign->id]) }}" tabindex="-1" aria-hidden="true"><span>تفاصيل الحالة</span></a>
        </div>
    </div>
</div>
