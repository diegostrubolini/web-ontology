var urlQueryLocal = "../openrdf-workbench/repositories/ontologias-web/query";
var urlUpdateLocal = "../openrdf-workbench/repositories/ontologias-web/update";
var resource = "Clint_Eastwood";
var prefixes = "PREFIX dbp: <http://dbpedia.org/property/>\n" +
    "PREFIX dbo: <http://dbpedia.org/ontology/>\n" +
    "PREFIX dbr: <http://dbpedia.org/resource/>\n" +
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
    "PREFIX tp1: <http://localhost:ontologias/tp1/>\n" +
    "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";

function performQuery(callback, method, urlEndpoint, formData) {
    $.ajax({
        type: method,
        url: urlEndpoint,
        data: formData
    }).done(callback);
};

function performGetQuery(query, callback) {
    performQuery(callback, 'GET', urlQueryLocal, {
        'query': prefixes + query,
        'limit_query': 1000,
        'infer': true,
        'Accept': 'application/sparql-results+json',
        'queryLn': 'SPARQL',
        'action': 'exec',
    });
};

function performPostQuery(query, callback) {
    performQuery(callback, 'POST', urlUpdateLocal, {
        'update': prefixes + query,
        'Accept': 'application/sparql-results+json'
    });
};

function resourceBirthDate(callback) {
    performGetQuery("select distinct ?o " +
        "where {" +
        "dbr:" + resource + " dbp:birthDate ?o " +
        "}  limit 1", callback);
}

function resourceName(callback) {
    performGetQuery("select distinct ?o " +
        "where {" +
        "dbr:" + resource + " rdfs:label ?o " +
        'FILTER(LANG(?o) = "" || LANGMATCHES(LANG(?o), "en")) ' +
        "}  limit 1", callback);
}

function resourcePhoto(callback) {
    performGetQuery("select distinct ?o " +
        "where {" +
        "dbr:" + resource + " foaf:depiction ?o " +
        "}  limit 1", callback);
}

function directedMovies(callback) {
    workedMovies(callback,"director");
}

function producedMovies(callback) {
    workedMovies(callback,"producer");
}

function starredMovies(callback) {
    workedMovies(callback,"starring");
}

function workedMovies(callback, work) {
    performGetQuery("select distinct ?movie ?name " +
        "where { "+
        "dbr:" + resource + " ^dbo:"+work+" ?movie  "+
        "service <http://dbpedia.org/sparql>{"+
        "?movie foaf:name ?name" +
        "}"+
        "} "+
        " limit 15", callback);
}

function commentResource(resource, comment, callback) {
    performPostQuery("INSERT DATA { <" + resource + "> tp1:comment '" + comment + "'  }", callback);
}

function getComments(resource, callback) {
    performGetQuery("select ?o where { <" + resource + "> tp1:comment ?o }  limit 100", callback);
}