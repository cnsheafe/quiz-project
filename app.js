/*jshint esversion: 6*/
function initState() {
  let state = {
    numAnswered: 0,
    numCorrect: 0,
    pageNum: 0
  };
  return state;
}

function addCorrect(state) {
  state.numCorrect++;
  state.questionArr[state.arrPointer] = true;
}

function goToNextPage(state) {
  if(state.numAnswered % 5 === 0) {
    state.pageNum++;
    return true;
  }
  else {
    return false;
  }
}

function renderQuestion(state, selector) {
  if(selector.hasClass('correct')){
    addCorrect(state);
    selector.addClass('correct-highlight');
  }
  else {
    selector.addClass('incorrect-highlight');
  }
}

function renderNextPage(state) {
  if(goToNextPage(state)) {
    switch (state.pageNum) {
      case 1:
        $('main').append('<iframe src="pages/questions-pt1.html" width="800" height="450"></iframe>');
        break;
      case 2:
        $('main').remove('iframe');
        $('main').append('<iframe src="pages/questions-pt2.html"></frame>');
        break;
      case 3:
        $('main').append('<iframe src="pages/end.html"');
    }
  }
}

$(function main(){
  let state = initState();

  $('form').on('click','input', function() {
    state.numAnswered++;
    renderQuestion(state, $(this));
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    console.log('I was clicked');
    renderNextPage(state);
  });

});
