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

  $('input').each(function(index, element) {
    $(element).prop("disabled", false);
    $(element).prop("checked", false);
    $(element).next().find('span').removeClass('correct');
    $(element).next().find('span').removeClass('wrong');
  });

  let question = state.db['q'+(state.questionNum + 1)];
  selector.find('h1').text(question.text);

  for (var choice in question.choices) {
    selector.find('#'+choice).next().find('span').eq(0).text(question.choices[choice]);
  }
}

function renderFeedback(state, selector) {
  $('#'+state.correctAns).next().find('span').addClass('correct');

  if(!isCorrectAns(state)){
    selector.next().find('span').addClass('wrong');
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
  const resultHeaderHtml = '<h1 id="center-h1"> Congratulations!</h1>';
  $('main').prepend(resultHtml);
  $('main').prepend(resultHeaderHtml);
  $('main').find('form').eq(1).addClass('center-form');
}



$(function main(){
  let state = initState();
  loadJSON(state);
  $('#question').on('click','input', function() {
    //console.log($(this).next().find('span'));
    state.ansSelected=$(this).attr('id');
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
        $('button').text('Retry?');
      }
      else {
        $('h1, p').addClass('hide');
        $('button').parent().removeClass('center-form');
        $('button').text('Next');
        renderQuestion(state);
        state.questionNum++;
        state.correctAns = state.db['q'+(state.questionNum)].ans;
      }
    }
  });


});
