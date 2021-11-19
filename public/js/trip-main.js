const require_message_div = document.getElementById("require_message");
var require_message_timeout = null;

//#region simple selective dropdown

const dropdown_set_value_class_name = "dropdown_set_value";
const dropdown_get_value_class_name = "dropdown_get_value";
const dropdown_set_text_class_name = "dropdown_set_text";
const dropdown_set_text_from_value_class_name = "dropdown_set_text_from_value";
const dropdown_get_text_class_name = "dropdown_get_text";
const dropdown_selected_item_class_name = "form-dropdown-item-selected";

/*
==========instruction of adding class names to HTMLElements==========

'dropdown_set_value' and 'dropdown_get_value' class names should add to button elements.

'dropdown_set_text', 'dropdown_set_value_as_text' and 'dropdown_get_text' should add to button elements or child nodes of button elements.

*/

/**
 * This function return element that has the given class name. First watches the element classList second it's children's classList
 * @param {HTMLElement} element
 * @param {String} class_name
 * @returns {HTMLElement}
 */
function getTextElement(element, class_name) {
  let text_element = null;
  if (element.classList.contains(class_name)) {
    text_element = element;
  } else {
    let get_text = element.querySelector("." + class_name);
    if (get_text) {
      text_element = get_text;
    }
  }
  return text_element;
}

/**
 * This function update dropdown toggle button's text and value when any of items clicked and add selected item class name to the item that clicked.
 * @param {HTMLElement} btn
 * @param {NodeListOf <HTMLElement>} items
 * @param {HTMLElement} selected_item
 */
function SetDropdownToggleBntValueAndText(btn, items, selected_item) {
  let get_value_element;
  if (btn.classList.contains(dropdown_set_value_class_name)) {
    get_value_element = btn;
  }

  let set_text_element = getTextElement(btn, dropdown_set_text_class_name);

  let get_text_from_value = getTextElement(
    btn,
    dropdown_set_text_from_value_class_name
  );

  let selected_item_temp = selected_item;

  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    element.addEventListener("click", function () {
      if (element.classList.contains(dropdown_get_value_class_name)) {
        if (get_value_element) {
          get_value_element.setAttribute(
            "value",
            element.getAttribute("value")
          );
        }

        if (get_text_from_value) {
          get_text_from_value.innerText = element.getAttribute("value");
        }

        if (set_text_element) {
          let item_get_text_element = getTextElement(
            element,
            dropdown_get_text_class_name
          );
          if (item_get_text_element) {
            set_text_element.innerText = item_get_text_element.innerText;
          }
        }

        if (selected_item_temp) {
          selected_item_temp.classList.remove(
            dropdown_selected_item_class_name
          );
        }
        selected_item_temp = element;
        element.classList.add(dropdown_selected_item_class_name);
      }
    });
  }
}

//#endregion

//#region autocomplete

const hotelook_autocomplete_type = "hotellook";
const travelpayout_autocomplete_type = "travelpayout";
/**
 * This function create nad return request urls array
 * @param {String[]} autocomplete_type_array
 * @param {String} input_value
 * @returns {Promise<Response>[]}
 */
function getRequestURLs(autocomplete_type_array, input_value) {
  let request_url = [];
  for (let index = 0; index < autocomplete_type_array.length; index++) {
    const element = autocomplete_type_array[index];
    if (element == "hotel") {
      request_url.push(
        fetch(
          `https://engine.hotellook.com/api/v2/lookup.json?query=${input_value}&lang=en&lookFor=hotel&limit=5`
        )
      );
    } else {
      request_url.push(
        fetch(
          `https://autocomplete.travelpayouts.com/places2?term=${input_value}&locale=en&types[]=${element}`
        )
      );
    }
  }

  return request_url;
}
/**
 * @typedef {Object} fetch_object
 * @property {String} type
 * @property {String} icon
 */
/**
 * This function create and return fetch object array
 * @param {String[]} autocomplete_type_array
 * @param {String[]} icon_name_array
 * @returns {fetch_object}
 */
function createFetchObjects(autocomplete_type_array, icon_name_array) {
  let fetch_objects = [];
  for (let index = 0; index < autocomplete_type_array.length; index++) {
    const element = autocomplete_type_array[index];
    if (element == "hotel") {
      fetch_objects.push({
        type: hotelook_autocomplete_type,
        icon: icon_name_array[index],
      });
    } else {
      fetch_objects.push({
        type: travelpayout_autocomplete_type,
        icon: icon_name_array[index],
      });
    }
  }
  return fetch_objects;
}

