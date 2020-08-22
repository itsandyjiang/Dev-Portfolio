const list = document.getElementById("to-do-list");
const input = document.getElementById("to-do-input");
const sessions = document.getElementById("sessions-input");
const focusMins = document.getElementById("focus-input-mins");
const focusSecs = document.getElementById("focus-input-secs");
const breakMins = document.getElementById("break-input-mins");
const breakSecs = document.getElementById("break-input-secs");


const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

window.onload = function() {
    if ($("#to-do-list li").length == 0) {
        $("#empty-task").show();
    } else {
        $("#empty-task").hide();
    }


}



//localStorage.removeItem("TODO");
let data = localStorage.getItem("TODO");

if (data) {
    LIST = JSON.parse(data);
    id = localStorage.getItem("INDEX");; // set the id to the last one in the list
    loadList(LIST); // load the list to the user interface
} else {
    LIST = [];
    id = 0;
}

function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.started, item.done, item.sessionsNum, item.focusM, item.focusS, item.breakM, item.breakS);
    });
}





function addToDo(toDo, id, started, done, sessionsVal, focusMinsVal, focusSecsVal, breakMinsVal, breakSecsVal) {


    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    focusMinsVal = focusMinsVal < 10 ? focusMinsVal * 1 + "m" : focusMinsVal + "m";
    breakMinsVal = breakMinsVal < 10 ? breakMinsVal * 1 + "m" : breakMinsVal + "m";

    focusSecsVal = focusSecsVal == 0 ? "" : focusSecsVal + "s";
    breakSecsVal = breakSecsVal == 0 ? "" : breakSecsVal + "s";

    var item = '';

    // <i class="fa ${DONE} co" job="complete" id="${id}"></i>
    //                 <p class="text ${LINE}">

    //                 </p>
    if (done) {
        item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text">
                    ${toDo}
                    <span class="timer-info">| ${sessionsVal} sets | ${focusMinsVal}${focusSecsVal} focus | ${breakMinsVal}${breakSecsVal} break</span>
                    <span class="task-status-completed">Completed</span>
                    </p>
                    <i class="fa fa-times-circle fa-lg de" job="delete" id="${id}"></i>
                  </li>
                `;
    } else {
        item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text">
                    ${toDo}
                    <span class="timer-info">| ${sessionsVal} sets | ${focusMinsVal}${focusSecsVal} focus | ${breakMinsVal}${breakSecsVal} break</span>
                    <span class="task-status">In-complete</span>
                    </p>
                    <i class="fa fa-times-circle fa-lg de" job="delete" id="${id}"></i>
                  </li>
                `;

    }

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

function toDoAddToSystem() {
    const toDo = input.value;
    const sessionsVal = sessions.value;
    const focusMinsVal = focusMins.value;
    const focusSecsVal = focusSecs.value;
    const breakMinsVal = breakMins.value;
    const breakSecsVal = breakSecs.value;

    // if the input isn't empty
    if (toDo) {

        $("#empty-task").hide();

        addToDo(toDo, id, false, false, sessionsVal, focusMinsVal, focusSecsVal, breakMinsVal, breakSecsVal);

        LIST.push({
            name: toDo,
            id: id,
            started: false,
            done: false,
            sessionsNum: sessionsVal,
            focusM: focusMinsVal,
            focusS: focusSecsVal,
            breakM: breakMinsVal,
            breakS: breakSecsVal
        });

        // add item to localstorage ( this code must be added where the LIST array is updated)
        localStorage.setItem("TODO", JSON.stringify(LIST));
        id++;
        localStorage.setItem("INDEX", JSON.stringify(id));

        console.log("ADDED: " + id);
    }
    input.value = "";
}

document.addEventListener("keyup", function(even) {
    if (event.keyCode == 13) {
        toDoAddToSystem();
    }
});



function completeToDo(element) {
    // element.classList.toggle(CHECK);
    // element.classList.toggle(UNCHECK);
    // element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    // LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);

    //LIST[element.id].trash = true;
    var removeIndex = LIST.findIndex(({ id }) => id === element.id);
    console.log(removeIndex);
    LIST.splice(removeIndex, 1);


    localStorage.setItem("TODO", JSON.stringify(LIST));

    if ($("#to-do-list li").length == 0) {
        $("#empty-task").show();
    }
}

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function formatNum(ele) {
    if ($(ele).val() < 10) {
        $(ele).val("0" + $(ele).val() * 1);
    }

}


list.addEventListener("click", function(event) {
    const element = event.target; // return the clicked element inside list
    const elementJob = element.attributes.job.value; // complete or delete

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element);
    }

    // add item to localstorage ( this code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});

//prevent editing and deleting of sessions number
$("#sessions-input").keypress(function(evt) {
    evt.preventDefault();
}).keydown(function(e) {
    if (e.keyCode === 8 || e.keyCode === 46) {
        return false;
    }
});

$("#sessions-input").keypress(function(evt) {
    evt.preventDefault();
}).keydown(function(e) {
    if (e.keyCode === 8 || e.keyCode === 46) {
        return false;
    }
});



document.getElementById("to-do-add-button").addEventListener("click", function() {
    toDoAddToSystem();
});