//#region hotel, flight and car tab
var hotel_tab = document.getElementById("hotel_tab");
var flight_tab = document.getElementById("flight_tab");
var car_tab = document.getElementById("car_tab");

var hotel_form = document.getElementById("hotel_form");
var flight_form = document.getElementById("flight_form");
var car_form = document.getElementById("car_form");

var form_header = document.getElementById("form_header");

hotel_tab.addEventListener("click", function () {
  displayHotelFrom(hotel_form, "Hotels");
});
flight_tab.addEventListener("click", function () {
  displayHotelFrom(flight_form, "Flights");
});
car_tab.addEventListener("click", function () {
  displayHotelFrom(car_form, "Car rentals");
});
function displayHotelFrom(form, header_name) {
  form_header.innerText = header_name;
  flight_form.classList.add("d-none");
  hotel_form.classList.add("d-none");
  car_form.classList.add("d-none");
  form.classList.remove("d-none");
}
//#endregion

//#region simple selective dropdown
const dropdown_item_class_name = "dropdown_item";
const dropdown_toggle_btn_class_name = "dropdown_toggle_btn";

var dropdowns = document.getElementsByClassName("dropdown");
var dropdown_menus = document.getElementsByClassName("dropdown_menu");
for (let index = 0; index < dropdowns.length; index++) {
  const element = dropdowns[index];
  //get dropdown toggle btn
  let dropdown_toggle_btn = element.querySelector(
    "." + dropdown_toggle_btn_class_name
  );

  //get dropdown menu to toggle it with show class
  let dropdown_menu = element.querySelector(".dropdown_menu");

  //add function to toggle_btn to toggle show/hide the dropdown_menu
  dropdown_toggle_btn.addEventListener("click", function () {
    closeAllDropdown(dropdown_menu, dropdown_toggle_btn);
    dropdown_menu.classList.toggle("show");
    dropdown_toggle_btn.classList.toggle("blue-color");
  });

  let dropdown_items = element.querySelectorAll("." + dropdown_item_class_name);
  let dropdown_selected_item = element.querySelector(
    ".form-dropdown-item-selected"
  );
  SetDropdownToggleBntValueAndText(
    dropdown_toggle_btn,
    dropdown_items,
    dropdown_selected_item
  );
}
//#endregion

