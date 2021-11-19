var dualCalendar_dropdowns = document.getElementsByClassName(
  "dualCalender_dropdown"
);
for (let index = 0; index < dualCalendar_dropdowns.length; index++) {
  const element = dualCalendar_dropdowns[index];
  addDualCalendarActions(element);
}

//#region dualCalendar js
/**
 * this function add all necessary actions to calendar input and calendar buttons
 * @param {HTMLElement} dualCalender_dropdown the element that has 'dualCalendar_dropdown' class name. this element is the parent element of whole calendar and calendar input
 */
function addDualCalendarActions(dualCalender_dropdown) {
  let started_day = null;
  let started_day_btn = null;
  let ended_day = null;
  var ended_day_btn = null;
  let isStartedDay = true;
  let can_scroll_next = true;
  let can_scroll_previous = true;
  let current_month = 0;
  let has_day_limit = dualCalender_dropdown.getAttribute("has-day-limit");

  let cal_night_counter = dualCalender_dropdown.querySelector(
    ".cal_night_counter"
  );
  if (has_day_limit == "true") {
    cal_night_counter.innerText = "? night";
  }
  let cal_root = dualCalender_dropdown.querySelector(".cal_root");

  let cal_reset_btn = dualCalender_dropdown.querySelector(".cal_reset_btn");
  let cal_first_day_selector = dualCalender_dropdown.querySelector(
    ".cal_first_day_selector"
  );

  let cal_second_day_selector = dualCalender_dropdown.querySelector(
    ".cal_second_day_selector"
  );

  let previous_month_btn = dualCalender_dropdown.querySelector(
    ".previous_month_btn"
  );
  let next_month_btn = dualCalender_dropdown.querySelector(".next_month_btn");
  let cal_first_input = dualCalender_dropdown.querySelector(".cal_first_input");
  let cal_second_input = dualCalender_dropdown.querySelector(
    ".cal_second_input"
  );
  let calendar_dropdown_toggle_bnt = dualCalender_dropdown.querySelector(
    ".calendar_dropdown_toggle_bnt"
  );
  let calendar_dropdown_menu = dualCalender_dropdown.querySelector(
    ".calendar_dropdown_menu"
  );
  let cal_done_btn = dualCalender_dropdown.querySelector(".cal_done_btn");

  let first_day_selector_placeholder = cal_first_input.placeholder;
  let second_day_selector_placeholder = cal_second_input.placeholder;
  cal_first_day_selector.innerText = cal_first_input.placeholder;
  cal_second_day_selector.innerText = cal_second_input.placeholder;
  //create days
  createAllMonths(cal_root);

  //at first cal_second_day_selector should disabled until first_day_selector selected
  cal_second_day_selector.disabled = true;

  let allTbodyBtns = cal_root.querySelectorAll("." + tbodyBtnClassName);

  disableLastDays(allTbodyBtns);

  let tbody_btn_container = cal_root.querySelectorAll(".td-btn-container");

  for (let index = 0; index < allTbodyBtns.length; index++) {
    const element = allTbodyBtns[index];
    element.addEventListener("click", function () {
      cal_second_day_selector.disabled = false;

      addBtnAnimation(element);

      if (isStartedDay) {
        doFirstDaySelectedAction(element);
      } else {
        doSecondDaySelectedAction(element);
      }

      controlInputValue(
        cal_first_day_selector,
        cal_first_input,
        started_day_btn
      );

      controlInputValue(
        cal_second_day_selector,
        cal_second_input,
        ended_day_btn
      );
    });
  }

  /**
   * @param {HTMLElement} element started day button
   * this function do all necessary actions when first day selected
   */
  function doFirstDaySelectedAction(element) {
    if (has_day_limit == "true") {
      cal_night_counter.innerText = "? night";
    }
    let last_started_day = started_day;
    cal_first_day_selector.innerText = getLegibleDate(element.value);
    changeStartBtnStyle(element, started_day_btn);
    started_day = element.value;
    started_day_btn = element;
    if (ended_day != null) {
      decolorize(tbody_btn_container, last_started_day, ended_day);
      clearEndBtnStyle(ended_day_btn);
      ended_day = null;
      ended_day_btn = null;
      cal_second_day_selector.innerText = second_day_selector_placeholder;
    }
    isStartedDay = false;
    swapToEndBtn(
      allTbodyBtns,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day,
      has_day_limit
    );
  }

  /**
   * @param {HTMLElement} element ended day button
   * this function do all necessary actions when second day selected
   */
  function doSecondDaySelectedAction(element) {
    cal_second_day_selector.innerText = getLegibleDate(element.value);
    changeEndBtnStyle(element, ended_day_btn);
    ended_day = element.value;
    ended_day_btn = element;
    if (has_day_limit == "true") {
      let days_difference = calcDayDifference(started_day, ended_day);
      if (days_difference == 1) {
        cal_night_counter.innerText = String(days_difference) + " night";
      } else {
        cal_night_counter.innerText = String(days_difference) + " nights";
      }
    }
    colorize(tbody_btn_container, started_day, ended_day);
    isStartedDay = true;
    swapToStartBtn(
      allTbodyBtns,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day,
      has_day_limit
    );
  }

  previous_month_btn.addEventListener("click", function () {
    if (can_scroll_previous) {
      doPreviousMonthAction();
    }
    function doPreviousMonthAction() {
      current_month -= 1;
      next_month_btn.hidden = false;
      can_scroll_previous = false;

      let pos = cal_root.scrollLeft;
      let end_of_scroll = pos - cal_width;
      let movement_size = cal_width / scroll_moving_size;

      requestAnimationFrame(previousMonthActionAnimation);
      function previousMonthActionAnimation() {
        if (pos <= end_of_scroll) {
          cal_root.scrollLeft = end_of_scroll;
          can_scroll_previous = true;
          if (current_month == 0) {
            previous_month_btn.hidden = true;
          } else {
            previous_month_btn.hidden = false;
          }
        } else {
          pos -= movement_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(previousMonthActionAnimation);
        }
      }
    }
  });
  next_month_btn.addEventListener("click", function () {
    function doNextMonthAction() {
      current_month += 1;
      previous_month_btn.hidden = false;
      can_scroll_next = false;
      let pos = cal_root.scrollLeft;
      let end_of_scroll = pos + cal_width;
      let movement_size = cal_width / scroll_moving_size;

      requestAnimationFrame(nextMonthActionAnimation);

      function nextMonthActionAnimation() {
        if (pos >= end_of_scroll) {
          cal_root.scrollLeft = end_of_scroll;
          can_scroll_next = true;
          let end_of_month = max_month - 1;
          if (cal_root.clientWidth < 400) {
            end_of_month = max_month;
          } else {
            if (current_month == max_month) {
              current_month -= 1;
            }
          }
          if (current_month == end_of_month) {
            next_month_btn.hidden = true;
          } else {
            next_month_btn.hidden = false;
          }
        } else {
          pos += movement_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(nextMonthActionAnimation);
        }
      }
    }
    if (can_scroll_next) {
      doNextMonthAction();
    }
  });
  cal_reset_btn.addEventListener("click", function () {
    if (has_day_limit == "true") {
      cal_night_counter.innerText = "? night";
    }
    decolorize(tbody_btn_container, started_day, ended_day);
    clearEndBtnStyle(ended_day_btn);
    clearStartBtnStyle(started_day_btn);
    swapToStartBtn(
      allTbodyBtns,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day,
      has_day_limit
    );
    cal_second_day_selector.disabled = true;
    started_day = null;
    started_day_btn = null;
    ended_day = null;
    ended_day_btn = null;

    cal_first_day_selector.innerText = first_day_selector_placeholder;
    cal_second_day_selector.innerText = second_day_selector_placeholder;
    cal_first_input.value = null;
    cal_first_input.setAttribute("value", "");
    cal_second_input.value = null;
    cal_second_input.setAttribute("value", "");
    isStartedDay = true;

    current_month = 0;
    can_scroll_next = true;
    can_scroll_previous = true;
    if (cal_root.scrollLeft > 0) {
      previous_month_btn.disabled = true;
      scrollToZero();
    }
    function scrollToZero() {
      let pos = cal_root.scrollLeft;
      let moving_size = pos / scroll_moving_size;
      requestAnimationFrame(scrollToZeroAnimation);
      function scrollToZeroAnimation() {
        if (pos <= 0) {
          previous_month_btn.hidden = true;
          next_month_btn.hidden = false;
          previous_month_btn.disabled = false;
          cal_root.scrollLeft = 0;
        } else {
          pos -= moving_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(scrollToZeroAnimation);
        }
      }
    }
  });
  calendar_dropdown_toggle_bnt.addEventListener("click", function () {
    CloseAllCalender(calendar_dropdown_menu);
    calendar_dropdown_menu.classList.toggle("show");
  });
  cal_done_btn.addEventListener("click", function () {
    calendar_dropdown_menu.classList.remove("show");
  });

  cal_first_day_selector.click();
}
//#endregion

