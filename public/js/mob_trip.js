//#region hotel, flight and car tab
var hotel_tab = document.getElementById("hotel_tab");
var flight_tab = document.getElementById("flight_tab");
var car_tab = document.getElementById("car_tab");

var hotel_form = document.getElementById("hotel_form");
var flight_form = document.getElementById("flight_form");
var car_form = document.getElementById("car_form");

var form_header = document.getElementById("form_header");

hotel_tab.addEventListener("click", function () {
  displayHotelFrom(hotel_form, hotel_tab);
});
flight_tab.addEventListener("click", function () {
  displayHotelFrom(flight_form, flight_tab);
});
car_tab.addEventListener("click", function () {
  displayHotelFrom(car_form, car_tab);
});
function displayHotelFrom(form, form_tab) {
  flight_form.classList.add("d-none");
  hotel_form.classList.add("d-none");
  car_form.classList.add("d-none");
  form.classList.remove("d-none");
  hotel_tab.classList.remove("mob-nav-item-selected");
  flight_tab.classList.remove("mob-nav-item-selected");
  car_tab.classList.remove("mob-nav-item-selected");
  form_tab.classList.add("mob-nav-item-selected");
}
//#endregion

//#region transfer input values

let mob_transfers = document.getElementsByClassName("mob_transfer");
for (let index = 0; index < mob_transfers.length; index++) {
  const element = mob_transfers[index];
  addMobTransferActions(element);
}
/**
 *
 * @param {HTMLElement} element
 */
function addMobTransferActions(element) {
  // console.log(element);
  let input_containers = element.querySelectorAll(".input_container");
  let first_input = input_containers[0].querySelector(".form_input");
  let second_input = input_containers[1].querySelector(".form_input");

  let first_input_icon = input_containers[0].querySelector(
    ".autocomplete_set_icon"
  );
  let second_input_icon = input_containers[1].querySelector(
    ".autocomplete_set_icon"
  );
  // console.log(input_containers[0]);
  // console.log(input_containers[1]);
  // console.log(first_input);
  // console.log(second_input);
  let transfer_bnt = element.querySelector(".transfer_btn");

  let can_transfer = true;

  transfer_bnt.addEventListener("click", function () {
    rotateTransferButton();
  });
  function rotateTransferButton() {
    let rotate_deg = 90;
    const rotate_amount_per_millisecond = 180 / 9;
    if (can_transfer == true) {
      can_transfer = false;
      transfer_bnt.style.transform = "rotate(90deg)";
      requestAnimationFrame(rotateTransferButtonAnimation);
    }
    function rotateTransferButtonAnimation() {
      if (rotate_deg >= 270) {
        swapInputsValues(first_input, second_input);
        swapInputsIcons(first_input_icon, second_input_icon);
        can_transfer = true;
      } else {
        rotate_deg += rotate_amount_per_millisecond;
        transfer_bnt.style.transform = "rotate(" + rotate_deg + "deg)";

        requestAnimationFrame(rotateTransferButtonAnimation);
      }
    }
  }
}
/**
 *
 * @param {HTMLElement} first_input
 * @param {HTMLElement} second_input
 */
function swapInputsValues(first_input, second_input) {
  let first_input_text_temp = first_input.value;
  first_input.value = second_input.value;
  second_input.value = first_input_text_temp;

  let first_input_value_temp = first_input.getAttribute("value");
  first_input.setAttribute("value", second_input.getAttribute("value"));
  second_input.setAttribute("value", first_input_value_temp);
}
/**
 * this function swap input's icons
 * @param {HTMLElement} first_icon element that hold icon
 * @param {HTMLElement} second_icon element that hold second icon
 */
function swapInputsIcons(first_icon, second_icon) {
  let temp_of_first_icon_name = first_icon.innerText;
  first_icon.innerText = second_icon.innerText;
  second_icon.innerText = temp_of_first_icon_name;
}
//#endregion