//#region passenger dropdown
var passenger_dropdows = document.getElementsByClassName("passenger-dropdown");
var passenger_dropdown_menus = document.getElementsByClassName(
  "passenger_dropdown_menu"
);
for (let index = 0; index < passenger_dropdows.length; index++) {
  const element = passenger_dropdows[index];
  //show and hide the dropdown
  let passenger_dropdown_menu = element.querySelector(
    ".passenger_dropdown_menu"
  );
  let passenger_toggle_btn = element.querySelector(".form-dropdown-btn");
  let passenger_done_btn = element.querySelector(".passenger_done_btn");
  passenger_toggle_btn.addEventListener("click", function () {
    closeAllDropdown(passenger_dropdown_menu, passenger_toggle_btn);
    passenger_dropdown_menu.classList.toggle("show");
    passenger_toggle_btn.classList.toggle("blue-color");
  });
  passenger_done_btn.addEventListener("click", function () {
    closeAllDropdown(passenger_dropdown_menu, passenger_toggle_btn);
    passenger_dropdown_menu.classList.toggle("show");
    passenger_toggle_btn.classList.toggle("blue-color");
  });
  //update the value of passenger
  let passenger_value_holder = element.querySelector(
    ".passenger_dropdown_set_text"
  );
  let passenger_items = element.querySelectorAll(".passenger_item");
  let passenger_number = 0;
  for (let index = 0; index < passenger_items.length; index++) {
    const item = passenger_items[index];
    let passenger_increase_bnt = item.querySelector(".passenger_increase_bnt");
    let passenger_text = item.querySelector(".passenger_get_text");
    let passenger_decrease_bnt = item.querySelector(".passenger_decrease_bnt");
    let passenger_min_value =
      item.querySelector("[min-value]") == null
        ? null
        : item.querySelector("[min-value]").getAttribute("min-value");
    if (passenger_min_value != null) {
      passenger_decrease_bnt.setAttribute("disabled", "true");
    }
    passenger_number += Number(passenger_text.innerText);
    passenger_increase_bnt.addEventListener("click", function () {
      passenger_text.innerText = Number(passenger_text.innerText) + 1;
      passenger_text.setAttribute("value", passenger_text.innerText);
      passenger_number += 1;
      setPassengerValue(passenger_value_holder, passenger_number);
      passenger_decrease_bnt.removeAttribute("disabled");
      if (passenger_text.innerText == "9") {
        passenger_increase_bnt.setAttribute("disabled", "true");
      }
    });
    passenger_decrease_bnt.addEventListener("click", function () {
      passenger_text.innerText = Number(passenger_text.innerText) - 1;
      passenger_text.setAttribute("value", passenger_text.innerText);
      passenger_number -= 1;
      setPassengerValue(passenger_value_holder, passenger_number);
      passenger_increase_bnt.removeAttribute("disabled");
      if (passenger_min_value != null) {
        if (passenger_text.innerText == passenger_min_value) {
          passenger_decrease_bnt.setAttribute("disabled", "true");
        }
      } else {
        if (passenger_text.innerText == "0") {
          passenger_decrease_bnt.setAttribute("disabled", "true");
        }
      }
    });
  }
  setPassengerValue(passenger_value_holder, passenger_number);
}
function setPassengerValue(value_holder, value) {
  value_holder.setAttribute("value", value);
  value_holder.innerText = value + " passenger";
}
//get all dropdown toggle btn
var all_dropdown_toggle_btn = document.getElementsByClassName(
  "dropdown_toggle_btn"
);
//#endregion

//#region multi city form
var multi_city_form_row_container = document.getElementById(
  "multi_city_form_row_container"
);
var multi_city_form_rows = multi_city_form_row_container.querySelectorAll(
  ".multi_city_form_row"
);
var multi_city_add_btn = document.getElementById("multi_city_add_btn");
var multi_city_count = 1;
DisableLastMultiCityCloseBnt();
for (let index = 0; index < multi_city_form_rows.length; index++) {
  const city_form_row = multi_city_form_rows[index];
  MultiCityFromCloseBtnAction(city_form_row);
}
const multi_city_for_row_html = document.getElementById(
  "multi_city_form_row_container"
).innerHTML;
multi_city_add_btn.addEventListener("click", function () {
  multi_city_count++;
  let new_city_form = document.createElement("DIV");
  new_city_form.innerHTML = multi_city_for_row_html;

  let temp_height = 0;
  new_city_form.style.height = "0";
  new_city_form.style.overflow = "hidden";
  multi_city_form_row_container.appendChild(new_city_form);

  let flight_counter = new_city_form.querySelector(".flight_counter");
  flight_counter.innerText = "Flight " + Number(multi_city_count);

  let height = new_city_form.children[0].clientHeight;
  let increase_size = height / 6;
  requestAnimationFrame(animationDisplay);
  function animationDisplay() {
    if (temp_height >= height) {
      new_city_form.style.height = null;
      new_city_form.style.overflow = null;
    } else {
      temp_height += increase_size;
      new_city_form.style.height = temp_height + "px";
      requestAnimationFrame(animationDisplay);
    }
  }
  //add close action to new city form
  MultiCityFromCloseBtnAction(new_city_form);
  EnableAllDisabledMultiCityCloseBnt();

  let autocomplete_dropdowns = new_city_form.querySelectorAll(
    ".autocomplete_dropdown"
  );

  for (let index = 0; index < autocomplete_dropdowns.length; index++) {
    const element = autocomplete_dropdowns[index];
    AddAutocompleteDropdownActions(element);
  }
  AddTransferLocationsAction(
    new_city_form.querySelector(".transfer_locations_container")
  );
  // console.log(new_city_form);

  addCalendarDropdownActions(new_city_form.querySelector(".Calender_dropdown"));
  if (multi_city_count == 5) {
    multi_city_add_btn.setAttribute("disabled", true);
  }
});

