/* http://keith-wood.name/calendars.html
   Arabic localisation for calendars datepicker for jQuery.
   Khaled Al Horani -- خالد الحوراني -- koko.dw@gmail.com */
(function($) {
    $.calendarsPicker.regionalOptions['ar'] = {
        renderer: $.calendarsPicker.defaultRenderer,
        prevText: '&#x3c;السابق', prevStatus: 'عرض الشهر السابق',
        prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
        nextText: 'التالي&#x3e;', nextStatus: 'عرض الشهر القادم',
        nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
        currentText: 'الشهر الحالي', currentStatus: 'الشهر الحالي',
        todayText: 'الشهر الحالي', todayStatus: 'الشهر الحالي',
        clearText: 'مسح', clearStatus: 'امسح التاريخ الحالي',
        closeText: 'إغلاق', closeStatus: 'إغلاق بدون حفظ',
        yearStatus: 'عرض سنة آخرى', monthStatus: 'عرض شهر آخر',
        weekText: 'أسبوع', weekStatus: 'أسبوع السنة',
        dayStatus: 'اختر D, M d', defaultStatus: 'اختر يوم',
        isRTL: true
    };
    $.calendarsPicker.setDefaults($.calendarsPicker.regionalOptions['ar']);
})(jQuery);