//#region dropdown
const mob_dropdown_class_name = "mob_dropdown";
const dropdown_toggle_btn_class_name = "dropdown_toggle_btn";
const mob_dropdown_model_class_name = "mob_dropdown_model";
const mob_dropdown_model_content_class_name = "mob_dropdown_model_content";
const dropdown_item_class_name = "dropdown_item";

var mob_dropdowns = document.getElementsByClassName(mob_dropdown_class_name);

for (let index = 0; index < mob_dropdowns.length; index++) {
  const element = mob_dropdowns[index];
  addMobDropdownActions(element);
}

/**
 * This function add all needed action to mob_dropdown
 * @param {HTMLElement} mob_dropdown
 */
function addMobDropdownActions(mob_dropdown) {
  let toggle_btn = mob_dropdown.querySelector(
    "." + dropdown_toggle_btn_class_name
  );
  let items = mob_dropdown.querySelectorAll("." + dropdown_item_class_name);
  let selected_bnt = mob_dropdown.querySelector(
    "." + dropdown_selected_item_class_name
  );
  let model = mob_dropdown.querySelector("." + mob_dropdown_model_class_name);
  let model_content = mob_dropdown.querySelector(
    "." + mob_dropdown_model_content_class_name
  );
  SetDropdownToggleBntValueAndText(toggle_btn, items, selected_bnt);

  controlDropdownModel(model, model_content, toggle_btn, items);
}

/**
 * This function control show and hide of model and model_content
 * @param {HTMLElement} model
 * @param {HTMLElement} model_content
 * @param {HTMLElement} toggle_bnt
 * @param {NodeListOf<HTMLElement>} items
 */
function controlDropdownModel(model, model_content, toggle_bnt, items) {
  toggle_bnt.addEventListener("click", function () {
    showDropdownModel(model, model_content);
  });
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    element.addEventListener("click", function () {
      closeDropdownModel(model);
    });
  }
}
/**
 * Tihs function show the model and it's content
 * @param {HTMLElement} model
 * @param {HTMLElement} model_content
 */
function showDropdownModel(model, model_content) {
  let body = document.querySelector("body");
  body.style.overflow = "hidden";

  model_content.style.opacity = "0";

  model.classList.add("show");

  let model_content_height = model_content.clientHeight;
  //   console.log(model_content_height);
  model_content.style.opacity = null;
  let increase_size = model_content_height / 9;
  // console.log(increase_size);s

  let height_temp = 0;
  function model_content_animation() {
    if (height_temp >= model_content_height) {
      model_content.style.height = model_content_height + "px";
    } else {
      height_temp += increase_size;
      model_content.style.height = height_temp + "px";
      requestAnimationFrame(model_content_animation);
    }
  }
  requestAnimationFrame(model_content_animation);
}

/**
 * This function close the model and it's content
 * @param {HTMLElement} model
 */
function closeDropdownModel(model) {
  //enable scrolling of body when model close
  let body = document.querySelector("body");
  body.style.overflow = "auto";

  model.classList.remove("show");
}
//#endregion

//#region autocomplete
const form_input_class_name = "form_input";
const model_input_class_name = "model_input";
const autocomplete_dropdown_item_class_name = "autocomplete_dropdown_item";
const mob_input_model_class_name = "mob_input_model";
const mob_autocomplete_model_class_name = "mob_autocomplete_model";
const model_close_bnt_class_name = "model_close_bnt";
const form_input_container_class_name = "form_input_container";
const model_input_container_class_name = "model_input_container";
const autocomplete_input_default_icon_name = "search";
const autocomplete_set_icon_class_name = "autocomplete_set_icon";
const form_input_spinner_class_name = "form_input_spinner";
const icon_name_attribute_name = "icon-name";
const autocomplete_type_attribute_name = "autocomplete-type";
const mob_autocomplete_model_content_class_name =
  "mob_autocomplete_model_content";

//first of all lets get location model
let mob_location_model = document.getElementById("mob_location_input");