function MultiCityFromCloseBtnAction(param_city_form_row) {
  let multi_city_form_close_btn = param_city_form_row.querySelector(
    ".multi_city_form_close_btn"
  );
  multi_city_form_close_btn.addEventListener("click", function () {
    multi_city_count -= 1;
    param_city_form_row.style.overflow = "hidden";
    let temp_height = param_city_form_row.clientHeight;
    let decrease_size = temp_height / 6;
    DisableLastMultiCityCloseBnt();

    requestAnimationFrame(animationDisplay);

    function animationDisplay() {
      if (temp_height <= 0) {
        param_city_form_row.remove();

        multi_city_add_btn.removeAttribute("disabled");
        updateFlightCount();
      } else {
        temp_height -= decrease_size;
        param_city_form_row.style.height = temp_height + "px";
        requestAnimationFrame(animationDisplay);
      }
    }
  });
  function updateFlightCount() {
    let flight_counters = multi_city_form_row_container.querySelectorAll(
      ".flight_counter"
    );
    for (let index = 0; index < flight_counters.length; index++) {
      const element = flight_counters[index];
      element.innerText = "Flight " + Number(index + 1);
    }
  }
}

function DisableLastMultiCityCloseBnt() {
  if (multi_city_count == 1) {
    let multi_city_form_close_btn = multi_city_form_row_container.querySelectorAll(
      ".multi_city_form_close_btn"
    );
    for (let index = 0; index < multi_city_form_close_btn.length; index++) {
      const element = multi_city_form_close_btn[index];
      element.setAttribute("disabled", "true");
    }
  }
}
function EnableAllDisabledMultiCityCloseBnt() {
  let multi_city_form_close_btn = multi_city_form_row_container.querySelectorAll(
    ".multi_city_form_close_btn[disabled]"
  );
  for (let index = 0; index < multi_city_form_close_btn.length; index++) {
    const element = multi_city_form_close_btn[index];
    element.removeAttribute("disabled");
  }
}
//#endregion

//#region autocomplete
const autocomplete_input_default_icon_name = "search";
var autocomplete_dropdowns = document.getElementsByClassName(
  "autocomplete_dropdown"
);
for (let index = 0; index < autocomplete_dropdowns.length; index++) {
  const element = autocomplete_dropdowns[index];
  AddAutocompleteDropdownActions(element);
}
/**
 *
 * @param {HTMLElement} param_autocomplete_dropdown
 */
