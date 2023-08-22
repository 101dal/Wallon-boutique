document.addEventListener("scroll", function () {
    var pageTop = window.pageYOffset || document.documentElement.scrollTop;
    var pageBottom = pageTop + window.innerHeight;
    var tags = document.querySelectorAll(".fade-in");

    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];

        if (tag.getBoundingClientRect().top + tag.offsetHeight < pageBottom &&
            tag.getBoundingClientRect().bottom - tag.offsetHeight < pageTop) {
            tag.classList.add("active");
        } else {
            tag.classList.remove("active");
        }
    }
});