/**
 * @typedef {Object} autocomplete_item_data
 * @property {String} name
 * @property {String} country
 * @property {String} code iata_code
 * @property {String} icon
 */
/**
 * This function read all fetch results and return the data
 * @param {*} results result of fetch
 * @param {fetch_object[]} fetch_object_array
 * @returns {autocomplete_item_data[]}
 */
function readAllResults(results, fetch_object_array) {
  // console.log(results);
  let items = [];
  for (let index = 0; index < results.length; index++) {
    const element = results[index];
    if (fetch_object_array[index].type == hotelook_autocomplete_type) {
      items = items.concat(
        readHotellookResult(element, fetch_object_array[index].icon)
      );
    } else {
      items = items.concat(
        readTravelpayoutResult(element, fetch_object_array[index].icon)
      );
    }
  }
  return items;
}

/**
 * This function read hotellook api fetch result and return the the data
 * @param {*} result result of fetch
 * @param {String} icon_name
 * @returns {autocomplete_item_data[]}
 */
function readHotellookResult(result, icon_name) {
  let hotels = result.results.hotels;
  let hotel_obj_array = [];
  for (let index = 0; index < hotels.length; index++) {
    const element = hotels[index];
    hotel_obj_array.push({
      name: String(element.label).split(",")[0],
      country: element.locationName,
      code: element.fullName,
      icon: icon_name,
    });
  }
  return hotel_obj_array;
}

/**
 * This function read travelpayout api fetch result and return the the data
 * @param {*} result result of fetch
 * @param {String} icon_name
 * @returns {autocomplete_item_data[]}
 */
function readTravelpayoutResult(result, icon_name) {
  let travel_obj_array = [];
  for (let index = 0; index < result.length && index < 5; index++) {
    const element = result[index];
    travel_obj_array.push({
      name: element.name,
      country: element.country_name,
      code: element.code,
      icon: icon_name,
    });
  }
  return travel_obj_array;
}
/**
 *
 * @param {HTMLElement} autocomplete_dropdown_menu
 * @param {HTMLElement} autocomplete_input_box
 * @param {HTMLElement} autocomplete_input_icon
 * @param {NodeListOf<Element>} items
 * @param {CallableFunction} callback
 */
