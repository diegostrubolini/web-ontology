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
        var movieButton = $("<a>", {class: "thumbnail col-md-12"});
        var movieWrapper = $("<div>",{class:"col-md-9"});
        var imgWrapper = $("<div>",{class:"col-md-3"});
        var movieTitle = $("<h3>");
        movieTitle.text(val.name.value);
        var movieBudget = $("<p>");
        movieBudget.text("Budget: U$D "+ val.budget.value);
        var movieRuntime = $("<p>");
        movieRuntime.text(" Runtime: " + val.runtime.value/60 + " min");
        var img = $("<img>");
        img.attr('src',"default.jpg");
        img.attr('style',"height:100px");

        movieWrapper.append(movieTitle);
        movieWrapper.append(movieBudget);
        movieWrapper.append(movieRuntime);
        imgWrapper.append(img);


        movieButton.append(imgWrapper);
        movieButton.append(movieWrapper);

        searchMovie(val.name.value,function(result){
            img.attr('src', getImgPath(result.results[0].poster_path));
        });

        movieButton.attr('href', '#');
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
