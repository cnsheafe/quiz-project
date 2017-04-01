/*jshint esversion: 6*/

/*TODO: add result screen at end*/
/*TODO: add restart behavior when user gets to end of quiz*/

function initState() {
  let state = {
    numCorrect: 0,
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
  question = state.db['q'+(state.questionNum+1)];
  selector.append('<li>'+question.text+'</li>');

  for (var choice in question.choices) {
    html = '<span id="'+choice+'"><input type="radio" name="choice">'+question.choices[choice]+'</span>';
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
}


$(function main(){
  let state = initState();
  loadJSON(state);

  $('form').on('click','input', function() {
    state.ansSelected=$(this).parent().attr('id');
    console.log(state.ansSelected);
    renderFeedback(state,$(this));
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    renderQuestion(state);
    state.questionNum++;
    state.correctAns = state.db['q'+(state.questionNum)].ans;



  });

});
