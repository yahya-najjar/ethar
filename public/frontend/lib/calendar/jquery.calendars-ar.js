/* http://keith-wood.name/calendars.html
   Arabic localisation for Gregorian/Julian calendars for jQuery.
   Khaled Al Horani -- خالد الحوراني -- koko.dw@gmail.com. */
/* NOTE: monthNames are the original months names and they are the Arabic names,
   not the new months name فبراير - يناير and there isn't any Arabic roots for these months */
(function($) {
    $.calendars.calendars.gregorian.prototype.regionalOptions['ar'] = {
        name: 'Gregorian',
        epochs: ['BCE', 'CE'],
        monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesMin: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        digits: $.calendars.substituteDigits(['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']),
        dateFormat: 'dd/mm/yyyy',
        firstDay: 6,
        isRTL: true
    };
    if ($.calendars.calendars.julian) {
        $.calendars.calendars.julian.prototype.regionalOptions['ar'] =
            $.calendars.calendars.gregorian.prototype.regionalOptions['ar'];
    }
})(jQuery);
