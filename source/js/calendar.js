var Calendar = function(model, options, date){
  // Default Values
  this.Options = {
    Color: '',
    LinkColor: '',
    NavShow: true,
    NavVertical: false,
    NavLocation: '',
    DateTimeShow: true,
    DateTimeFormat: 'mmm, yyyy',
    DatetimeLocation: '',
    EventClick: '',
    EventTargetWholeDay: false,
    DisabledDays: [],
    ModelChange: model
  };
  // Overwriting default values
  for(var key in options){
    this.Options[key] = typeof options[key]=='string'?options[key].toLowerCase():options[key];
  }

  model?this.Model=model:this.Model={};
  this.Today = new Date();

  this.Selected = this.Today
  this.Today.Month = this.Today.getMonth();
  this.Today.Year = this.Today.getFullYear();
  if(date){this.Selected = date}
  this.Selected.Month = this.Selected.getMonth();
  this.Selected.Year = this.Selected.getFullYear();

  this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
  this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 0).getDay();
  this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

  this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
  if(this.Selected.Month==0){this.Prev = new Date(this.Selected.Year-1, 11, 1);}
  this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
};

function createCalendar(calendar, element, adjuster){
  element.innerHTML = '';
  if(typeof adjuster !== 'undefined'){
    var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
    calendar = new Calendar(calendar.Model, calendar.Options, newDate);
  }else{
    for(var key in calendar.Options){
      typeof calendar.Options[key] != 'function' && typeof calendar.Options[key] != 'object' && calendar.Options[key]?element.className = " " + key + "-" + calendar.Options[key]:0;
    }
  }
  var months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

  function AddSidebar(){
    var sidebar = document.createElement('div');
    sidebar.className += 'cld-sidebar';

    var monthList = document.createElement('ul');
    monthList.className += 'cld-monthList';

    for(var i = 0; i < months.length - 3; i++){
      var x = document.createElement('li');
      x.className += 'cld-month';
      var n = i - (4 - calendar.Selected.Month);
      // Account for overflowing month values
      if(n<0){n+=12;}
      else if(n>11){n-=12;}
      // Add Appropriate Class
      if(i==0){
        x.className += ' cld-rwd cld-nav';
        x.addEventListener('click', function(){
          typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
          createCalendar(calendar, element, -1);});
        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,75 100,75 50,0"></polyline></svg>';
      }
      else if(i==months.length - 4){
        x.className += ' cld-fwd cld-nav';
        x.addEventListener('click', function(){
          typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
          createCalendar(calendar, element, 1);} );
        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,0 100,0 50,75"></polyline></svg>';
      }
      else{
        if(i < 4){x.className += ' cld-pre';}
        else if(i > 4){x.className += ' cld-post';}
        else{x.className += ' cld-curr';}

        //prevent losing var adj value (for whatever reason that is happening)
        (function () {
          var adj = (i-4);
          //x.addEventListener('click', function(){createCalendar(calendar, element, adj);console.log('kk', adj);} );
          x.addEventListener('click', function(){
            typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
            createCalendar(calendar, element, adj);} );
          x.setAttribute('style', 'opacity:' + (1 - Math.abs(adj)/4));
          x.innerHTML += months[n].substr(0,3);
        }()); // immediate invocation

        if(n==0){
          var y = document.createElement('li');
          y.className += 'cld-year';
          if(i<5){
            y.innerHTML += calendar.Selected.Year;
          }else{
            y.innerHTML += calendar.Selected.Year + 1;
          }
          monthList.appendChild(y);
        }
      }
      monthList.appendChild(x);
    }
    sidebar.appendChild(monthList);
    if(calendar.Options.NavLocation){
      document.getElementById(calendar.Options.NavLocation).innerHTML = "";
      document.getElementById(calendar.Options.NavLocation).appendChild(sidebar);
    }
    else{element.appendChild(sidebar);}
  }

  var mainSection = document.createElement('div');
  mainSection.className += "cld-main";

  mainSection.style.opacity = `0.5`;
  setTimeout(() => {
    mainSection.style.opacity = `1`;
  }, 200);

  function AddDateTime(){
      var datetime = document.createElement('div');
      datetime.className += "cld-datetime";
      if(calendar.Options.NavShow && !calendar.Options.NavVertical){
        var rwd = document.createElement('div');
        rwd.className += " cld-rwd cld-nav";
        rwd.addEventListener('click', function(){
          createCalendar(calendar, element, -1);
        });

        if (typeof months[calendar.Selected.Month - 1] == 'undefined') {
          rwd.innerHTML = `${months[11]}`;
        } else {
          rwd.innerHTML = `${months[calendar.Selected.Month - 1]}`;
        }

        // rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="#56ccf2"><polyline points="0,50 75,0 75,100"></polyline></svg>';
        datetime.appendChild(rwd);
      }
      var today = document.createElement('div');
      today.className += ' today';
      today.innerHTML = months[calendar.Selected.Month] + " " + calendar.Selected.Year;
      datetime.appendChild(today);
      if(calendar.Options.NavShow && !calendar.Options.NavVertical){
        var fwd = document.createElement('div');
        fwd.className += " cld-fwd cld-nav";
        fwd.addEventListener('click', function(){
            createCalendar(calendar, element, 1);
        });

        if (typeof months[calendar.Selected.Month + 1] == 'undefined') {
          fwd.innerHTML = `${months[0]}`;
        } else {
          fwd.innerHTML = `${months[calendar.Selected.Month + 1]}`;
        }
        
        // fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="#56ccf2"><polyline points="0,0 75,50 0,100"></polyline></svg>';
        datetime.appendChild(fwd);
      }
      if(calendar.Options.DatetimeLocation){
        document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
        document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
      }
      else{mainSection.appendChild(datetime);}

    // swipe
    const canvas = document.querySelector(".cld-main");

    canvas.addEventListener("touchstart", function(e) {
      TouchStart(e);
    });
    canvas.addEventListener("touchmove", function(e) {
      TouchMove(e);
    });
    canvas.addEventListener("touchend", function(e) {
      TouchEnd(e);
    });
    canvas.addEventListener("touchcancel", function(e) {
      TouchEnd(e);
    });

    const sensitivity = 20;
    var touchStart = null;
    var touchPosition = null;

    function TouchStart(e) {
      touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      touchPosition = { x: touchStart.x, y: touchStart.y };
    }

    function TouchMove(e) {
      touchPosition = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    }

    function TouchEnd(e, color) {
      CheckAction();

      //Очищаем позиции
      touchStart = null;
      touchPosition = null;
    }

    function CheckAction() {
      var d = {
        x: touchStart.x - touchPosition.x,
        y: touchStart.y - touchPosition.y
      };

      if (Math.abs(d.x) > Math.abs(d.y)) {
        if (Math.abs(d.x) > sensitivity) {
          if (d.x > 0) {
            createCalendar(calendar, element, 1)
          } else {
            createCalendar(calendar, element, -1)
          }
        }
      }
    }
  }

  function AddLabels(){
    var labels = document.createElement('ul');
    labels.className = 'cld-labels';
    var labelsList = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    for(var i = 0; i < labelsList.length; i++){
      var label = document.createElement('li');
      label.className += "cld-label";
      label.innerHTML = labelsList[i];
      labels.appendChild(label);
    }
    mainSection.appendChild(labels);
  }
  function convertDate(val){
    var curr = ``;
    switch(val){
      case 'Січень':
        curr =  `01`
        break;
      case 'Лютий':
        curr =  `02`
        break;
      case 'Березень':
        curr =  `03`
        break;
      case 'Квітень':
        curr =  `04`
        break;
      case 'Травень':
        curr =  `05`
        break;
      case 'Червень':
        curr =  `06`
        break;
      case 'Липень':
        curr =  `07`
        break;
      case 'Серпень':
        curr =  `08`
        break;
      case 'Вересень':
        curr =  `09`
        break;
      case 'Жовтень':
        curr =  `10`
        break;
      case 'Листопад':
        curr =  `11`
        break;
      case 'Грудень':
        curr =  `12`
        break;
      default:
        curr =  `01`
        break;
    }
    return curr;
  }
  function AddDays(){
    // Create Number Element
    function DayNumber(n){
      var number = document.createElement('p');
      number.className += "cld-number day-number";
      number.innerHTML += n;
      return number;
    }
    var days = document.createElement('ul');
    days.className += "cld-days";
    // Previous Month's Days
    for(var i = 0; i < (calendar.Selected.FirstDay); i++){
      var day = document.createElement('li');
      day.className += "cld-day prevMonth";
      //Disabled Days
      var d = i%7;
      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
        if(d==calendar.Options.DisabledDays[q]){
          day.className += " disableDay";
        }
      }

      var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i+1));
      day.appendChild(number);

      days.appendChild(day);
    }
    // Current Month's Days
    for(var i = 0; i < calendar.Selected.Days; i++){
      var day = document.createElement('li');
      day.className += "cld-day currMonth";
      
      //Disabled Days
      var d = (i + calendar.Selected.FirstDay)%7;
      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
        if(d==calendar.Options.DisabledDays[q]){
          day.className += " disableDay";
        }
      }
      var number = DayNumber(i+1);

      // need fix. only present!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (i == 3) {
        number.setAttribute('data-count', '1');
        number.classList.add('eventday');
      }        
      
      if (i == 13) {
        number.setAttribute('data-count', '12');
        number.classList.add('eventday');
      }      
      
      if (i == 22) {
        number.setAttribute('data-count', '9');
        number.classList.add('eventday');
      }

      // Check Date against Event Dates
      for(var n = 0; n < calendar.Model.length; n++){
        var evDate = calendar.Model[n].Date;
        var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i+1));
        if(evDate.getTime() == toDate.getTime()){
          number.className += " eventday";
          var title = document.createElement('span');
          title.className += "cld-title";
          if(typeof calendar.Model[n].Link == 'function' || calendar.Options.EventClick){
            var a = document.createElement('a');
            a.setAttribute('href', '#');
            a.innerHTML += calendar.Model[n].Title;
            if(calendar.Options.EventClick){
              var z = calendar.Model[n].Link;
              if(typeof calendar.Model[n].Link != 'string'){
                  a.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
                  if(calendar.Options.EventTargetWholeDay){
                    day.className += " clickable";
                    day.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
                  }
              }else{
                a.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
                if(calendar.Options.EventTargetWholeDay){
                  day.className += " clickable";
                  day.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
                }
              }
            }else{
              a.addEventListener('click', calendar.Model[n].Link);
              if(calendar.Options.EventTargetWholeDay){
                day.className += " clickable";
                day.addEventListener('click', calendar.Model[n].Link);
              }
            }
            title.appendChild(a);
          }else{
            title.innerHTML += '<a href="' + calendar.Model[n].Link + '">' + calendar.Model[n].Title + '</a>';
          }
          number.appendChild(title);

        }
      }
      
      day.setAttribute('tabindex', 0);
      day.setAttribute('data-day', (number.outerText < 10 ? '0'+ number.outerText : number.outerText) + '.' + convertDate(months[calendar.Selected.Month]) + "." + calendar.Selected.Year);

      day.appendChild(number);
      day.addEventListener('click', (e)=>{
        // document.getElementById('date-box').innerHTML = (e.target.outerText < 10 ? '0'+ e.target.outerText : e.target.outerText) + '.' + convertDate(months[calendar.Selected.Month]) + "." + calendar.Selected.Year;
        // document.querySelector('.calendar').classList.remove('showCalendar');
      });
      // If Today..
      if((i+1) == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year){
        day.className += " today";
      }
      days.appendChild(day);
    }
    // Next Month's Days
    // Always same amount of days in calander
    var extraDays = 13;
    if(days.children.length>35){extraDays = 6;}
    else if(days.children.length<29){extraDays = 20;}

    for(var i = 0; i < (extraDays - calendar.Selected.LastDay); i++){
      var day = document.createElement('li');
      day.className += "cld-day nextMonth";
      //Disabled Days
      var d = (i + calendar.Selected.LastDay + 1)%7;
      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
        if(d==calendar.Options.DisabledDays[q]){
          day.className += " disableDay";
        }
      }

      var number = DayNumber(i+1);
      day.appendChild(number);

      days.appendChild(day);
    }
    mainSection.appendChild(days);
  }
  if(calendar.Options.Color){
    mainSection.innerHTML += '<style>.cld-main{color:' + calendar.Options.Color + ';}</style>';
  }
  if(calendar.Options.LinkColor){
    mainSection.innerHTML += '<style>.cld-title a{color:' + calendar.Options.LinkColor + ';}</style>';
  }
  // let btn = document.createElement('button'), div = document.createElement('div');
  // div.classList.add('calendar_btn-wrap');
  // btn.classList.add('calendar_btn');
  // btn.innerHTML = 'Вибрати';
  // btn.addEventListener('click', (e)=>{
  //   var startDate = endDate = null;
  //   if(document.querySelector('.active-a') !== null){
  //    startDate = document.querySelector('.active-a').getAttribute('data-day');
  //   }
  //   if(document.querySelector('.active-b') != null){
  //    endDate = document.querySelector('.active-b').getAttribute('data-day');
  //   }
  //   var content = ``;
  //   if(startDate !== null && endDate !== null){
  //     if(startDate>endDate){
  //       content = `${endDate} - ${startDate}`;
  //     }else{
  //       content = `${startDate} - ${endDate}`;
  //     }
  //     document.getElementById('date-box').innerHTML = content;
  //   document.querySelector('.calendar').classList.remove('showCalendar');
  //   }else if(startDate !== null || endDate !== null){
  //     if(startDate !== null){
  //       content = `${startDate}`;
  //     }else{
  //       content = `${endDate}`;
  //     }
  //     document.getElementById('date-box').innerHTML = content;
  //     document.querySelector('.calendar').classList.remove('showCalendar');
  //   }
  //   else{
  //     if(this.p !== null && typeof this.p != 'undefined'){
  //       this.p.innerHTML = ``;
  //     }else{
  //       this.p = document.createElement('p');
  //     }
  //     this.p.innerHTML = `Виберіть дату`;
  //     div.appendChild(this.p);
  //   }
    
  // });

