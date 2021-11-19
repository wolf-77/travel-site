let date = new Date();
module.exports = {
  tripHome_context: {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    guest_dropdown_context: {
      dropdown_toggle_btn_name: "2 guests",
      mob_dropdown_icon_name: "person_outline",
      dropdown_set_text_type: "dropdown_set_text_from_value",
      default_text: "2",
      name: "adults",
      value: "2",
      dropdown_items: [
        {
          item: "1 guest",
          value: "1",
        },
        {
          item: "2 guests",
          value: "2",
          selected_item_class: "form-dropdown-item-selected",
        },
        {
          item: "3 guests",
          value: "3",
        },
        {
          item: "4 guests",
          value: "4",
        },
        {
          item: "5 guests",
          value: "5",
        },
      ],
    },
    flight_dropdown_context: {
      dropdown_toggle_btn_name: "Round trip",
      dropdown_set_text_type: "dropdown_set_text",
      default_text: "Round trip",
      name: "one_way",
      value: "0",
      ignore_attr: "ignore",
      dropdown_items: [
        {
          item: "one-way",
          value: "1",
          id: "flight_one_way_mode_btn",
        },
        {
          item: "Round-trip",
          value: "0",
          selected_item_class: "form-dropdown-item-selected",
          id: "flight_round_trip_mode_btn",
        },
        {
          item: "multi-city",
          value: "",
          id: "flight_multi_city_mode_btn",
        },
      ],
    },
    flight_class_dropdown_context: {
      dropdown_toggle_btn_name: "Economy",
      dropdown_set_text_type: "dropdown_set_text",
      default_text: "Economy",
      name: "trip_class",
      value: "0",
      dropdown_items: [
        {
          item: "Economy",
          value: "0",
          selected_item_class: "form-dropdown-item-selected",
        },
        {
          item: "Business",
          value: "1",
        },
      ],
    },
    passenger_dropdown_context: {
      dropdown_toggle_btn_name: "1 passenger",
      dropdown_toggle_btn_value: "1",
      items: [
        {
          item_name: "Adults",
          detail: "Aged +12",
          min_value: "1",
          item_value: "1",
          name: "adults",
        },
        {
          item_name: "Children",
          detail: "Aged 2-12",
          min_value: "0",
          item_value: "0",
          name: "children",
        },
        {
          item_name: "Infants",
          detail: "Aged under 2",
          min_value: "0",
          item_value: "0",
          name: "infants",
        },
      ],
    },
    billboard_context: {
      billboard: [
        {
          city_name: "dubai",
          billboard_name: "Dubai",
          img_name: "https://source.unsplash.com/rpopW8c1yqo/488x252",
        },
        {
          city_name: "istanbul",
          billboard_name: "Istanbul",
          img_name: "https://source.unsplash.com/Pb-0TawZ9qU/488x252",
        },
        {
          city_name: "barcelona",
          billboard_name: "Barcelona",
          img_name: "https://source.unsplash.com/ZlcMun4LpCA/488x252",
        },
        {
          city_name: "amsterdam",
          billboard_name: "Amsterdam",
          img_name: "https://source.unsplash.com/qi3UpY6uFAQ/488x252",
        },
        {
          city_name: "antalya",
          billboard_name: "Antalya",
          img_name: "https://source.unsplash.com/utxoRRvZOkI/488x252",
        },
        {
          city_name: "bangkok",
          billboard_name: "Bangkok",
          img_name: "https://source.unsplash.com/B64B6-kAWlw/488x252",
        },
      ],
    },
    footer_context: {
      items: [
        {
          link: "/feedback",
          name: "Send feedback",
        },
        {
          link: "/about_us",
          name: "About us",
        },
        {
          link: "/contact_us",
          name: "Contact us",
        },
      ],
    },
    hotel_input_context: {
      input_icon: "search",
      name: "destination",
      place_holder: "Enter destination or hotel",
      autocomplete_type: "city,hotel",
      location_icon: "location_on,hotel",
      model_title: "Destination",
    },
    car_same_location_input_context: {
      input_icon: "trip_origin",
      place_holder: "Pick-up location?",
      autocomplete_type: "airport",
      location_icon: "flight",
      name: "pickup_location",
      model_title: "Destination",
    },
    car_dualLocationInput_context: {
      flight_left_input_context: {
        input_icon: "trip_origin",
        place_holder: "Pick-up location?",
        input_class: "right-radius-0",
        autocomplete_type: "airport",
        location_icon: "flight",
        name: "pickup_location",
        model_title: "Pick-up location",
      },
      flight_right_input_context: {
        input_icon: "location_on",
        place_holder: "Drop off location?",
        input_class: "left-radius-0",
        autocomplete_type: "airport",
        location_icon: "flight",
        name: "dropoff_location",
        model_title: "Drop off location",
      },
    },
    flight_dualLocationInput_context: {
      flight_left_input_context: {
        input_icon: "trip_origin",
        place_holder: "From where?",
        input_class: "right-radius-0",
        autocomplete_type: "airport,city",
        location_icon: "flight,location_on",
        name: "origin_iata",
        model_title: "Departure location",
      },
      flight_right_input_context: {
        input_icon: "location_on",
        place_holder: "To where?",
        input_class: "left-radius-0",
        autocomplete_type: "airport,city",
        location_icon: "flight,location_on",
        name: "destination_iata",
        model_title: "Return location",
      },
    },
    hotel_dual_calendar_context: {
      day_limit_attr: true,
      first_day_selector_placeholder: "Check-in date",
      second_day_selector_placeholder: "Check-out date",
      first_input_invalid_text: "Please specify check-in date",
      second_input_invalid_text: "Please specify check-out date",
      first_name: "check_in",
      second_name: "check_out",
      model_title: "Choose date",
    },
    flight_dual_calendar_context: {
      day_limit_attr: false,
      first_day_selector_placeholder: "Departure date",
      second_day_selector_placeholder: "Return date",
      first_input_invalid_text: "Please specify departure date",
      second_input_invalid_text: "Please specify return date",
      first_name: "depart_date",
      second_name: "return_date",
      model_title: "Choose date",
    },
    car_dual_calendar_context: {
      day_limit_attr: true,
      first_day_selector_placeholder: "Pick-up date",
      second_day_selector_placeholder: "Drop-off date",
      first_input_invalid_text: "Please specify pick-up date",
      second_input_invalid_text: "Please specify drop-off date",
    },
    mob_navigation_context: {
      items: [
        {
          name: "Hotels",
          id: "hotel_tab",
          selected_class: "mob-nav-item-selected",
        },
        {
          name: "Flights",
          id: "flight_tab",
        },
        {
          name: "Cars",
          id: "car_tab",
        },
      ],
    },
  },
};