function FillAutocompleteItems(
  autocomplete_dropdown_menu,
  autocomplete_input_box,
  autocomplete_input_icon,
  items,
  callback
) {
  // -----------------item template------------------------

  // <button class="btn form-autocomplete-dropdown-item autocomplete_dropdown_item">
  //   <div class="align-item-center d-flex">
  //     <span class="material-icons blue-color mr-3 autocomplete_get_icon">{{ location_icon }}</span>
  //     <div>
  //       <span class="autocomplete_get_text">Abu Dhabi</span>
  //       <span class="form-autocomplete-detail-text autocomplete_get_detail_text">
  //         United Arab Emirates
  //       </span>
  //     </div>
  //   </div>
  // </button>;

  let autocomplete_dropdown_items = autocomplete_dropdown_menu.querySelectorAll(
    ".autocomplete_dropdown_item"
  );

  for (
    let index = 0;
    index < Math.min(autocomplete_dropdown_items.length, items.length);
    index++
  ) {
    const element = autocomplete_dropdown_items[index];
    const item = items[index];
    element.children[0].classList.remove("form-dropdown-item-selected");
    let autocomplete_get_text = element.querySelector(".autocomplete_get_text");
    let autocomplete_get_detail_text = element.querySelector(
      ".autocomplete_get_detail_text"
    );
    let icon = element.querySelector(".material-icons");
    if (autocomplete_get_text) {
      autocomplete_get_text.innerText = item.name;
      autocomplete_get_text.setAttribute("code", item.code);
    }
    if (autocomplete_get_detail_text) {
      autocomplete_get_detail_text.innerText = item.country;
    }
    if (icon) {
      icon.innerText = item.icon;
    }
  }
  if (autocomplete_dropdown_items.length > items.length) {
    for (
      let index = items.length;
      index < autocomplete_dropdown_items.length;
      index++
    ) {
      const element = autocomplete_dropdown_items[index];
      element.remove();
    }
    if (items.length > 0) {
      autocomplete_dropdown_items[items.length - 1].classList.remove(
        "border-bottom"
      );
    }
  } else if (autocomplete_dropdown_items.length < items.length) {
    if (autocomplete_dropdown_items.length > 0) {
      autocomplete_dropdown_items[
        autocomplete_dropdown_items.length - 1
      ].classList.add("border-bottom");
    }
    for (
      let index = autocomplete_dropdown_items.length;
      index < items.length;
      index++
    ) {
      const item = items[index];
      const parent_div = document.createElement("DIV");
      parent_div.classList.add("border-bottom");
      parent_div.classList.add("autocomplete_dropdown_item");
      const element = document.createElement("BUTTON");
      element.classList.add("btn");
      element.classList.add("form-autocomplete-dropdown-item");
      // element.classList.add("autocomplete_dropdown_item");
      let div1 = document.createElement("DIV");
      div1.classList.add("align-item-center");
      div1.classList.add("d-flex");
      let icon_span = document.createElement("SPAN");
      icon_span.classList.add("material-icons");
      icon_span.classList.add("blue-color");
      icon_span.classList.add("mr-3");
      icon_span.classList.add("autocomplete_get_icon");
      icon_span.style.fontSize = "20px";
      icon_span.innerText = item.icon;
      div1.appendChild(icon_span);
      let div2 = document.createElement("DIV");
      let autocomplete_get_text = document.createElement("SPAN");
      autocomplete_get_text.classList.add("autocomplete_get_text");
      autocomplete_get_text.innerText = item.name;
      autocomplete_get_text.setAttribute("code", item.code);
      div2.appendChild(autocomplete_get_text);
      let autocomplete_get_detail_text = document.createElement("SPAN");
      autocomplete_get_detail_text.classList.add(
        "form-autocomplete-detail-text"
      );
      autocomplete_get_detail_text.classList.add(
        "autocomplete_get_detail_text"
      );
      autocomplete_get_detail_text.innerText = item.country;
      div2.appendChild(autocomplete_get_detail_text);
      div1.appendChild(div2);
      element.appendChild(div1);
      parent_div.appendChild(element);

      autocomplete_dropdown_menu.appendChild(parent_div);
      parent_div.addEventListener("click", function () {
        autocomplete_input_box.value = autocomplete_get_text.innerText;
        autocomplete_input_box.setAttribute(
          "value",
          autocomplete_get_text.getAttribute("code")
        );
        autocomplete_input_icon.innerText = icon_span.innerText;
        let selected_item = autocomplete_dropdown_menu.querySelector(
          ".form-dropdown-item-selected"
        );
        if (selected_item) {
          selected_item.classList.remove("form-dropdown-item-selected");
        }
        element.classList.add("form-dropdown-item-selected");

        //callback
        if (callback) {
          callback();
        }
      });
    }
    autocomplete_dropdown_menu.children[items.length - 1].classList.remove(
      "border-bottom"
    );
  }
}
//#endregion