//next we call addMobLocationModelAction to add all necessary actions for location input model and form inputs by creating an instance of it and save it
/**
 * an instance of addMobLocationModelAction
 * @param {addMobLocationModelAction} addMobLocationModelAction_obj
 */
var addMobLocationModelAction_obj;
if (mob_location_model) {
  addMobLocationModelAction_obj = new addMobLocationModelAction(
    mob_location_model
  );
}

/**
 * this function add all necessary actions to input location model and its locations
 * @param {HTMLElement} location_model
 */
function addMobLocationModelAction(location_model) {
  /**
   * this element is store the content of the model
   */
  let model_content = location_model.querySelector(".model_content_container");
  /**
   * this element holds all autocomplete items
   */
  let autocomplete_model_content = location_model.querySelector(
    ".mob_autocomplete_model_content"
  );

  /**
   * this element is the close button of model
   */
  let model_close_bnt = location_model.querySelector(
    ".autocomplete_model_close_bnt"
  );
  /**
   * this property store the title element of model
   */
  let model_title = location_model.querySelector(".model_title");
  /**
   * this element is the icon of input
   */
  let model_input_icon = location_model.querySelector(".autocomplete_set_icon");

  /**
   * this element is the input of the model
   */
  let model_input = location_model.querySelector(".model_input");

  /**
   * this element is the spinner of input
   */
  let input_spinner = model_content.querySelector(
    "." + form_input_spinner_class_name
  );

  /**
   * this property store selected form input
   */
  let selected_form_input;

  /**
   * this property store selected form input icon
   */
  let selected_form_input_icon;

  let autocomplete_type_array = [];
  let icon_name_array = [];

  /**
   * all inputs of forms
   */
  let form_input_containers = document.getElementsByClassName(
    "form_input_container"
  );
  for (let index = 0; index < form_input_containers.length; index++) {
    const element = form_input_containers[index];
    addFormInputAction(element);
  }

  this.addFormInputAction = addFormInputAction;
  /**
   * this function add form input necessary actions
   * @param {HTMLElement} form_input_container form input element
   */
  function addFormInputAction(form_input_container) {
    let form_input = form_input_container.querySelector(".form_input");
    let form_input_icon = form_input_container.querySelector(
      ".autocomplete_set_icon"
    );
    form_input.addEventListener("click", function () {
      let autocomplete_type = form_input.getAttribute(
        autocomplete_type_attribute_name
      );
      let icon_name = form_input.getAttribute(icon_name_attribute_name);

      if (autocomplete_type) {
        autocomplete_type_array = String(autocomplete_type).split(",");
      }

      if (icon_name) {
        icon_name_array = String(icon_name).split(",");
      }

      let title = form_input.getAttribute("model-title");
      model_title.innerText = title;

      model_input.placeholder = form_input.placeholder;

      selected_form_input = form_input;
      selected_form_input_icon = form_input_icon;

      showModel(location_model, model_content);
    });
  }
  model_input.addEventListener("input", function () {
    //because input has changed we have to change the icon to search and clear the value of input
    model_input_icon.innerText = autocomplete_input_default_icon_name;
    model_input.setAttribute("value", "");

    /**
     * value of the model input
     */
    let input_value = model_input.value;

    if (
      String(input_value).trim().length > 0 &&
      autocomplete_type_array.length > 0 &&
      icon_name_array.length > 0
    ) {
      input_spinner.classList.add("show");

      let request_urls = getRequestURLs(autocomplete_type_array, input_value);
      let fetch_object_array = createFetchObjects(
        autocomplete_type_array,
        icon_name_array
      );

      Promise.all(request_urls)
        // map array of responses into an array of response.json() to read their content
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        // all JSON answers are parsed: "results" is the array of them
        .then((results) => {
          input_spinner.classList.remove("show");
          let items = readAllResults(results, fetch_object_array);
          // console.log(items);
          FillAutocompleteItems(
            autocomplete_model_content,
            model_input,
            model_input_icon,
            items,
            function () {
              setInputsValue(
                model_input,
                model_input_icon,
                selected_form_input,
                selected_form_input_icon
              );
              closeAutocompleteModel(
                location_model,
                model_input,
                autocomplete_model_content,
                model_input_icon
              );
            }
          );
        })
        .catch(function (error) {
          console.error(error);
          input_spinner.classList.remove("show");
        });
    } else {
      autocomplete_model_content.innerHTML = null;
    }
  });
  //add close button click event
  model_close_bnt.addEventListener("click", function () {
    closeAutocompleteModel(
      location_model,
      model_input,
      autocomplete_model_content,
      model_input_icon
    );
  });
}