//#region calendar js

let calendar_dropdowns = document.getElementsByClassName("Calender_dropdown");
for (let index = 0; index < calendar_dropdowns.length; index++) {
  const element = calendar_dropdowns[index];
  addCalendarDropdownActions(element);
}
function addCalendarDropdownActions(calendar_dropdown) {
  let selected_btn = null;
  let can_scroll_next = true;
  let can_scroll_previous = true;
  let current_month = 0;
  let cal_reset_btn = calendar_dropdown.querySelector(".cal_reset_btn");
  let calendar_input = calendar_dropdown.querySelector(".calendar_input");
  let cal_root = calendar_dropdown.querySelector(".cal_root");
  let previous_month_btn = calendar_dropdown.querySelector(
    ".previous_month_btn"
  );
  let calendar_dropdown_toggle_bnt = calendar_dropdown.querySelector(
    ".calendar_dropdown_toggle_bnt"
  );
  let calendar_dropdown_menu = calendar_dropdown.querySelector(
    ".calendar_dropdown_menu"
  );
  let cal_done_btn = calendar_dropdown_menu.querySelector(".cal_done_btn");
  let next_month_btn = calendar_dropdown.querySelector(".next_month_btn");
  createAllMonths(cal_root);
  let allTbodyBtns = cal_root.querySelectorAll("." + tbodyBtnClassName);
  disableLastDays(allTbodyBtns);
  for (let index = 0; index < allTbodyBtns.length; index++) {
    const element = allTbodyBtns[index];
    element.addEventListener("click", function () {
      addBtnAnimation(element);
      clearStartBtnStyle(selected_btn);
      selected_btn = element;
      changeStartBtnStyle(element);
      calendar_input.value = getLegibleDate(element.value);
      let normal_date = getNormalDate(element.value);
      calendar_input.setAttribute("value", normal_date);
      calendar_input.dispatchEvent(new Event("input"));
    });
  }
  previous_month_btn.addEventListener("click", function () {
    if (can_scroll_previous) {
      doPreviousMonthAction();
    }
    function doPreviousMonthAction() {
      current_month -= 1;
      next_month_btn.hidden = false;
      can_scroll_previous = false;

      let pos = cal_root.scrollLeft;
      let end_of_scroll = pos - cal_width;
      let movement_size = cal_width / scroll_moving_size;

      requestAnimationFrame(previousMonthActionAnimation);
      function previousMonthActionAnimation() {
        if (pos <= end_of_scroll) {
          cal_root.scrollLeft = end_of_scroll;
          can_scroll_previous = true;
          if (current_month == 0) {
            previous_month_btn.hidden = true;
          } else {
            previous_month_btn.hidden = false;
          }
        } else {
          pos -= movement_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(previousMonthActionAnimation);
        }
      }
    }
  });
  next_month_btn.addEventListener("click", function () {
    function doNextMonthAction() {
      current_month += 1;
      previous_month_btn.hidden = false;
      can_scroll_next = false;
      let pos = cal_root.scrollLeft;
      let end_of_scroll = pos + cal_width;
      let movement_size = cal_width / scroll_moving_size;

      requestAnimationFrame(nextMonthActionAnimation);

      function nextMonthActionAnimation() {
        if (pos >= end_of_scroll) {
          cal_root.scrollLeft = end_of_scroll;
          can_scroll_next = true;
          let end_of_month = max_month - 1;
          if (cal_root.clientWidth < 400) {
            end_of_month = max_month;
          } else {
            if (current_month == max_month) {
              current_month -= 1;
            }
          }
          if (current_month == end_of_month) {
            next_month_btn.hidden = true;
          } else {
            next_month_btn.hidden = false;
          }
        } else {
          pos += movement_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(nextMonthActionAnimation);
        }
      }
    }
    if (can_scroll_next) {
      doNextMonthAction();
    }
  });

  calendar_dropdown_toggle_bnt.addEventListener("click", function () {
    CloseAllCalender(calendar_dropdown_menu);
    calendar_dropdown_menu.classList.toggle("show");
  });
  cal_done_btn.addEventListener("click", function () {
    calendar_dropdown_menu.classList.remove("show");
  });
  cal_reset_btn.addEventListener("click", function () {
    clearStartBtnStyle(selected_btn);
    selected_btn = null;

    calendar_input.value = null;
    calendar_input.setAttribute("value", "");

    current_month = 0;
    can_scroll_next = true;
    can_scroll_previous = true;
    if (cal_root.scrollLeft > 0) {
      previous_month_btn.disabled = true;
      scrollToZero();
    }
    function scrollToZero() {
      let pos = cal_root.scrollLeft;
      let moving_size = pos / scroll_moving_size;
      requestAnimationFrame(scrollToZeroAnimation);
      function scrollToZeroAnimation() {
        if (pos <= 0) {
          previous_month_btn.hidden = true;
          next_month_btn.hidden = false;
          previous_month_btn.disabled = false;
          cal_root.scrollLeft = 0;
        } else {
          pos -= moving_size;
          cal_root.scrollLeft = pos;
          requestAnimationFrame(scrollToZeroAnimation);
        }
      }
    }
  });
}
//#endregion