//#region submit form
const custom_form_class_name = "custom_form";
const non_submit_form_class_name = "non_submit_form";
const submit_form_class_name = "submit_form";
const complex_submit_form_class_name = "complex_submit_form";
const blank_attribute_name = "blank";
const complex_form_row_class_name = "complex_form_row";
let custom_forms = document.getElementsByClassName(custom_form_class_name);
for (let index = 0; index < custom_forms.length; index++) {
  const element = custom_forms[index];
  addCustomFormActions(element);
}
function addCustomFormActions(custom_form) {
  // (custom form => the element that we give it 'custom_form' class name)

  //first we have to create base URL
  let base_url = generateBaseURL(custom_form);

  //if you want to open the generated link in another tab,just add blank attribute to the custom form
  let is_blank = checkForBlank(custom_form);

  /*
  we have three sub form
  first 'non_submit_form' => these forms does not have any submit button
  so at first we read all element that have 'name' and 'value' attribute inside all onsubmit forms and concat to base url.
  note => in non submit forms we never check for validations 

  second 'submit_form' => these form have one submit form so when submit button clicked first we check for validation and
  then we read all element 'name' and 'value' attribute just inside the submit form and concat to base url and open the generated URL.

  third 'complex_submit_form' => these form have one submit form so when submit button clicked first we check for validation and
  then we read all element 'name' and 'value' attributes in all 'complex_form_row' and concat all of them and concat to base url and open the generated URL.
  */

  let submit_forms = custom_form.querySelectorAll("." + submit_form_class_name);
  let complex_submit_form = custom_form.querySelectorAll(
    "." + complex_submit_form_class_name
  );
  for (let index = 0; index < submit_forms.length; index++) {
    const element = submit_forms[index];
    addSubmitAction(custom_form, element, base_url, is_blank);
  }
  for (let index = 0; index < complex_submit_form.length; index++) {
    const element = complex_submit_form[index];
    addComplexSubmitAction(custom_form, element, base_url, is_blank);
  }
}
function generateBaseURL(custom_form) {
  let base_url = new URL(window.location.href);
  if (custom_form.hasAttribute("action")) {
    let action_url = custom_form.getAttribute("action");
    let url = new URL(action_url, base_url);
    base_url = url;
  }
  base_url += "?";
  return base_url;
}
function checkForBlank(custom_form) {
  if (custom_form.hasAttribute(blank_attribute_name)) {
    is_blank = true;
  } else {
    return false;
  }
}
function readAllNonSubmitFormNamesValues(custom_form) {
  let non_submit_forms = custom_form.querySelectorAll(
    "." + non_submit_form_class_name
  );
  let name_values = [];
  for (let index = 0; index < non_submit_forms.length; index++) {
    const element = non_submit_forms[index];
    name_values = name_values.concat(readNamesAndValues(element));
  }
  return name_values;
}
function readNamesAndValues(form) {
  let name_value = [];
  let names = form.querySelectorAll("[name]");
  for (let index = 0; index < names.length; index++) {
    const element = names[index];
    let can_push = true;
    if (element.hasAttribute("ignore")) {
      if (!element.hasAttribute("value")) {
        can_push = false;
      } else {
        if (String(element.getAttribute("value")).trim().length == 0) {
          can_push = false;
        }
      }
    }
    if (can_push == true) {
      let element_name = element.getAttribute("name");
      let element_value = "";
      if (element.hasAttribute("value")) {
        element_value = element.getAttribute("value");
      }
      let name_value_obj = {
        name: element_name,
        value: element_value,
      };
      name_value.push(name_value_obj);
    }
  }
  return name_value;
}
function concatNameValue(name_values, base_url) {
  let concat_url = base_url;
  for (let index = 0; index < name_values.length; index++) {
    const element = name_values[index];
    concat_url += element.name + "=" + element.value + "&";
  }
  return concat_url;
}
function openURL(url, is_blank) {
  if (url[url.length - 1] == "&") {
    url = String(url).substring(0, url.length - 1);
  }
  if (is_blank === true) {
    window.open(url, "_blank");
  } else {
    window.open(url);
  }
}
function addSubmitAction(custom_form, submit_form, base_url, is_blank) {
  let submit_button = submit_form.querySelector("[type='submit']");
  if (submit_button) {
    submit_button.addEventListener("click", function () {
      let valid = checkForValidation(submit_form);
      if (valid === true) {
        let name_values = readAllNonSubmitFormNamesValues(custom_form);
        name_values = name_values.concat(readNamesAndValues(submit_form));
        let url = concatNameValue(name_values, base_url);
        openURL(url, is_blank);
      }
    });
  }
}
function addComplexSubmitAction(
  custom_form,
  complex_submit_form,
  base_url,
  is_blank
) {
  let submit_button = complex_submit_form.querySelector("[type='submit']");
  if (submit_button) {
    submit_button.addEventListener("click", function () {
      let valid = checkForValidation(complex_submit_form);
      if (valid === true) {
        let name_values = readAllNonSubmitFormNamesValues(custom_form);
        let url = concatNameValue(name_values, base_url);
        url += getComplexFormRowsURL(complex_submit_form);
        openURL(url, is_blank);
      }
    });
  }
}
function getComplexFormRowsURL(complex_submit_form) {
  let complex_form_rows = complex_submit_form.querySelectorAll(
    "." + complex_form_row_class_name
  );
  let url = "";
  for (let index = 0; index < complex_form_rows.length; index++) {
    const element = complex_form_rows[index];
    let name_values = readNamesAndValues(element);
    url += concatComplexNameAndValues(name_values, index);
  }
  return url;
}
function concatComplexNameAndValues(name_values, counter) {
  let url = "";
  for (let index = 0; index < name_values.length; index++) {
    const element = name_values[index];
    url +=
      `segments[${counter}]` + `[${element.name}]` + "=" + element.value + "&";
  }
  return url;
}
function checkForValidation(submit_form) {
  let inputs = submit_form.querySelectorAll("input[name]");
  for (let index = 0; index < inputs.length; index++) {
    const element = inputs[index];
    // console.log(element);

    if (element.hasAttribute("value")) {
      let input_value = element.getAttribute("value");
      if (input_value == "") {
        raiseRequireMessage(element);
        return false;
      }
    } else {
      raiseRequireMessage(element);
      return false;
    }
  }
  return true;
}
/**
 * This function show invalid message under the element
 * @param {HTMLElement} input
 */