function AddAutocompleteDropdownActions(param_autocomplete_dropdown) {
  let autocomplete_input_box = param_autocomplete_dropdown.querySelector(
    ".autocomplete_input_box"
  );
  let autocomplete_dropdown_menu = param_autocomplete_dropdown.querySelector(
    ".autocomplete_dropdown_menu"
  );
  let autocomplete_type = autocomplete_input_box.getAttribute(
    "autocomplete-type"
  );
  let icon_name = autocomplete_input_box.getAttribute("icon-name");
  let autocomplete_input_icon = param_autocomplete_dropdown.querySelector(
    ".autocomplete_set_icon"
  );
  let input_spinner = param_autocomplete_dropdown.querySelector(
    ".form_input_spinner"
  );
  //for multiple fetch api we split them with ',' char
  let autocomplete_type_array = [];
  if (autocomplete_type) {
    autocomplete_type_array = String(autocomplete_type).split(",");
  }
  let icon_name_array = [];
  if (icon_name) {
    icon_name_array = String(icon_name).split(",");
  }

  let scroll_top_animation = null;
  let scroll_top = null;
  let scroll_top_step_size = null;
  autocomplete_input_box.addEventListener("click", function () {
    CloseAllAutocompleteDropdowns();
    ShowAutocompleteDropdownMenu(
      autocomplete_dropdown_menu,
      autocomplete_input_box.value
    );
  });
  autocomplete_input_box.addEventListener("input", function () {
    /*
     when user start to typing the code that we saved in value attribute should be cleared and 
    next time when selected from dropdown menu code will updated.
    also we change input icon to default
    */
    autocomplete_input_box.setAttribute("value", "");
    autocomplete_input_icon.innerText = autocomplete_input_default_icon_name;

    /*
    first we have to check if user really type something in input then we fetch the api so we have to scape the white spaces.
    also we need to know what does the user want to search? city, flight and etc so we have to check the "autocomplete-type" and "icon-name" attribute to not to be null
    */
    if (
      String(autocomplete_input_box.value).trim().length >= 1 &&
      autocomplete_type_array.length > 0 &&
      icon_name_array.length > 0
    ) {
      input_spinner.classList.add("show");

      /*
      because we have multiple fetch we have to use promise.all instead of fetch function,
      so first we prepare our fetch urls with typeof promise.(request_urls)
      because reading hotelook results is different from travelpayout, we have to save type for each of the url
      so we create another array to save that type and icons.(fetch_object_array)
      we detect result type with fetch_object_array index. for example if the index 0 contains type:"hotel" we know that we should read the result with index 0 with readHotellookResult() function
      */
      let request_urls = getRequestURLs(
        autocomplete_type_array,
        autocomplete_input_box.value
      );
      let fetch_object_array = createFetchObjects(
        autocomplete_type_array,
        icon_name_array
      );
      // console.log(request_urls);
      // console.log(fetch_object_array);

      Promise.all(request_urls)
        // map array of responses into an array of response.json() to read their content
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        // all JSON answers are parsed: "results" is the array of them
        .then((results) => {
          input_spinner.classList.remove("show");
          let read_result = readAllResults(results, fetch_object_array);
          if (read_result.length > 0) {
            let items = [];
            items.push({
              name: autocomplete_input_box.value,
              country: "",
              code: "",
              icon: "search",
            });
            items = items.concat(read_result);
            // console.log(items);
            FillAutocompleteItems(
              autocomplete_dropdown_menu,
              autocomplete_input_box,
              autocomplete_input_icon,
              items
            );
            ShowAutocompleteDropdownMenu(
              autocomplete_dropdown_menu,
              autocomplete_input_box.value
            );
          } else {
            clearAndCloseAutocompleteMenu();
          }
        })
        .catch(function (error) {
          // console.error(error);
          input_spinner.classList.remove("show");
        });
    } else {
      clearAndCloseAutocompleteMenu();
    }
  });
  function clearAndCloseAutocompleteMenu() {
    autocomplete_dropdown_menu.innerHTML = null;
    autocomplete_dropdown_menu.classList.remove("show");
  }
  autocomplete_input_box.addEventListener("keydown", function () {
    function calcScrollTop(item_index) {
      let scroll_height = 0;
      for (let index = 0; index <= item_index; index++) {
        const element = items[index];
        scroll_height += element.clientHeight;
      }
      scroll_height -= 175;

      scroll_height = Math.max(0, scroll_height);

      scroll_height = Math.min(
        scroll_height,
        autocomplete_dropdown_menu.scrollHeight
      );

      return scroll_height;
    }

    let items = autocomplete_dropdown_menu.querySelectorAll(
      ".autocomplete_dropdown_item"
    );
    let selected_item = null;
    let selected_item_index = null;
    for (let index = 0; index < items.length; index++) {
      const element = items[index].children[0];
      if (element.matches(".form-dropdown-item-selected")) {
        selected_item = element;
        selected_item_index = index;
      }
    }
    let x = event.keyCode;
    if (x == 38) {
      // 38 is the Up key
      if (selected_item) {
        if (selected_item_index > 0) {
          if (selected_item) {
            scroll_top = calcScrollTop(selected_item_index - 1);
            runScrollTopAnimation();
            let icon = items[selected_item_index - 1].children[0].querySelector(
              ".autocomplete_get_icon"
            );
            let location = items[
              selected_item_index - 1
            ].children[0].querySelector(".autocomplete_get_text");
            selected_item.classList.remove("form-dropdown-item-selected");
            items[selected_item_index - 1].children[0].classList.add(
              "form-dropdown-item-selected"
            );
            //set icon
            autocomplete_input_icon.innerText = icon.innerText;
            //set input value
            autocomplete_input_box.value = location.innerText;
            //set location code
            autocomplete_input_box.setAttribute(
              "value",
              location.getAttribute("code")
            );
          }
        }
      }

      //this action set the caret position to end
      event.preventDefault();
    } else if (x == 40) {
      // 40 is the Down key
      if (items.length > 0) {
        scroll_top = 1000;
        let icon = null;
        let location = null;
        if (selected_item && selected_item_index + 1 < items.length) {
          scroll_top = calcScrollTop(selected_item_index + 1);
          runScrollTopAnimation();
          icon = items[selected_item_index + 1].children[0].querySelector(
            ".autocomplete_get_icon"
          );
          location = items[selected_item_index + 1].children[0].querySelector(
            ".autocomplete_get_text"
          );
          selected_item.classList.remove("form-dropdown-item-selected");
          items[selected_item_index + 1].children[0].classList.add(
            "form-dropdown-item-selected"
          );
        } else if (selected_item == null) {
          scroll_top = 0;
          runScrollTopAnimation();
          icon = items[0].querySelector(".autocomplete_get_icon");
          location = items[0].querySelector(".autocomplete_get_text");
          items[0].children[0].classList.add("form-dropdown-item-selected");
        }
        if (icon && location) {
          //set icon
          autocomplete_input_icon.innerText = icon.innerText;
          //set input value
          autocomplete_input_box.value = location.innerText;
          //set location code
          autocomplete_input_box.setAttribute(
            "value",
            location.getAttribute("code")
          );
        }
      }
    } else if (x == 13) {
      // 40 is the Enter key
      autocomplete_dropdown_menu.classList.remove("show");
      autocomplete_input_box.blur();
    } else if (x == 27) {
      // 27 is the Esc key
      autocomplete_input_box.blur();
    }
  });
  function runScrollTopAnimation() {
    window.cancelAnimationFrame(scroll_top_animation);
    let current_scroll_top = autocomplete_dropdown_menu.scrollTop;
    let difference = current_scroll_top - scroll_top;
    scroll_top_step_size = Math.abs(difference) / 11;
    if (difference > 0) {
      scroll_top_animation = requestAnimationFrame(scrollTopAnimationFunc);
    } else if (difference < 0) {
      scroll_top_animation = requestAnimationFrame(scrollDownAnimationFunc);
    }
  }
  function scrollTopAnimationFunc() {
    let current_scroll_top = autocomplete_dropdown_menu.scrollTop;
    // console.log("ct " + current_scroll_top + " s " + scroll_top);
    if (current_scroll_top <= scroll_top) {
      autocomplete_dropdown_menu.scrollTop = scroll_top;
      scroll_top_animation = null;
      window.cancelAnimationFrame(scroll_top_animation);
    } else {
      autocomplete_dropdown_menu.scrollTop =
        current_scroll_top - scroll_top_step_size;
      scroll_top_animation = requestAnimationFrame(scrollTopAnimationFunc);
    }
  }
  function scrollDownAnimationFunc() {
    let current_scroll_top = autocomplete_dropdown_menu.scrollTop;
    // console.log("cd " + current_scroll_top + " s " + scroll_top);

    if (current_scroll_top >= scroll_top) {
      autocomplete_dropdown_menu.scrollTop = scroll_top;
      scroll_top_animation = null;
      window.cancelAnimationFrame(scroll_top_animation);
    } else {
      autocomplete_dropdown_menu.scrollTop =
        current_scroll_top + scroll_top_step_size;
      //detect infinite loop
      if (autocomplete_dropdown_menu.scrollTop == current_scroll_top) {
        autocomplete_dropdown_menu.scrollTop = scroll_top;
        scroll_top_animation = null;
        window.cancelAnimationFrame(scroll_top_animation);
      } else {
        scroll_top_animation = requestAnimationFrame(scrollDownAnimationFunc);
      }
    }
  }
}

