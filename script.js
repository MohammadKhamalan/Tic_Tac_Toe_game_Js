const radio=document.querySelector('input[value="Multiplayer"]');
const namesofplayers=document.getElementById("player");
const difficulty = document.querySelector('input[value="AgainstAi"]'); 
const diff=document.getElementById("dificulty");
const startLink = document.getElementById("startLink");
const Ai="Ai";
const names=document.getElementById("active");
startLink.addEventListener('click', () => {
    try{
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    localStorage.setItem('player1', player1Name);
    localStorage.setItem('player2', player2Name);
    if (document.getElementById('multiplayer').checked) {
        
        localStorage.setItem('gameMode', 'multiplayer');
        
        names.textContent=`Player ${player1Name} Turn`;
       
   } } catch(error){}
     if (document.getElementById('againstAi').checked) {
        localStorage.setItem('gameMode', 'againstAi');
        localStorage.setItem('player1', document.getElementById('player1').value);
        localStorage.setItem('player2', 'Ai'); 
    }
    
     if(document.getElementById('easy').checked){
        localStorage.setItem('difficulty', 'easy'); 

    }
    if(document.getElementById('Meduim').checked){
        localStorage.setItem('difficulty','Meduim');
    }
    if(document.getElementById('Hard').checked){
        localStorage.setItem('difficulty','Hard');
    }
    else{
    }
});
radio.addEventListener('change', ()=>{
    if(radio.checked){
        namesofplayers.style.display="block";
        diff.style.display="none";

    }
    else{
        namesofplayers.style.display="none";
        diff.style.display="none";


    }
})
difficulty.addEventListener('change',()=>{
    if(difficulty.checked){
diff.style.display="block";
namesofplayers.style.display="none";

    }
    else{
        diff.style.display="none";
        namesofplayers.style.display="none";

    }
})