function raiseRequireMessage(input) {
  // console.log(input);
  if (input.hasAttribute("invalid-title")) {
    require_message_div.innerText = input.getAttribute("invalid-title");
  } else {
    require_message_div.innerText = "Please fill out this field.";
  }
  // console.log(require_message_div);

  require_message_div.style.maxWidth = input.clientWidth + "px";
  let top =
    input.getBoundingClientRect().y + window.scrollY + input.clientHeight + 10;
  let left = input.getBoundingClientRect().x + window.scrollX;

  // console.log(top);
  // console.log(left);

  require_message_div.style.top = top + "px";
  require_message_div.style.left = left + "px";

  // console.log(
  //   input.getBoundingClientRect().y + window.scrollY + input.clientHeight + 10
  // );
  // console.log(input.getBoundingClientRect().x + window.scrollX);

  // $(document).ready(function () {
  //   $(require_message_div).hide();
  //   $(require_message_div).fadeIn();
  // });

  require_message_div.classList.add("show");

  if (require_message_timeout) {
    clearTimeout(require_message_timeout);
  }
  require_message_timeout = setTimeout(function () {
    // require_message_div.style.display = "none";
    require_message_div.classList.remove("show");
  }, 4000);
}

//#endregion

document.addEventListener("click", function (ev) {
  if (
    ev.target !== require_message_div &&
    !ev.target.matches(".mob-form-button") &&
    !ev.target.matches(".form-button") &&
    !ev.target.matches(".mob_model_confirm_btn") &&
    !ev.target.matches(".fa-check")
  ) {
    require_message_div.classList.remove("show");
  }
});
//#region car rental location input change
var different_location_input_container = document.getElementById(
  "different_location_input_container"
);
var same_location_input_container = document.getElementById(
  "same_location_input_container"
);
var location_type_checkbox = document.getElementById("location_type_checkbox");

location_type_checkbox.addEventListener("change", function () {
  if (location_type_checkbox.checked) {
    same_location_input_container.classList.add("d-none");
    different_location_input_container.classList.remove("d-none");
  } else {
    same_location_input_container.classList.remove("d-none");
    different_location_input_container.classList.add("d-none");
  }
});
//#endregion
//#region flight mode tab
var flight_one_way_mode_btn = document.getElementById(
  "flight_one_way_mode_btn"
);
var flight_round_trip_mode_btn = document.getElementById(
  "flight_round_trip_mode_btn"
);
var flight_multi_city_mode_btn = document.getElementById(
  "flight_multi_city_mode_btn"
);
var none_multi_city_form_container = document.getElementById(
  "none_multi_city_form_container"
);
var multi_city_form_container = document.getElementById(
  "multi_city_form_container"
);
var form_round_trip_input_container = document.getElementById(
  "form_round_trip_input_container"
);
var form_one_way_input_container = document.getElementById(
  "form_one_way_input_container"
);

flight_one_way_mode_btn.addEventListener("click", function () {
  multi_city_form_container.classList.add("d-none");
  none_multi_city_form_container.classList.remove("d-none");
  form_round_trip_input_container.classList.add("d-none");
  form_one_way_input_container.classList.remove("d-none");
});

flight_round_trip_mode_btn.addEventListener("click", function () {
  multi_city_form_container.classList.add("d-none");
  none_multi_city_form_container.classList.remove("d-none");
  form_round_trip_input_container.classList.remove("d-none");
  form_one_way_input_container.classList.add("d-none");
});

flight_multi_city_mode_btn.addEventListener("click", function () {
  multi_city_form_container.classList.remove("d-none");
  none_multi_city_form_container.classList.add("d-none");
});
//#endregion