function ShowAutocompleteDropdownMenu(autocomplete_dropdown_menu, input_value) {
  if (
    String(input_value).trim().length >= 1 &&
    autocomplete_dropdown_menu.childElementCount
  ) {
    autocomplete_dropdown_menu.classList.add("show");
  } else {
    autocomplete_dropdown_menu.classList.remove("show");
  }
}
function CloseAllAutocompleteDropdowns() {
  var autocomplete_dropdown_menus = document.getElementsByClassName(
    "autocomplete_dropdown_menu"
  );
  for (let index = 0; index < autocomplete_dropdown_menus.length; index++) {
    const element = autocomplete_dropdown_menus[index];
    element.classList.remove("show");
  }
}

//#endregion

//#region transfer locations
var transfer_locations_containers = document.getElementsByClassName(
  "transfer_locations_container"
);
for (let index = 0; index < transfer_locations_containers.length; index++) {
  const element = transfer_locations_containers[index];
  AddTransferLocationsAction(element);
}
function AddTransferLocationsAction(params_transfer_locations_container) {
  let transfer_locations_btn = params_transfer_locations_container.querySelector(
    ".transfer_locations_btn"
  );
  let autocomplete_dropdown = params_transfer_locations_container.querySelectorAll(
    ".autocomplete_dropdown"
  );
  let first_input = autocomplete_dropdown[0].querySelector("input");
  let first_icon = autocomplete_dropdown[0].querySelector(
    ".autocomplete_set_icon"
  );

  let second_input = autocomplete_dropdown[1].querySelector("input");
  let second_icon = autocomplete_dropdown[1].querySelector(
    ".autocomplete_set_icon"
  );

  let first_dropdown_menu = autocomplete_dropdown[0].querySelector(
    ".autocomplete_dropdown_menu"
  );
  let second_dropdown_menu = autocomplete_dropdown[1].querySelector(
    ".autocomplete_dropdown_menu"
  );

  let can_transfer = true;
  transfer_locations_btn.addEventListener("click", function () {
    CloseAllAutocompleteDropdowns();
    if (can_transfer) {
      rotateTransferButton();
    }
    function rotateTransferButton() {
      let rotate_deg = 0;
      const rotate_amount_per_millisecond = 180 / 7;
      if (can_transfer == true) {
        can_transfer = false;
        transfer_locations_btn.style.transform = "rotate(0)";
        requestAnimationFrame(rotateTransferButtonAnimation);
      }
      function rotateTransferButtonAnimation() {
        if (rotate_deg >= 180) {
          swapAutocompleteMenu();
          swapInputValues();
          swapIcons();
          can_transfer = true;
        } else {
          rotate_deg += rotate_amount_per_millisecond;
          transfer_locations_btn.style.transform =
            "rotate(" + rotate_deg + "deg)";

          requestAnimationFrame(rotateTransferButtonAnimation);
        }
      }
    }
  });
  function swapAutocompleteMenu() {
    let dropdown_menu_temp = first_dropdown_menu.innerHTML;
    first_dropdown_menu.innerHTML = second_dropdown_menu.innerHTML;
    addAutocompleteItemClickedAction(autocomplete_dropdown[0]);
    second_dropdown_menu.innerHTML = dropdown_menu_temp;
    addAutocompleteItemClickedAction(autocomplete_dropdown[1]);
  }
  function swapInputValues() {
    let input_temp = first_input.value;
    first_input.value = second_input.value;
    second_input.value = input_temp;
    let value_temp = first_input.getAttribute("value");
    first_input.setAttribute("value", second_input.getAttribute("value"));
    second_input.setAttribute("value", value_temp);
  }
  function swapIcons() {
    let icon_temp = first_icon.innerText;
    first_icon.innerText = second_icon.innerText;
    second_icon.innerText = icon_temp;
  }
  /**
   *
   * @param {HTMLElement} autocomplete_dropdown
   */
  function addAutocompleteItemClickedAction(autocomplete_dropdown) {
    let items = autocomplete_dropdown.querySelectorAll(
      ".autocomplete_dropdown_item"
    );
    let autocomplete_input_box = autocomplete_dropdown.querySelector(
      ".autocomplete_input_box"
    );
    let autocomplete_dropdown_menu = autocomplete_dropdown.querySelector(
      ".autocomplete_dropdown_menu"
    );
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      let autocomplete_get_text = element.querySelector(
        ".autocomplete_get_text"
      );
      let icon_span = element.querySelector(".autocomplete_get_icon");
      let item = element.children[0];
      element.addEventListener("click", function () {
        autocomplete_input_box.value = autocomplete_get_text.innerText;
        autocomplete_input_box.setAttribute(
          "value",
          autocomplete_get_text.getAttribute("code")
        );
        let autocomplete_input_icon = autocomplete_dropdown.querySelector(
          ".autocomplete_set_icon"
        );
        autocomplete_input_icon.innerText = icon_span.innerText;
        let selected_item = autocomplete_dropdown_menu.querySelector(
          ".form-dropdown-item-selected"
        );

        if (selected_item) {
          selected_item.classList.remove("form-dropdown-item-selected");
        }
        item.classList.add("form-dropdown-item-selected");
      });
    }
  }
}
//#endregion

