$(document).ready(function () {
        for (var i = 0; i < sessionStorage.length; i++) {
            name = sessionStorage.key(i);
            value = sessionStorage.getItem(name);
            $(".trade-off").each(function (i) {
                if ($(this).attr("data-cms-content-id") == name) {
                    var newvalue = value.substr(0, value.lastIndexOf("-"));
                    if ($(this).parents("div.choice").hasClass(newvalue)) {
                        $(this).parents("div.choice").show();
                    }
                }
            });
        }
});