// div.appendChild(btn);
element.appendChild(mainSection);
// element.appendChild(div);
if(calendar.Options.NavShow && calendar.Options.NavVertical){
  AddSidebar();
}

if(calendar.Options.DateTimeShow){
  AddDateTime();
}

AddLabels();
AddDays();
  
var dragging = false;
var days = document.querySelectorAll('.currMonth');
var offset = 0;

function activateDay() {
  var activeElement = document.activeElement;
  var activeAItem = document.querySelector('.active-a');
  var activeBItem = document.querySelector('.active-b');
  
  if (activeAItem && activeBItem) {
    clearActiveDays();
    clearRange();
    activeElement.classList.add('active-a');
    return;
  }
  
  if (activeAItem) activeElement.classList.add('active-b');
  else activeElement.classList.add('active-a');
}

function clearActiveDays() {
  var activeAItem = document.querySelector('.active-a');
  var activeBItem = document.querySelector('.active-b');
  
  if (activeAItem) activeAItem.classList.remove('active-a');
  if (activeBItem) activeBItem.classList.remove('active-b');
}

function clearRange() {
  days.forEach(item => {
    item.classList.remove('range');
  });
}

function calculateRange() {
  var activeAIndex, activeBIndex;

  days.forEach((item, index) => {
    if (item.classList.contains('active-a')) activeAIndex = index;
    if (item.classList.contains('active-b')) activeBIndex = index;
  });

  if (activeAIndex < activeBIndex) {
    for (var i = activeAIndex; i <= activeBIndex; i++) {
      days[i].classList.add('range');
    }
  }

  if (activeAIndex > activeBIndex) {
    for (var i = activeAIndex; i >= activeBIndex; i--) {
      days[i].classList.add('range');
    }
  }
}

