var addMobileCalendarActions_obj = new addMobileCalendarActions();

//#region mobile dualCalendar js

/**
 * This function add all necessary actions for calendar and its inputs
 */
function addMobileCalendarActions() {
  //first we get and store necessary element from mob_range_calendar and use them after

  /**
   * this is the content of calendar model element
   */
  let model_content = mob_range_calendar.querySelector(
    ".model_content_container"
  );

  //this element holds all the days of calendar
  let mob_range_calendar_days_root = mob_range_calendar.querySelector(
    ".cal_root"
  );

  /**
   * this is the close button of calendar model
   */
  let close_btn = mob_range_calendar.querySelector(".model_close_bnt");

  /**
   * this is the confirm button of calendar model
   */
  let confirm_btn = mob_range_calendar.querySelector(
    "." + "mob_model_confirm_btn"
  );

  /**
   * this element hold calendar selector buttons; calendar selectors are two button that show first selected day(like check-in date) and second day selected(like check-out date). we hide this element when we want to choose only one day (like departure date in one way flight)
   */
  let cal_selector_container = mob_range_calendar.querySelector(
    ".cal_selector_container"
  );

  /**
   * this element show first day selected
   */
  let cal_first_day_selector = mob_range_calendar.querySelector(
    "." + cal_first_day_selector_class_name
  );

  /**
   * this element show second day selected
   */
  let cal_second_day_selector = mob_range_calendar.querySelector(
    "." + cal_second_day_selector_class_name
  );

  //create days
  createAllMonths(mob_range_calendar_days_root, true);

  //after we created the days of calendar, we store them
  /**
   * these are all days of calendar
   */
  let calendar_all_btn = mob_range_calendar_days_root.querySelectorAll(
    "." + tbodyBtnClassName
  );
  //then we have to disable the last days
  disableLastDays(calendar_all_btn);

  let calendar_btn_container = mob_range_calendar_days_root.querySelectorAll(
    "." + cal_selector
  );

  //property that we use them to control calendar

  /**
   * this function is used for add none range calendar inputs action
   */
  this.addNoneRangeCalendarInputsAction = addNoneRangeCalendarInputsAction;
  /**
   * this property store selected day of normal calendar(none range calendar)
   */
  let selected_btn = null;

  /**
   * this property store selected first(or started) day
   */
  let started_day = null;

  /**
   * this property store selected first(or started) day's button
   */
  let started_day_btn = null;

  /**
   * this property store selected second(or ended) day
   */
  let ended_day = null;

  /**
   * this property store selected second(or ended) day's button
   */
  let ended_day_btn = null;

  /**
   * this property store that if it is turned to first day or second day. if it is true that means its turn to select first day or if user select a day, that day is first(or started) day.
   */
  let isStartedDay = true;

  /**
   * this property store if the calendar should check day limit or not. if it is true that means we have disable days after day limit and user has to choose days in in range of day limit
   */
  let has_day_limit = null;

  /**
   * this element show hotel nights count
   */
  let mob_hotel_nights_counter = mob_range_calendar.querySelector(
    ".mob_hotel_nights_counter"
  );
  /**
   * this property store that if the user open range calendar(user have to select two day) or simple calendar(user have to select only one day)
   */
  let is_range_mode_selected = true;

  /**
   * this property store first day selector place holder
   */
  let first_day_selector_placeholder = null;

  /**
   * this property store second day selector place holder
   */
  let second_day_selector_placeholder = null;

  /**
   * this property store first calendar input of range calendar inputs element
   */
  let cal_first_input = null;

  /**
   * this property store second calendar input of range calendar inputs element
   */
  let cal_second_input = null;

  /**
   * this property store input of none range calendar input
   */
  let none_range_cal_input = null;

  let overstep_night_alert = mob_range_calendar.querySelector(
    ".overstep_night_alert"
  );

  //now we have to add click event listener for each days of calendar
  for (let index = 0; index < calendar_all_btn.length; index++) {
    const element = calendar_all_btn[index];
    element.addEventListener("click", function () {
      if (is_range_mode_selected == true) {
        addBtnAnimation(element);
        if (isStartedDay) {
          doFirstDaySelectedAction(element);
        } else {
          doSecondDaySelectedAction(element);
        }
      } else {
        doNoneRangeCalendarDaySelectedAction(element);
      }
    });
  }

  /**
   * this function do all necessary actions when first day selected
   */
  function doFirstDaySelectedAction(element) {
    hideOverstepAlertMessage();
    let last_started_day = started_day;
    cal_first_day_selector.innerText = getLegibleDate(element.value);
    changeStartBtnStyle(element, started_day_btn);
    started_day = element.value;
    started_day_btn = element;
    if (ended_day != null) {
      decolorize(calendar_btn_container, last_started_day, ended_day);
      clearEndBtnStyle(ended_day_btn);
      ended_day = null;
      ended_day_btn = null;
      cal_second_day_selector.innerText = second_day_selector_placeholder;
    }
    isStartedDay = false;
    swapToEndBtn(
      calendar_all_btn,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day
    );
    resetHotelNightCounter();
  }

  /**
   * this function do all necessary actions when second day selected
   */
  function doSecondDaySelectedAction(element) {
    cal_second_day_selector.innerText = getLegibleDate(element.value);
    ended_day = element.value;
    ended_day_btn = element;
    let difference_days = calcDayDifference(started_day, ended_day);
    changeHotelNightCounter(difference_days);
    if (has_day_limit == "true") {
      let first_overstep_btn = controlDayLimit(
        calendar_all_btn,
        started_day,
        element.value
      );
      if (first_overstep_btn) {
        changeEndBtnStyle(element, ended_day_btn, true);
        colorize(
          calendar_btn_container,
          started_day,
          ended_day,
          first_overstep_btn
        );
      } else {
        changeEndBtnStyle(element, ended_day_btn);
        colorize(calendar_btn_container, started_day, ended_day);
      }
    } else {
      changeEndBtnStyle(element, ended_day_btn);
      colorize(calendar_btn_container, started_day, ended_day);
    }
    isStartedDay = true;
    swapToStartBtn(
      calendar_all_btn,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day
    );
  }
  /**
   * this function do all necessary actions when none range calendar day selected
   */
  function doNoneRangeCalendarDaySelectedAction(element) {
    cal_first_day_selector.innerText = getLegibleDate(element.value);
    addBtnAnimation(element);
    clearStartBtnStyle(selected_btn);
    selected_btn = element;
    changeStartBtnStyle(element);
    // confirm_btn.disabled = false;
  }

  // add confirm button click event
  confirm_btn.addEventListener("click", function () {
    if (is_range_mode_selected == true) {
      if (started_day == null) {
        let invalid_title =
          "Please choose " +
          String(first_day_selector_placeholder).toLowerCase();
        cal_first_day_selector.setAttribute("invalid-title", invalid_title);
        raiseRequireMessage(cal_first_day_selector);
      } else {
        if (ended_day == null) {
          let invalid_title =
            "Please choose " +
            String(second_day_selector_placeholder).toLowerCase();
          cal_second_day_selector.setAttribute("invalid-title", invalid_title);
          raiseRequireMessage(cal_second_day_selector);
        } else {
          if (has_day_limit == "true") {
            let day_difference = calcDayDifference(started_day, ended_day);
            if (day_difference > 30) {
              showOverstepNightsErrorMessage();
            } else {
              setInputValue(cal_first_input, started_day);
              setInputValue(cal_second_input, ended_day);
              closeDropdownModel(mob_range_calendar);
            }
          } else {
            setInputValue(cal_first_input, started_day);
            setInputValue(cal_second_input, ended_day);
            closeDropdownModel(mob_range_calendar);
          }
        }
      }
    } else {
      if (selected_btn) {
        setInputValue(none_range_cal_input, selected_btn.value);
        closeDropdownModel(mob_range_calendar);
      } else {
        let invalid_title = "Please choose departure date";
        cal_first_day_selector.setAttribute("invalid-title", invalid_title);
        raiseRequireMessage(cal_first_day_selector);
      }
    }
  });

  //add close btn click event
  close_btn.addEventListener("click", function () {
    closeDropdownModel(mob_range_calendar);
  });

  //now lets gather all range calendar inputs container elements

  /**
   * these are range calendar inputs container element
   */
  let range_calendar_inputs_container = document.getElementsByClassName(
    "calendar_dropdown_toggle_bnt1"
  );

  //now we have to add necessary actions to range calendar inputs

  for (let index = 0; index < range_calendar_inputs_container.length; index++) {
    const element = range_calendar_inputs_container[index];
    addRangeCalendarInputsAction(element);
  }

  /**
   * this function add all necessary actions for range calendar inputs
   * @param {HTMLElement} element
   */
  function addRangeCalendarInputsAction(element) {
    /**
     * this property store first input element of range calendar inputs
     */
    let first_input = element.querySelector(".cal_first_input");

    /**
     * this property store second input element of range calendar inputs
     */
    let second_input = element.querySelector(".cal_second_input");

    /**
     * this property store day limit. if there is exists
     */
    let day_limit = element.getAttribute("has-day-limit");

    /**
     * this property store title of calendar model
     */
    let title = element.getAttribute("model-title");

    //now we have to add click event listener to range calendar inputs
    element.addEventListener("click", function () {
      overstep_night_alert.classList.add("d-none");
      reset_mobile_calendar_properties();
      cal_first_input = first_input;
      cal_second_input = second_input;
      has_day_limit = day_limit;
      if (day_limit == "true") {
        resetAndShowHotelNightCounter();
      } else {
        hideHotelNightCounter();
      }
      first_day_selector_placeholder = first_input.placeholder;
      second_day_selector_placeholder = second_input.placeholder;
      cal_first_day_selector.innerText = first_day_selector_placeholder;
      cal_second_day_selector.innerText = second_day_selector_placeholder;
      is_range_mode_selected = true;
      showDaySelectorContainer();

      showModel(mob_range_calendar, model_content);
    });

    /**
     *
     * @param {Number} days
     */
  }

  /**
   * this function show an alert message of overstep nights with animation
   */
  function showOverstepNightsErrorMessage() {
    overstep_night_alert.classList.remove("d-none");
    // let alert_message_alert_height = overstep_night_alert.clientHeight;
    // let increase_size = alert_message_alert_height / 5;
    // // let increase_size = 1;
    // // console.log(increase_size);
    // let height_temp = 0;
    // requestAnimationFrame(showOverstepAlertMessageAnimation);
    // function showOverstepAlertMessageAnimation() {
    //   if (height_temp >= alert_message_alert_height) {
    //     overstep_night_alert.style.height = null;
    //   } else if (height_temp < alert_message_alert_height) {
    //     height_temp += increase_size;
    //     overstep_night_alert.style.height = height_temp + "px";
    //     requestAnimationFrame(showOverstepAlertMessageAnimation);
    //   }
    // }
  }
  function hideOverstepAlertMessage() {
    overstep_night_alert.classList.add("d-none");

    // let alert_message_alert_height = overstep_night_alert.clientHeight;
    // let increase_size = alert_message_alert_height / 5;
    // // let increase_size = 1;
    // // console.log(increase_size);

    // let height_temp = alert_message_alert_height;
    // // console.log(height_temp);
    // requestAnimationFrame(hideOverstepAlertMessageAnimation);
    // function hideOverstepAlertMessageAnimation() {
    //   if (height_temp <= 0) {
    //     overstep_night_alert.classList.add("d-none");
    //     overstep_night_alert.style.height = null;
    //   } else {
    //     height_temp -= increase_size;
    //     overstep_night_alert.style.height = height_temp + "px";
    //     requestAnimationFrame(hideOverstepAlertMessageAnimation);
    //   }
    // }
  }

  /**
   * this function reset the night counter
   */
  function resetHotelNightCounter() {
    mob_hotel_nights_counter.innerText = "(? nights)";
    mob_hotel_nights_counter.classList.remove(
      "mob-calendar-night-counter-warning"
    );
  }
  /**
   * this function show the night counter
   */
  function showHotelNightCounter() {
    mob_hotel_nights_counter.style.display = "block";
  }

  /**
   * this function update the night counter. and if the nights more than 30 days paint it with red color
   * @param {Number} days
   */
  function changeHotelNightCounter(days) {
    if (days == 1) {
      mob_hotel_nights_counter.innerText = "(" + String(days) + " night)";
    } else {
      mob_hotel_nights_counter.innerText = "(" + String(days) + " nights)";
    }

    if (days > 30) {
      mob_hotel_nights_counter.classList.add(
        "mob-calendar-night-counter-warning"
      );
    } else {
      mob_hotel_nights_counter.classList.remove(
        "mob-calendar-night-counter-warning"
      );
    }
  }
  /**
   * this function reset the night counter and show it
   */
  function resetAndShowHotelNightCounter() {
    resetHotelNightCounter();
    showHotelNightCounter();
  }
  function hideHotelNightCounter() {
    mob_hotel_nights_counter.style.display = "none";
  }
  /**
   * this function show range calendar day selector buttons
   */
  function showDaySelectorContainer() {
    // cal_selector_container.classList.add("d-flex");
    // cal_selector_container.style.display = "block";
    cal_second_day_selector.style.display = "block";
  }

  /**
   * this function reset all properties of mobile calendar
   */
  function reset_mobile_calendar_properties() {
    decolorize(calendar_btn_container, started_day, ended_day);
    clearEndBtnStyle(ended_day_btn);
    clearStartBtnStyle(started_day_btn);
    clearStartBtnStyle(selected_btn);
    swapToStartBtn(
      calendar_all_btn,
      cal_second_day_selector,
      cal_first_day_selector,
      started_day
    );
    started_day = null;
    started_day_btn = null;
    ended_day = null;
    ended_day_btn = null;
    isStartedDay = true;
    selected_btn = null;
    // confirm_btn.disabled = true;
  }

  /**
   * this function hide range calendar day selector buttons
   */
  function hideDaySelectorContainer() {
    // cal_selector_container.classList.remove("d-flex");
    // cal_selector_container.style.display = "none";
    cal_second_day_selector.style.display = "none";
    cal_first_day_selector.innerText = "Departure date";
  }

  //now lets gather all none range calendar inputs container elements

  /**
   * these are range calendar inputs container element
   */
  let none_range_calendar_inputs_container = document.getElementsByClassName(
    "calendar_dropdown_toggle_bnt"
  );

  //now we have to add necessary actions to range calendar inputs
  for (
    let index = 0;
    index < none_range_calendar_inputs_container.length;
    index++
  ) {
    const element = none_range_calendar_inputs_container[index];
    addNoneRangeCalendarInputsAction(element);
  }
  /**
   * this function add all necessary actions for none range calendar inputs
   * @param {HTMLElement} element
   */
  function addNoneRangeCalendarInputsAction(element) {
    let cal_input = element.querySelector(".calendar_input");

    element.addEventListener("click", function () {
      hideHotelNightCounter();
      reset_mobile_calendar_properties();
      none_range_cal_input = cal_input;
      is_range_mode_selected = false;
      hideDaySelectorContainer();

      showModel(mob_range_calendar, model_content);
    });
  }

  /**
   *
   * @param {HTMLElement} input
   * @param {String} value
   */
  function setInputValue(input, value) {
    if (input && value) {
      input.value = getLegibleDate(value);
      let normal_date = getNormalDate(value);
      input.setAttribute("value", normal_date);
    }
  }
}
/**
 * this function calculate the difference of two days
 * @param {String} started_day
 * @param {String} ended_day
 */

function controlDayLimit(all_btn, started_day, ended_day) {
  let start_day_index;
  let last_day_index;
  if (started_day != null && ended_day != null) {
    for (let index = 0; index < all_btn.length; index++) {
      const element = all_btn[index];
      if (element.value == started_day) {
        start_day_index = index;
        last_day_index = index;
        break;
      }
    }
    for (
      let index = start_day_index;
      index < start_day_index + 31;
      index++, last_day_index++
    ) {
      const element = all_btn[index];
      if (element.value == ended_day) {
        return;
      }
    }
    return all_btn[last_day_index];
  }
  return;
}
//#endregion