function controlInputValue(cal_day_selector, cal_input, btn) {
  if (cal_day_selector.innerText != cal_input.placeholder) {
    cal_input.value = cal_day_selector.innerText;
    let normal_date = getNormalDate(btn.value);
    cal_input.setAttribute("value", normal_date);
    cal_input.dispatchEvent(new Event("input"));
  } else {
    cal_input.value = null;
    cal_input.setAttribute("value", "");
  }
}

function CloseAllCalender(dropdown_menu) {
  if (dualCalendar_dropdowns) {
    for (let index = 0; index < dualCalendar_dropdowns.length; index++) {
      const element = dualCalendar_dropdowns[index];
      let calendar_dropdown_menu = element.querySelector(
        ".calendar_dropdown_menu"
      );
      if (dropdown_menu != calendar_dropdown_menu) {
        calendar_dropdown_menu.classList.remove("show");
      }
    }
  }
  for (let index = 0; index < calendar_dropdowns.length; index++) {
    const element = calendar_dropdowns[index];
    let calendar_dropdown_menu = element.querySelector(
      ".calendar_dropdown_menu"
    );
    if (dropdown_menu != calendar_dropdown_menu) {
      calendar_dropdown_menu.classList.remove("show");
    }
  }
}
document.addEventListener("click", function (ev) {
  let cal_dropdown_toggle_btn_clicked = false;
  let cal_dropdown_menu_clicked = false;
  for (let index = 0; index < ev.composedPath().length - 4; index++) {
    const element = ev.composedPath()[index];
    if (element.classList.contains("calendar_dropdown_toggle_bnt")) {
      cal_dropdown_toggle_btn_clicked = true;
      break;
    }
    if (element.classList.contains("calendar_dropdown_menu")) {
      cal_dropdown_menu_clicked = true;
    }
  }
  if (!cal_dropdown_menu_clicked) {
    if (!cal_dropdown_toggle_btn_clicked) {
      CloseAllCalender();
    }
  }
});