/**
 * This function remove all autocomplete shown items and clear the input
 * @param {HTMLElement} autocomplete_menu
 * @param {HTMLElement} model_input
 */
function clearAutocompleteModel(autocomplete_menu, model_input) {
  let child_count = autocomplete_menu.children.length;
  // console.log(child_count);
  for (let index = 0; index < child_count; index++) {
    autocomplete_menu.children[0].remove();
  }
  model_input.value = "";
  model_input.setAttribute("value", "");
}

/**
 * This function close the autocomplete model
 * @param {HTMLElement} mob_autocomplete_model
 * @param {HTMLElement} model_input
 * @param {HTMLElement} autocomplete_menu
 * @param {HTMLElement} model_input_icon
 */
function closeAutocompleteModel(
  mob_autocomplete_model,
  model_input,
  autocomplete_menu,
  model_input_icon
) {
  closeDropdownModel(mob_autocomplete_model);
  model_input_icon.innerText = autocomplete_input_default_icon_name;

  clearAutocompleteModel(autocomplete_menu, model_input);
}

/**
 * This function read value of item and set it to inputs and change the icon
 * @param {HTMLElement} model_input
 * @param {HTMLElement} model_input_icon
 * @param {HTMLElement} form_input
 * @param {HTMLElement} form_input_icon
 */
function setInputsValue(
  model_input,
  model_input_icon,
  form_input,
  form_input_icon
) {
  form_input.value = model_input.value;
  form_input.setAttribute("value", model_input.getAttribute("value"));
  form_input_icon.innerText = model_input_icon.innerText;
}

/**
 * This function show autocomplete model animation
 * @param {HTMLElement} model
 */
function showModel(model, model_content) {
  let body = document.querySelector("body");
  body.style.overflow = "hidden";
  model_content.style.opacity = "0";

  model.classList.add("show");
  let model_content_height = model.clientHeight;
  // console.log(model_content_height);
  model_content.style.opacity = null;
  let increase_size = model_content_height / 10;
  // console.log(increase_size);

  let height_temp = 0;

  function model_content_animation() {
    if (height_temp >= model_content_height) {
      model_content.style.height = null;
    } else if (height_temp < model_content_height) {
      height_temp += increase_size;
      model_content.style.height = height_temp + "px";
      requestAnimationFrame(model_content_animation);
    }
  }
  requestAnimationFrame(model_content_animation);
}

//#endregion

//#region passenger

var passenger_dropdows = document.getElementsByClassName(
  "mob_passenger_dropdown"
);
for (let index = 0; index < passenger_dropdows.length; index++) {
  const element = passenger_dropdows[index];
  addPassengerActions(element);
}
/**
 *
 * @param {HTMLElement} element
 */
