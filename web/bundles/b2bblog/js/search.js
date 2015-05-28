/**
 * Created by iuli on 5/26/15.
 */

$(function(){
    /**
     * @var Array urls
     */
    var searchSubjects = {"company": [], "article": []},
        ajaxRequests = [],
        $form = $(".search-form"),
        $resultList = $("#search-result"),
        $searchContainer = $(".search-result-list"),
        $preloader = $(".preloader"),
        $scrollContainer = $(".result-list-container")
    ;
    // search request
    $form.on
        ("keyup", function()
        {
            resetRequests();
            $scrollContainer.mCustomScrollbar("destroy");
            var request = $.get(
                "/search?search=" + $("#search").val(),
                function(data){
                    $resultList.empty();
                    if ($(data).length > 0) {
                        $.each(data, function(ind, el){
                            var href = "",
                                itemClass = "item-type-",
                                $foundItem = $('<p class="truncate"><a href="#">#</a></p>')
                            ;
                            $foundItem.find("a")
                                .attr({
                                    "href":  urls[el.select_type] + el.id,
                                    "class": itemClass + el.select_type
                                }).text(el.search_word);
                            $resultList.append($foundItem);
                            toggleResultList(true);
                        });
                        $scrollContainer.mCustomScrollbar({
                            axis: "y",
                            theme: "dark-thin",
                            mouseWheel: { preventDefault: true }
                        });
                    } else {
                        toggleResultList(false);
                        toggleProgressBar(false);
                    }
                }, "json"
            );
            ajaxRequests.push(request);

            return false;
    });
    // filters
    $searchContainer.on("change", ":checkbox", function()
    {
        //item-type-company
        var elements = $searchContainer.find(".item-type-" + $(this).data("type"));
        $(this).is(":checked") ? elements.show() :  elements.hide();
    });
    // toggle result list
    function toggleResultList(state)
    {
        var flag = $searchContainer.hasClass('hidden');
        if (state != undefined) {
            flag = state;
        }
        if (flag) {
            $searchContainer.removeClass('hidden');
            toggleProgressBar(!flag);
            $searchContainer.find(":checkbox").each(function(){
                $(this).prop("checked",true)
            });
        } else {
            $form.find(':input').val('');
            $searchContainer.addClass('hidden');
            toggleProgressBar(!flag);
        }

        $scrollContainer.mCustomScrollbar("destroy");
        $scrollContainer.mCustomScrollbar({
            axis: "y",
            theme: "dark-thin",
            mouseWheel: { preventDefault: true }
        });
    }
    // toggle progress bar
    function toggleProgressBar(state)
    {
        var flag = $preloader.hasClass('hidden');
        if (state != undefined) {
            flag = state;
        }
        flag ?
            $preloader.removeClass('hidden') :
            $preloader.addClass('hidden');
    }
    // ajax request stack
    function resetRequests()
    {
        toggleResultList();
        ajaxRequests.forEach(function(el){ el.abort() });
        ajaxRequests = [];
    }
    // hide list when click outside
    $form.click( function(event){
        event.stopPropagation();
    });
    $(document).click( function(){
        toggleResultList(false);
        toggleProgressBar(false);
    });
});