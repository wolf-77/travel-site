//------------------------calendar body template------------------------//

/* <div class="text-center">
      <div style="height: 40px" class="d-flex mt-3">
        <h6 id="cal_month" class="m-auto">
          Month
        </h6>
      </div>
      <div class="mt-3 border-bottom">
        <table class="table table-borderless cal-table">
          <thead>
            <tr>
              <th class="cal-thead-cell">S</th>
              <th class="cal-thead-cell">M</th>
              <th class="cal-thead-cell">T</th>
              <th class="cal-thead-cell">W</th>
              <th class="cal-thead-cell">T</th>
              <th class="cal-thead-cell">F</th>
              <th class="cal-thead-cell">S</th>
            </tr>
          </thead>
          <tbody id="cal_tbody"></tbody>
        </table>
      </div>
    </div> */

const max_month = 11;
const cal_width = 335;
const scroll_moving_size = 8;
const scroll_interval_time = 1;
const tbodyBtnClassName = "cal-tbody-btn";
const cal_month_list = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const short_month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const cal_selector = "td-btn-container";
const mob_dualCalender_class_name = "mob_dualCalender";
const cal_first_input_class_name = "cal_first_input";
const cal_second_input_class_name = "cal_second_input";
const cal_first_day_selector_class_name = "cal_first_day_selector";
const cal_second_day_selector_class_name = "cal_second_day_selector";
const cal_root_class_name = "cal_root";
const mob_model_confirm_btn_class_name = "mob_model_confirm_btn";
const mob_cal_model_class_name = "mob_cal_model";
const server_date = getServerDate();

function getServerDate() {
  let body = document.getElementById("body");
  let year = body.getAttribute("year");
  let month = body.getAttribute("month");
  let day = body.getAttribute("day");
  return new Date(year, month, day);
}

function getNormalDate(date) {
  let splitted_date = String(date).split("-");
  let normal_date = "";
  normal_date += splitted_date[0] + "-";
  normal_date += String(Number(splitted_date[1]) + 1) + "-";
  normal_date += splitted_date[2];
  return normal_date;
}
function clearEndBtnStyle(ended_day_btn) {
  if (ended_day_btn != null) {
    removeClassName_cal_tbody_end_btn(ended_day_btn);
  }
}
function changeEndBtnStyle(element, ended_day_btn, is_overstep) {
  if (ended_day_btn != null) {
    removeClassName_cal_tbody_end_btn(ended_day_btn, is_overstep);
  }
  addClassName_cal_tbody_end_btn(element, is_overstep);
}

/**
 *  this function painting between the day of first and second selected days of calendar
 * @param {NodeListOf<HTMLElement>} tbody_btn_containers all the elements of inside of calendar that have 'td-btn-container' class name
 * @param {HTMLElement} started_day first day selected button with 'cal-tbody-btn' class name
 * @param {HTMLElement} ended_day second day selected button with 'cal-tbody-btn' class name
 * @param {HTMLElement} first_overstep_btn first overstep button if calendar has day limit and user cross that limitation
 *
 */
function colorize(
  tbody_btn_containers,
  started_day,
  ended_day,
  first_overstep_btn
) {
  let start_pos;
  let end_pos;
  let first_overstep_pos;
  if (started_day != null && ended_day != null) {
    for (let index = 0; index < tbody_btn_containers.length; index++) {
      const element = tbody_btn_containers[index].children[0];
      if (element.value == started_day) {
        start_pos = index;
      } else if (element == first_overstep_btn) {
        first_overstep_pos = index;
        if (first_overstep_btn.value == ended_day) {
          end_pos = index;
          break;
        }
      } else if (element.value == ended_day) {
        end_pos = index;
        break;
      }
    }
    if (first_overstep_btn) {
      for (let index = start_pos; index < first_overstep_pos; index++) {
        const element = tbody_btn_containers[index];
        addClassName_cal_td_selected_bg(element);
      }
      for (let index = first_overstep_pos; index <= end_pos; index++) {
        const element = tbody_btn_containers[index];
        addClassName_cal_td_selected_bg(element, true);
      }
    } else {
      for (let index = start_pos; index <= end_pos; index++) {
        const element = tbody_btn_containers[index];
        addClassName_cal_td_selected_bg(element);
      }
    }
    //add radius
    addClassName_cal_td_start_radius(tbody_btn_containers[start_pos]);
    addClassName_cal_td_end_radius(tbody_btn_containers[end_pos]);
  }
}
/**
 *  this function decolorize the colored days of calendar
 * @param {NodeListOf<HTMLElement>} tbody_btn_containers all the elements of inside of calendar that have 'td-btn-container' class name
 * @param {String} started_day the first day that selected
 * @param {String} ended_day the second day that selected
 */