function startMove(item) {
  dragging = true;
  
  var activeAItem = document.querySelector('.active-a');
  var activeBItem = document.querySelector('.active-b');
  
  if (!activeBItem && activeAItem) {
    item.classList.add('active-b');
    calculateRange();
  } else {
    clearActiveDays();
    clearRange();
    item.classList.add('active-a');
  }
}

function move(item) {
  if (dragging) {
    var activeA = document.querySelector('.active-a');
    var prevActiveB = document.querySelector('.active-b');

    clearRange();

    if (prevActiveB) prevActiveB.classList.remove('active-b');
    if (!item.classList.contains('active-a')) item.classList.add('active-b');

    var activeB = document.querySelector('.active-b');

    calculateRange();
  }
}

function endMove(item) {
  dragging = false;
}

window.addEventListener('mouseup', e => {
  dragging = false;
});

days.forEach((item, index) => {
  var dayNumber = item.querySelector('.day-number').innerHTML;
  
  if (dayNumber === '1' && !item.classList.contains('next-mon')) {
    offset = index;
  }
  
  item.addEventListener('mousedown', e => {
    startMove(item);
  });
  
  item.addEventListener('mousemove', e => {
    move(item);
  });
  
  item.addEventListener('mouseup', e => {
    endMove(item);
  });
});

window.addEventListener('keyup', e => {
  var key = e.keyCode;
  
  switch (key) {
    case 13:
      activateDay();
      calculateRange();
      break;
  }
});
}

function caleandar(el, data, settings){
  var obj = new Calendar(data, settings);
  createCalendar(obj, el);
// document.querySelector('.reset').addEventListener('click', e => {
//   clearActiveDays();
//   clearRange();
// });
}