//#region close dropdowns
function closeAllDropdown(open_dropdown, dropdown_toggle_btn) {
  for (let index = 0; index < dropdown_menus.length; index++) {
    const element = dropdown_menus[index];
    if (open_dropdown != element) {
      element.classList.remove("show");
    }
  }
  for (let index = 0; index < passenger_dropdown_menus.length; index++) {
    const element = passenger_dropdown_menus[index];
    if (open_dropdown != element) {
      element.classList.remove("show");
    }
  }
  for (let index = 0; index < all_dropdown_toggle_btn.length; index++) {
    const element = all_dropdown_toggle_btn[index];
    if (element != dropdown_toggle_btn) {
      element.classList.remove("blue-color");
    }
  }
}
document.addEventListener("click", function (ev) {
  let dropdown_toggle_btn_clicked = false;
  let passenger_dropdown_menu_clicked = false;
  if (!ev.target.matches(".autocomplete_input_box")) {
    CloseAllAutocompleteDropdowns();
  }
  for (let index = 0; index < ev.composedPath().length - 4; index++) {
    const element = ev.composedPath()[index];
    if (element.classList.contains("dropdown_toggle_btn")) {
      dropdown_toggle_btn_clicked = true;
      break;
    }
    if (element.classList.contains("passenger_dropdown_menu")) {
      passenger_dropdown_menu_clicked = true;
    }
  }
  if (!passenger_dropdown_menu_clicked) {
    if (!dropdown_toggle_btn_clicked) {
      closeAllDropdown();
    }
  }
});
function closeAllPopups() {
  closeAllDropdown();
  CloseAllAutocompleteDropdowns();
  CloseAllCalender();
}
document.addEventListener("keydown", function (event) {
  var x = event.keyCode;
  if (x == 27) {
    // 27 is the ESC key
    closeAllPopups();
  }
});
//#endregion
