/*jshint esversion: 6*/
function initState() {
  let state = {
    numCorrect: 0,
    numAnswered: 0,
    questionNum: 0,
    ansSelected: '',
    correctAns: '',
    db: {}
  };
  return state;
}

function loadJSON(state) {
  let url = 'https://api.myjson.com/bins/k3jef';
  $.getJSON(url, function(data){
    state.db = data;
  });
}

function isCorrectAns(state) {
  if (state.db['q' + state.questionNum].ans === state.ansSelected){
    state.numCorrect++;
    return true;
  }
  else {return false;}
}

function renderQuestion(state) {
  let selector = $('#question');
  selector.removeClass('hide');
  selector.empty();
  let question = state.db['q'+(state.questionNum + 1)];
  selector.append('<li>'+question.text+'</li>');

  for (var choice in question.choices) {
    let html = '<span id="'+choice+'"><input type="radio" name="choice">'+question.choices[choice]+'</span>';
    selector.append(html);
  }
}

function renderFeedback(state, selector) {
  if(isCorrectAns(state)){
    selector.parent().addClass('correct');
  }
  else {
    selector.parent().addClass('wrong');
    $('#'+state.correctAns).addClass('correct');
  }
  $('input').each(function(index, element) {
    $(element).prop("disabled", true);
  });
}

function renderResultPage(state) {
  $('h1').remove();
  $('p').remove();
  $('#question').addClass('hide');
  const resultHtml = '<p> You got ' + state.numCorrect + '/10 Correct!</p>';
  const resultHeaderHtml = '<h1> Congratulations!</h1>';
  $('main').prepend(resultHtml);
  $('main').prepend(resultHeaderHtml);
}



$(function main(){
  let state = initState();
  loadJSON(state);
  $('#question').on('click','input', function() {
    state.ansSelected=$(this).parent().attr('id');
    state.numAnswered++;
    renderFeedback(state,$(this));
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    if(state.numAnswered === state.questionNum) {
      if(state.questionNum === 10) {
        renderResultPage(state);
        state.numCorrect = 0;
        state.questionNum = 0;
        state.numAnswered = 0;
        $('button').text('Restart');
      }
      else {
        $('h1, p').addClass('hide');
        $('button').text('Next');
        renderQuestion(state);
        state.questionNum++;
        state.correctAns = state.db['q'+(state.questionNum)].ans;
      }
    }
  });


});