function decolorize(tbody_btn_containers, started_day, ended_day) {
  if (started_day && ended_day) {
    let started_day_index;
    for (let index = 0; index < tbody_btn_containers.length; index++) {
      const element = tbody_btn_containers[index].children[0];
      if (element.value == started_day) {
        started_day_index = index;
        break;
      }
    }
    for (
      let index = started_day_index;
      index < tbody_btn_containers.length;
      index++
    ) {
      const element = tbody_btn_containers[index];
      removeClassName_cal_td_selected_bg(element);
      removeClassName_cal_td_start_radius(element);
      removeClassName_cal_td_end_radius(element);
      if (element.children[0].value == ended_day) {
        break;
      }
    }
  }
}

/**
 * this function active the first day selector button (change style that shows that is active) adn deactivate the second day selector button
 * @param {NodeListOf<HTMLElement>} tbody_all_btn all the elements of inside of calendar that have 'cal-tbody-btn' class name. all the days of the calendar
 * @param {HTMLElement} cal_second_day_selector the element that has 'cal_second_day_selector' class name
 * @param {HTMLElement} cal_first_day_selector the element that has 'cal_first_day_selector' class name
 * @param {String} started_day the first day that selected
 * @param {Boolean} has_day_limit if calendar has 30 day limit or not
 */
function swapToStartBtn(
  tbody_all_btn,
  cal_second_day_selector,
  cal_first_day_selector,
  started_day,
  has_day_limit
) {
  var current_date = server_date;
  removeClassName_cal_selector_active(cal_second_day_selector);
  addClassName_cal_selector_active(cal_first_day_selector);

  var temp_started_day = current_date.getDate() - 1;
  // if (started_day != null) {
  //   for (let index = temp_started_day; index < tbody_all_btn.length; index++) {
  //     const element = tbody_all_btn[index];
  //     element.disabled = false;
  //     if (element.value == started_day) {
  //       break;
  //     }
  //   }
  // }

  if (started_day != null) {
    if (has_day_limit == "true") {
      for (
        let index = temp_started_day;
        index < tbody_all_btn.length;
        index++
      ) {
        const element = tbody_all_btn[index];
        element.disabled = false;
      }
    } else {
      for (
        let index = temp_started_day;
        index < tbody_all_btn.length;
        index++
      ) {
        const element = tbody_all_btn[index];
        element.disabled = false;
        if (element.value == started_day) {
          break;
        }
      }
    }
  }
}

/**
 * this function active the second day selector button (change style that shows that is active) adn deactivate the first day selector button and if calendar has day limit then it disable the the rest buttons
 * @param {NodeListOf<HTMLElement} tbody_all_btn all the elements of inside of calendar that have 'cal-tbody-btn' class name. all the days of the calendar
 * @param {HTMLElement} cal_second_day_selector the element that has 'cal_second_day_selector' class name
 * @param {HTMLElement} cal_first_day_selector the element that has 'cal_first_day_selector' class name
 * @param {String} started_day selected first(start) day value
 * @param {Boolean} has_day_limit if calendar has 30 day limit or not
 */
function swapToEndBtn(
  tbody_all_btn,
  cal_second_day_selector,
  cal_first_day_selector,
  started_day,
  has_day_limit
) {
  removeClassName_cal_selector_active(cal_first_day_selector);
  addClassName_cal_selector_active(cal_second_day_selector);

  let index;
  if (started_day != null) {
    for (index = 0; index < tbody_all_btn.length; index++) {
      const element = tbody_all_btn[index];
      if (element.value == started_day) {
        element.disabled = true;
        break;
      }
      element.disabled = true;
    }
    if (has_day_limit == "true") {
      index += 31;
      if (index < tbody_all_btn.length) {
        for (let index1 = index; index1 < tbody_all_btn.length; index1++) {
          const element = tbody_all_btn[index1];
          element.disabled = true;
        }
      }
    }
  }
}

