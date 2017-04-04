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
  let url = 'https://api.myjson.com/bins/zfmh7';
  $.getJSON(url, function(data){
    state.db = data;
  });
}

function isCorrectAns(state) {
  if (state.correctAns === state.ansSelected){
    state.numCorrect++;
    return true;
  }
  else {return false;}
}

function renderQuestion(state) {

  $('#question').removeClass('hide');
  $('form').addClass('fade-question');
  $('#question').removeClass('disable-effect');
  $('form').find('button').addClass('disable-effect');

  /*Enables user selection and removes color-highlighting for new question*/
  $('input').each(function(index, element) {
    $(element).prop("disabled", false);
    $(element).prop("checked", false);
    $(element).next().removeClass('correct');
    $(element).next().removeClass('wrong');
  });

  let question = state.db['q'+(state.questionNum + 1)];
  $('#question').find('h2').text(question.text);

  for (var choice in question.choices) {
    $('#question').find('#'+choice).next().text(question.choices[choice]);
  }
}

function renderFeedback(state, selector) {
  $('#'+state.correctAns).next().addClass('correct');
  if(!isCorrectAns(state)) {
    selector.next().addClass('wrong');
  }
  /*Prevents user from reselecting answer*/
  $('input').each(function(index, element) {
    $(element).prop("disabled", true);
  });
  $('#question').addClass('disable-effect');
  $('form').removeClass('fade-question');
  $('form').find('button').removeClass('disable-effect');
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


/*Event listeners*/
$(function main(){
  let state = initState();
  loadJSON(state);

  $('#question').on('click','input', function() {
    state.ansSelected=$(this).attr('id');
    state.numAnswered++;
    renderFeedback(state,$(this));
  });
  /*Watches for button to be clicked*/
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
