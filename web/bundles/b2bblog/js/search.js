/**
 * Created by iuli on 5/26/15.
 */

$(function(){
    /**
     * @var Array urls
     */
    var searchSubjects = {"company": [], "article": []},
        ajaxRequests = [],
        $resultList = $("#search-result"),
        $searchContainer = $(".search-result-list"),
        $preloader = $(".preloader")
    ;
    // search request
    $(".search-form").on
        ("keyup", function()
        {
            resetRequests();
            var request = $.get(
                "/search?search=" + $("#search").val(),
                function(data){
                    $resultList.empty();
                    $.each(data, function(ind, el){
                        var href = "",
                            linkText = "",
                            itemClass = "item-type-",
                            $foundItem = $('<li><a href="#">#</a></li>')
                        ;
                        if (el.select_type == "company") {
                            linkText = el.nm;
                        } else if(el.select_type == "article") {
                            linkText = el.title;
                        }
                        $foundItem.find("a")
                            .attr({
                                "href": urls[el.select_type] + el.id,
                                "class": itemClass + el.select_type
                            }).text(linkText);
                        $resultList.append($foundItem);
                    });
                    toggleResultList(true);
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
        } else {
            $searchContainer.addClass('hidden');
            toggleProgressBar(!flag);
        }
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
});