//#region classes
function addClassName_cal_tbody_start_btn(element) {
  element.classList.add("cal-tbody-start-btn");
}
function removeClassName_cal_tbody_start_btn(element) {
  if (element.classList.contains("cal-tbody-start-btn")) {
    element.classList.remove("cal-tbody-start-btn");
  }
}
function addClassName_cal_tbody_end_btn(element, is_overstep) {
  if (is_overstep) {
    element.classList.add("cal-tbody-end-btn-danger");
  } else {
    element.classList.add("cal-tbody-end-btn");
  }
}
function removeClassName_cal_tbody_end_btn(element) {
  element.classList.remove("cal-tbody-end-btn");
  element.classList.remove("cal-tbody-end-btn-danger");
}
function addClassName_cal_selector_active(element) {
  element.classList.add("cal-selector-active");
}
function removeClassName_cal_selector_active(element) {
  if (element.classList.contains("cal-selector-active")) {
    element.classList.remove("cal-selector-active");
  }
}
function addClassName_cal_td_selected_bg(element, is_overstep) {
  if (is_overstep) {
    element.classList.add("cal-td-selected-danger-bg");
  } else {
    element.classList.add("cal-td-selected-bg");
  }
}
function removeClassName_cal_td_selected_bg(element) {
  element.classList.remove("cal-td-selected-bg");
  element.classList.remove("cal-td-selected-danger-bg");
}
function addClassName_cal_td_start_radius(element) {
  element.classList.add("cal-td-start-radius");
}
function removeClassName_cal_td_start_radius(element) {
  if (element.classList.contains("cal-td-start-radius")) {
    element.classList.remove("cal-td-start-radius");
  }
}
function addClassName_cal_td_end_radius(element) {
  element.classList.add("cal-td-end-radius");
}
function removeClassName_cal_td_end_radius(element) {
  if (element.classList.contains("cal-td-end-radius")) {
    element.classList.remove("cal-td-end-radius");
  }
}
//#endregion
function disableLastDays(btns) {
  var current_date = server_date;
  var temp_started_day = current_date.getDate() - 1;
  for (let index = 0; index < temp_started_day; index++) {
    const element = btns[index];
    element.disabled = true;
  }
}
/**
 * This function returns days of the month
 * @param {Number} year
 * @param {Number} month ATTENTION: month has to be started from 1, not 0
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
/**
 * this function calculate the difference days of two dates
 * @param {String} started_day first(started) day
 * @param {String} ended_day second(ended) day
 */
function calcDayDifference(started_day, ended_day) {
  let started_day_splitted = started_day.split("-");
  let ended_day_splitted = ended_day.split("-");
  let first_year = Number(started_day_splitted[0]);
  let second_year = Number(ended_day_splitted[0]);
  let first_month = Number(started_day_splitted[1]);
  let second_month = Number(ended_day_splitted[1]);
  let first_day = Number(started_day_splitted[2]);
  let second_day = Number(ended_day_splitted[2]);

  if (first_year == second_year && first_month == second_month) {
    return second_day - first_day;
  } else {
    let difference_days = second_day;
    difference_days += daysInMonth(first_year, first_month + 1) - first_day;

    let difference_year = second_year - first_year;
    let difference_month = difference_year * 12 + (second_month - first_month);
    for (let index = 0; index < difference_month - 1; index++) {
      difference_days += daysInMonth(first_year, first_month + index + 1);
    }
    return difference_days;
  }
}
/**
 *
 * @param {HTMLElement} cal_tbody
 * @param {Boolean} mob_version
 */
