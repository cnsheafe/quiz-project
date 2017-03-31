/*jshint esversion: 6*/
function initState() {
  let state = {
    numCorrect: 0,
    questionNum: 0,
    currentQuestion: {}
  };
  return state;
}

function loadJSON() {
  let url = 'https://github.com/cnsheafe/quiz-project/blob/master/questions.json';
  $.get(url, function(data) {
    console.log(data);
  },'json');
  //let req = new XMLHttpRequest();
  /*req.overrideMimeType('application/json');
  req.responseType = 'json';
  req.open('GET', 'questions.json');
  let db;
  req.onload = function() {
    db = req.response;
  };*/
  //return db;
}

function loadQuestion(state) {
  $.getJSON('questions.json', function(data){
    state.currentQuestion = data;
    console.log(data);
  });
}

function renderFeedback(state,selector) {

}


$(function main(){
  let state = initState();
  loadJSON();
  //console.log(db);
  $('form').on('click','input', function() {
    state.numAnswered++;
    renderFeedback(state, $(this));
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    console.log('I was clicked');
    renderNextPage(state);
  });

});
