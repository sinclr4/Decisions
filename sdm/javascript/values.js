$(document).ready(function () {
        $("#saveAndContinue a").click(function (e) {
            var href = $(this).attr("href");
            e.preventDefault();
            $(".statement").each(function (i) {
                var data = $(this).attr("data-cms-content-id").replace(/view/gi, "trade-off");
                var temp = new Array();
                temp = data.split('_');
                temp[1] = parseInt(temp[1]) + 1;
                var newdata = temp.join("_");
                sessionStorage.setItem(newdata, $(this).find("input:radio:checked").attr("id"));
            });
            window.location.href = href;
        });
});