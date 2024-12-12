let addBtn = document.querySelector('.add-btn');
let deleteBtn = document.querySelector('.remove-btn');
let modalElem = document.querySelector('.modal');
let removeBtn = document.querySelector('.close');
let submitElem = document.querySelector('.submit');
let allColors = document.querySelectorAll('.priority .color');
let filterColors = document.querySelectorAll('.priority-cont .color');
let typedText = document.querySelector('textarea');
let mainElem = document.querySelector('main');

let currentColor = '';
let ticketsList = [];
let currentfilter ="all";
const colors = ['pink','blue','green','orange'];
let deleteFlag = false;
const ticketsFromLS = localStorage.getItem('ticketsList');
if (ticketsFromLS){
    ticketsList = JSON.parse(ticketsFromLS);
    refreshList();
}


function createTicket({ticketTask,ticketColor,ticketId}){
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML =     
            `<div class='ticket-color ${ticketColor}'></div>
            <div class="ticket-id">${ticketId}</div>
            <div class="ticket-text">${ticketTask}</div>
            <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`
        ;
    mainElem.appendChild(ticketcont);
    handleLock(ticketId,ticketcont);
    handleColor(ticketId,ticketcont);
    handleDelete(ticketId,ticketcont);
}
function handleDelete(ticketId,ticketElem){
    ticketElem.addEventListener('click',()=>{
        if(deleteFlag){
            ticketElem.remove();
            ticketsList  = ticketsList.filter((ticket)=>{
                return ticket.id !== ticketId;
            });
            updateLocalStorage();
        }
        else{
            console.log("Ignore");
        }
    })
}
function handleColor(ticketId,ticketElem){
    let ticketColorElem = ticketElem.querySelector(".ticket-color");
    ticketColorElem.addEventListener('click',(event)=>{
        const currentTicketColor = ticketColorElem.classList[1];
        let currentColorIdx = colors.findIndex((color)=>color===currentTicketColor);
        const newColorIdx = ++currentColorIdx % colors.length;
        const newColor = colors[newColorIdx];
        ticketColorElem.classList.remove(currentTicketColor);
        ticketColorElem.classList.add(newColor);
        let index = ticketsList.findIndex((ticket)=>{
            return ticket.id === ticketId;
        });
        ticketsList[index].color = newColor;
        updateLocalStorage();
    });
}
function handleLock(ticketId,ticketElem){
    const lockClass = 'fa-lock';
    const unlockClass = 'fa-lock-open';
    let ticketLockElem = ticketElem.querySelector(".ticket-lock i");
    let ticketContent = ticketElem.querySelector(".ticket-text");
    ticketLockElem.addEventListener("click",(event)=>{
        if(ticketLockElem.classList.contains(lockClass)){
            ticketLockElem.classList.remove(lockClass);
            ticketLockElem.classList.add(unlockClass);
            ticketContent.setAttribute("contenteditable","true");
        }
        else{
            ticketLockElem.classList.remove(unlockClass);
            ticketLockElem.classList.add(lockClass); 
            ticketContent.setAttribute("contenteditable","false"); 
            let index = ticketsList.findIndex((ticket)=>{
                return ticket.id === ticketId;
            });
            ticketsList[index].task = ticketContent.textContent;
            updateLocalStorage();
        }
    });
}
function getFilteredTickets(){
    if (currentfilter==='all'){
        return ticketsList;
    }
    else{
        return ticketsList.filter(({color})=> color===currentfilter);
    }
}
function refreshList(){
    mainElem.innerHTML='';
    let selectedTickets = getFilteredTickets();
    selectedTickets.forEach((ticket)=>{
        const {task,color,id} = ticket;
        createTicket({
            ticketTask:task,
            ticketColor:color,
            ticketId: id, 
        });
    });
}
function submitHandler(){
    if (typedText.value && currentColor){
        ticketsList.push({
            task: typedText.value,
            color: currentColor,
            id: shortid(),
        }); 
        currentColor = '';
        typedText.value='';
        updateLocalStorage();
        clearActive();
        refreshList();
        removeModal();
    }
}
function updateLocalStorage(){
    localStorage.setItem("ticketsList",JSON.stringify(ticketsList));
}
function addModal(){
    modalElem.style.display = 'flex';
    
}
function removeModal(){
    modalElem.style.display = 'none';
}
function clearActive(){
    allColors.forEach((elem)=>{
        if(elem.classList.contains('active')){
            elem.classList.remove('active')
        }
    });
}   
function getColor(event){
    clearActive();  
    currentColor = event.target.classList[0];
    event.target.classList.add('active');
}
function clearActivefilter(){
    filterColors.forEach((elem)=>{
        if(elem.classList.contains('select')){
            elem.classList.remove('select')
        }
    });
}
function getfilterColor(event){
    clearActivefilter();
    currentfilter = event.target.classList[0];
    event.target.classList.add('select');
    refreshList();
}
function deleteHandler(){
    deleteFlag = !deleteFlag;
    if (deleteFlag){
        deleteBtn.style.color = "red";
        alert("Delete Mode Activated");
    }else{
        deleteBtn.style.color = "black";
        alert("Delete Mode Deactivated");
    }
}
addBtn.addEventListener('click',addModal);
deleteBtn.addEventListener('click', deleteHandler);
removeBtn.addEventListener('click',removeModal);
submitElem.addEventListener('click',submitHandler);
allColors.forEach((elem)=>{
    elem.addEventListener('click',getColor);
});
filterColors.forEach((elem)=>{
    elem.addEventListener('click',getfilterColor);
});