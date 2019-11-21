const {dialog} = require('electron').remote;
const {exec} = require('child_process');
var filePath = __dirname + '/assets';
const fs = require('fs');

var game = {player: {}, results: []};

window.addEventListener('DOMContentLoaded', () => {  
  if(document.getElementById('quizPage')) {
    let form = document.getElementById('quizPage');
    fs.readFile(filePath + "/data.json", "utf8",  (err, data)  => {
    if (err) throw err;
    const json = JSON.parse(data); 
    let inputStep = form.querySelector('input[name="step"]').value
    let step =  inputStep > 0 ? inputStep : 1;
    let counter = json.questions.length;
    console.log(step);    
    let idx = json.questions.findIndex(function(item, i){
        return item.place == step
    });
    let question = json.questions[idx];
    let choices = question.choices;
    let fragment = document.createDocumentFragment();
    let choices_container = form.querySelector('div');
    choices.forEach(function(choice, idx) {
        var p =document.createElement('p');
        var input= document.createElement('input');
        input.type = 'radio';
        input.id = 'choice-'+ idx;
        input.name = 'choice';
        input.value = idx;
        var label = document.createElement('label');
        label.textContent = choice;
        label.setAttribute('for' , 'choice-'+ idx);
        p.appendChild(input);  
        p.appendChild(label);                 
        fragment.appendChild(p);
      });
    if(step >= 1 && step <= 5) {
        var inputNext = document.createElement('input');
        inputNext.type = 'hidden';
        inputNext.name = 'next';
        inputNext.value = step + 1;
        fragment.appendChild(inputNext);        
        if(step > 1) {
          var inputPrev = document.createElement('input');
          inputPrev.type = 'hidden';
          inputPrev.name = 'prev';
          inputPrev.value =  step - 1;
          fragment.appendChild(inputPrev);
        }
      }
    choices_container.appendChild(fragment);
    document.getElementById('q-title').textContent = question.title;
    document.getElementById('counter').textContent = step + '/' + counter;
    });    
  }
}

)
window.addEventListener('submit', function(ev) {
  let form = ev.target; 
  if(form.id == 'quizPage') {
     ev.preventDefault(); 
    let inputStep = form.querySelector('input[name="step"]').value;
    var response = form.querySelector(":checked");
    game.results.push(response.value);    
    console.log(game);
    let next =  parseInt(form.querySelector('input[name="next"]').value, 10);

    fs.readFile(filePath + "/data.json", "utf8",  (err, data)  => {
    if (err) throw err;
    const json = JSON.parse(data);     
    let step =  inputStep > 0 ? inputStep : 1;
    let counter = json.questions.length;
    console.log(step);    
    if(next > counter){
      let good = 0;
      // Page résultat
      // les bonnes réponses 
      json.questions.forEach(function(question, idx, questions){

          if(game.results[idx] == parseInt(question.answer, 10)) {
            good++;
          }
      });
      // utilisation pdf-node-creator
      alert('Félicitation : ' +json.player.firstname +' ' + json.player.lastname + ' vous avez ' + good + ' bonnes réponses sur ' + counter );
    }

    else {
      let idx = json.questions.findIndex(function(item, i){
        return item.place == next
    });
    let question = json.questions[idx];
    let choices = question.choices;
    let fragment = document.createDocumentFragment();
    let choices_container = form.querySelector('div');
    choices_container.innerHTML = '';
    choices.forEach(function(choice, idx) {
        var p =document.createElement('p');
        var input= document.createElement('input');
        input.type = 'radio';
        input.id = 'choice-'+ idx;
        input.name = 'choice';
        input.value = idx;
        var label = document.createElement('label');
        label.textContent = choice;
        label.setAttribute('for' , 'choice-'+ idx);
        p.appendChild(input);  
        p.appendChild(label);                 
        fragment.appendChild(p);
      });
    if(next > 1 && step < 5) {
        var inputNext = document.createElement('input');
        inputNext.type = 'hidden';
        inputNext.name = 'next';
        inputNext.value = next + 1;
        fragment.appendChild(inputNext);        
        if(step > 1) {
          var inputPrev = document.createElement('input');
          inputPrev.type = 'hidden';
          inputPrev.name = 'prev';
          inputPrev.value =  step - 1;
          fragment.appendChild(inputPrev);
        }
    }   
    choices_container.appendChild(fragment);
    document.getElementById('q-title').textContent = question.title;
    document.getElementById('counter').textContent = step + '/' + counter;
    }    
    });
  }
  if(form.id == 'startQuiz') {
    // sauvegarde joueur    
    let data = fs.readFileSync(filePath + "/data.json", "utf8");   
    let schema = JSON.parse(data); 
    schema.player.firstname = form.querySelector('#firstname').value;
    schema.player.lastname = form.querySelector('#lastname').value;
    schema.player.email = form.querySelector('#email').value;
    fs.writeFileSync(filePath + "/data.json", JSON.stringify(schema), 'utf-8');    
  }
 
}, false);
