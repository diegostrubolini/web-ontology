$(document).ready(function () {
    resourcePhoto(function (data) {
        $('#depiction').attr('src', data.results.bindings[0].o.value);
    });
    resourceBirthDate(function (data) {
        $('#birthDate').text(data.results.bindings[0].o.value);
    });
    resourceName(function (data) {
        $('#birthName').text(data.results.bindings[0].o.value);
    });

});

function getDirectedMovies() {
    directedMovies(function (data) {
        printResults(data);
    });
}

function getProducedMovies() {
    producedMovies(function (data) {
        printResults(data);
    });
}

function getStarredMovies() {
    starredMovies(function (data) {
        printResults(data);
    });
}

function printResults(data) {
    $('#second-panel').empty();
    $('#third-panel').empty();
    $.each(data.results.bindings, function (i, val) {
        var movieButton = $("<button>", {class: "btn btn-lg btn-info btn-block col-md-12"});
        movieButton.text(val.movie.value);
        movieButton.attr('style', 'font-size: 12px');
        movieButton.click(function () {
            $('#third-panel').empty();
            getComments(val.movie.value, function (data) {
                showComments(data.results.bindings);
                createNewCommentsForm(val.movie.value, movieButton);
            });
        });
        $('#second-panel').append(movieButton);
    });
}

function showComments(results) {
    $.each(results, function (j, comment) {
        var commentAlert = $("<div>", {class: "alert alert-success"});
        commentAlert.text(comment.o.value);
        $('#third-panel').append(commentAlert);
    });
}

function createNewCommentsForm(movie, movieButton) {
    var commentButton = $("<button>", {class: "btn btn-primary btn-block col-md-12"});
    commentButton.text('Comment');
    var commentField = $("<input>", {class: "form-control"});
    commentField.attr('placeholder', 'Write a Comment...');
    commentField.attr('id', 'commentButton');
    commentButton.click(function (data) {
        var commentString = $('#commentButton').val();
        if (commentString != "") {
            commentResource(movie, $('#commentButton').val(), function () {
                movieButton.click()
            });
        }
    });
    $('#third-panel').append(commentField);
    $('#third-panel').append(commentButton);
}