function createAllMonths(cal_tbody, mob_version) {
  let tbody = "";
  let current_date = server_date;
  let month_count = current_date.getMonth();
  for (let index = 0; index <= max_month; index++, month_count++) {
    const new_date = new Date(current_date.getFullYear(), month_count);
    if (mob_version) {
      tbody += mob_createMonth(new_date.getFullYear(), new_date.getMonth());
    } else {
      tbody += createMonth(new_date.getFullYear(), new_date.getMonth());
    }
  }
  cal_tbody.innerHTML = tbody;
}
function createMonth(year, month) {
  let month_HtmlElements = "";
  let tbody_children = createTbodyChildren(year, month);
  month_HtmlElements +=
    `  <div class="text-center border-bottom" style="flex:1">
    <div style="height: 40px" class="d-flex mt-3">
      <h6 class="m-auto dark-blue-color font-weight-bold">` +
    cal_month_list[month] +
    " " +
    year +
    `</h6>
    </div>
    <div class="">
      <table class="table table-borderless cal-table">
        <thead>
          <tr>
            <th class="cal-thead-cell dark-blue-color">Su</th>
            <th class="cal-thead-cell dark-blue-color">Mo</th>
            <th class="cal-thead-cell dark-blue-color">Tu</th>
            <th class="cal-thead-cell dark-blue-color">We</th>
            <th class="cal-thead-cell dark-blue-color">Th</th>
            <th class="cal-thead-cell dark-blue-color">Fr</th>
            <th class="cal-thead-cell dark-blue-color">Sa</th>
          </tr>
        </thead>
        <tbody>
        ` +
    tbody_children +
    `
        </tbody>
      </table>
    </div>
  </div>`;
  return month_HtmlElements;
}
function mob_createMonth(year, month) {
  let month_HtmlElements = "";
  let tbody_children = createTbodyChildren(year, month);
  month_HtmlElements +=
    ` <div class="mpb-cal-month-container px-15">
          <span>` +
    cal_month_list[month] +
    " " +
    year +
    `</span>
        </div>
        <div class="mob-cal-padding">
          <table class="table table-borderless cal-table">
            <tbody>
            ` +
    tbody_children +
    `
            </tbody>
          </table>
        </div>`;
  return month_HtmlElements;
}
function createTbodyChildren(year, month) {
  let days_in_month = 32 - new Date(year, month, 32).getDate();
  let date = new Date(year, month);
  let day_cont;
  let fdw_cont; //first day of week count
  let tbody_children = "<tr>";
  let first_day_of_week = date.getDay();
  for (fdw_cont = 0; fdw_cont < first_day_of_week; fdw_cont++) {
    tbody_children += "<td></td>";
  }
  for (day_cont = 1; fdw_cont < 7; day_cont++, fdw_cont++) {
    tbody_children +=
      `
    <td class="` +
      cal_selector +
      `">
        <button class="btn cal-tbody-btn" value="` +
      date.getFullYear() +
      "-" +
      date.getMonth() +
      "-" +
      day_cont +
      ` ">` +
      day_cont +
      ` 
        </button>
      </td>`;
  }
  tbody_children += "</tr>";
  while (day_cont <= days_in_month) {
    tbody_children += "<tr>";
    for (
      let index1 = 0;
      index1 < 7 && day_cont <= days_in_month;
      index1++, day_cont++
    ) {
      tbody_children +=
        `
    <td class="` +
        cal_selector +
        `">
        <button class="btn cal-tbody-btn" value="` +
        date.getFullYear() +
        "-" +
        date.getMonth() +
        "-" +
        day_cont +
        `" >` +
        day_cont +
        ` 
        </button>
      </td>`;
    }

    tbody_children += "</tr>";
  }
  return tbody_children;
}
function getLegibleDate(date) {
  let splitted_date = date.split("-");
  let selected_date = new Date(
    Number(splitted_date[0]),
    Number(splitted_date[1]),
    Number(splitted_date[2])
  );
  return (
    days[selected_date.getDay()] +
    ", " +
    short_month[selected_date.getMonth()] +
    " " +
    selected_date.getDate()
  );
}
function addBtnAnimation(btn) {
  btn.classList.add("cal-tbody-btn-animation");
  setTimeout(clearAnimation, 300, btn);
}
function clearAnimation(btn) {
  btn.classList.remove("cal-tbody-btn-animation");
}
function changeStartBtnStyle(element, started_day_btn) {
  if (started_day_btn != null) {
    removeClassName_cal_tbody_start_btn(started_day_btn);
  }
  addClassName_cal_tbody_start_btn(element);
}
function clearStartBtnStyle(started_day_btn) {
  if (started_day_btn != null) {
    removeClassName_cal_tbody_start_btn(started_day_btn);
  }
}