function addPassengerActions(element) {
  let passenger_toggle_btn = element.querySelector(".form-dropdown-btn");

  let model = element.querySelector("." + mob_dropdown_model_class_name);
  let model_content = element.querySelector(
    "." + mob_dropdown_model_content_class_name
  );

  let close_bnt = model.querySelector(".mob_passenger_dropdown_close_btn");

  let passenger_items = element.querySelectorAll(".passenger_item");

  //update the value of passenger
  let passenger_value_holder = element.querySelector(
    ".passenger_dropdown_set_text"
  );
  let passenger_number = 0;

  for (let index = 0; index < passenger_items.length; index++) {
    const item = passenger_items[index];
    addPassengerItemActions(item);
  }

  /**
   *
   * @param {HTMLElement} item
   */
  function addPassengerItemActions(item) {
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
  close_bnt.addEventListener("click", function () {
    closeDropdownModel(model);
  });
  passenger_toggle_btn.addEventListener("click", function () {
    showDropdownModel(model, model_content);
  });
}
function setPassengerValue(value_holder, value) {
  value_holder.innerText = value;
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

const multi_city_for_row_html = multi_city_form_row_container.innerHTML;

MultiCityFromCloseBtnAction(multi_city_form_row_container.children[0]);
multi_city_add_btn.addEventListener("click", function () {
  multi_city_count++;
  let new_city_form = document.createElement("DIV");
  new_city_form.innerHTML = multi_city_for_row_html;

  let temp_height = 0;
  new_city_form.style.height = "0";
  new_city_form.style.overflow = "hidden";
  multi_city_form_row_container.appendChild(new_city_form);
  let height = new_city_form.children[0].clientHeight;

  // console.log(height);
  let increase_size = height / 10;
  // console.log(increase_size);

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
  requestAnimationFrame(animationDisplay);

  let flight_counter = new_city_form.querySelector(".flight_counter");
  flight_counter.innerText = "Flight " + Number(multi_city_count);

  //add close action to new city form
  MultiCityFromCloseBtnAction(new_city_form);
  EnableAllDisabledMultiCityCloseBnt();

  let form_input_containers = new_city_form.querySelectorAll(
    ".form_input_container"
  );
  for (let index = 0; index < form_input_containers.length; index++) {
    const element = form_input_containers[index];
    addMobLocationModelAction_obj.addFormInputAction(element);
  }

  addMobTransferActions(new_city_form.querySelector(".mob_transfer"));

  let mob_cal_input_container = new_city_form.querySelector(
    ".calendar_dropdown_toggle_bnt"
  );
  addMobileCalendarActions_obj.addNoneRangeCalendarInputsAction(
    mob_cal_input_container
  );

  if (multi_city_count == 5) {
    multi_city_add_btn.setAttribute("disabled", true);
  }
});

function MultiCityFromCloseBtnAction(param_city_form_row) {
  let multi_city_form_close_btn = param_city_form_row.querySelector(
    ".multi_city_form_close_btn"
  );
  multi_city_form_close_btn.addEventListener("click", function () {
    multi_city_form_close_btn.setAttribute("disabled", "true");
    param_city_form_row.style.overflow = "hidden";
    let temp_height = param_city_form_row.clientHeight;
    multi_city_count -= 1;
    DisableLastMultiCityCloseBnt();
    // console.log(param_city_form_row);
    // console.log(temp_height);

    let decrease_size = temp_height / 10;
    // console.log(decrease_size);

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
    requestAnimationFrame(animationDisplay);
  });
}

function DisableLastMultiCityCloseBnt() {
  if (multi_city_count == 1) {
    let multi_city_form_close_btn = multi_city_form_row_container.querySelectorAll(
      ".multi_city_form_close_btn"
    );
    // console.log(multi_city_form_close_btn);

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
function updateFlightCount() {
  let flight_counters = multi_city_form_row_container.querySelectorAll(
    ".flight_counter"
  );
  for (let index = 0; index < flight_counters.length; index++) {
    const element = flight_counters[index];
    element.innerText = "Flight " + Number(index + 1);
  }
}
//#endregion

document.addEventListener("click", function (ev) {
  /*
  in dropdown model if first child of 'mob_dropdown_model' clicked that's means the ev.path[0] element is clicked and ev.path[1] is it's parent that's mean 'mob_dropdown_model'
  we want just when the first child of 'mob_dropdown_model' clicked then model hide
  */
  // console.log(ev.path[1]);
  // console.log(ev.composedPath()[1]);
  if (ev.composedPath()[1]) {
    const element = ev.composedPath()[1];
    if (element.classList.contains(mob_dropdown_model_class_name)) {
      closeDropdownModel(element);
    }
  }
});
