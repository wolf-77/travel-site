// express app
// you should have installed node js first and install express.js globally
// install commands in (install and usage.txt)
// if you want to see html files change .hbs to .html
const port = process.env.PORT || 3000;
const affiliate_key = 'key';
const key = 'key';
const hbs = require("hbs");
const device = require("express-device");
const helmet = require("helmet");
const request = require("request");
let path = require("path");
let express = require("express");
let url = require("url");
let bodyParser = require("body-parser");
var compression = require("compression");
//load external js files
let template_context = require("../server/template_context");

let app = express();

// body parser for read data comes from post request
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const viewsPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates");

//device detection
app.use(device.capture());
app.use(compression());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'", "'unsafe-inline'", "ajax.googleapis.com", "code.jquery.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "stackpath.bootstrapcdn.com",
       "use.fontawesome.com", "fonts.googleapis.com", "fonts.gstatic.com", "autocomplete.travelpayouts.com", "engine.hotellook.com", "www.googletagmanager.com", "www.google-analytics.com"],
      "img-src": ["'self'", "data:", "source.unsplash.com", "images.unsplash.com", "www.google-analytics.com"],
      "connect-src": ["'self'", "autocomplete.travelpayouts.com", "engine.hotellook.com", "source.unsplash.com", "images.unsplash.com", "www.google-analytics.com"]
    }
  })
);
app.use(express.static(viewsPath));

app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

// main page (home)
app.get("/", function (req, res) {
  let device = req.device.type.toUpperCase();
  console.log(device);
  if (device == "PHONE") {
    res.render("mob_TripHome", template_context.tripHome_context);
  } else {
    res.render("TripHome", template_context.tripHome_context);
  }
});

// hotel search
app.get("/hotel?", function (req, res) {
  let hotel_query = url.parse(req.url, true);
  let hotel_obj = JSON.parse(JSON.stringify(hotel_query.query));
  console.log(hotel_obj);
  let hotel_result_link = `https://search.hotellook.com/hotels?destination=${hotel_obj.destination}&checkIn=${hotel_obj.check_in}&checkOut=${hotel_obj.check_out}&adults=${hotel_obj.adults}&locale=en&currency=usd&marker=${affiliate_key}`;
  console.log(hotel_result_link);
  res.redirect(hotel_result_link);
});

// flight search
app.get("/flight?", function (req, res) {
  let flight_query = url.parse(req.url, true);
  let fligth_obj = JSON.parse(JSON.stringify(flight_query.query));
  let return_date;

  console.log(fligth_obj);

  if (fligth_obj.one_way == 1) {
    // one way flight link generator
    let flight_result_link = `https://jetradar.com/searches/new?origin_iata=${fligth_obj.origin_iata}&destination_iata=${fligth_obj.destination_iata}&adults=${fligth_obj.adults}&children=${fligth_obj.children}&infants=${fligth_obj.infants}&trip_class=${fligth_obj.trip_class}&depart_date=${fligth_obj.depart_date}&with_request=true`;
    flight_result_link += `&marker=${affiliate_key}`;
    console.log(flight_result_link);
    res.redirect(flight_result_link);
  } else if (fligth_obj.one_way == 0) {
    // round trip flight link generator
    return_date = fligth_obj.return_date;
    let flight_result_link = `https://jetradar.com/searches/new?origin_iata=${fligth_obj.origin_iata}&destination_iata=${fligth_obj.destination_iata}&adults=${fligth_obj.adults}&children=${fligth_obj.children}&infants=${fligth_obj.infants}&trip_class=${fligth_obj.trip_class}&depart_date=${fligth_obj.depart_date}&return_date=${return_date}&with_request=true`;
    flight_result_link += `&marker=${affiliate_key}`;
    console.log(flight_result_link);
    res.redirect(flight_result_link);
  } else {
    // multi flight link generator
    let flight_array = Object.entries(fligth_obj);

    let passenger_info = flight_array.splice(0, 4);

    let multi_flight_link = `https://aviasales.com/search?`;

    flight_array.forEach(([key, value]) => {
      let _item = `${key}=${value}&`;
      multi_flight_link += _item;
    });

    passenger_info.forEach(([key, value]) => {
      let _item = `${key}=${value}&`;
      multi_flight_link += _item;
    });

    multi_flight_link += "with_request=true&";
    multi_flight_link += `marker=${affiliate_key}`;

    console.log(multi_flight_link);

    res.redirect(multi_flight_link);
  }
});

// car rental
app.get("/car?", function (req, res) {
  let affiliate_link = `https://tp.media/r?marker=${affiliate_key}&p=2018&u=`;
  let car_query = url.parse(req.url, true);
  let car_obj = JSON.parse(JSON.stringify(car_query.query));
  let car_result_link;
  console.log(car_obj);

  if (car_obj.dropoff_location == undefined) {
    car_result_link = `${affiliate_link}https://www.economybookings.com/en?idpickval=${car_obj.pickup_location}`;
    console.log(car_result_link);
    res.redirect(car_result_link);
  } else {
    car_result_link = `${affiliate_link}https://www.economybookings.com/en?idpickval=${car_obj.pickup_location}&iddropval=${car_obj.dropoff_location}`;
    console.log(car_result_link);
    res.redirect(car_result_link);
  }
});

// information page(about us page)
app.get("/about_us", function (req, res) {
  res.render("about");
});

// contact page
app.get("/contact_us", function (req, res) {
  res.render("contact");
});

// feedback Routing functions for website
app.get("/feedback", function (req, res) {
  res.render("feedback");
});

// Join us Routing
app.get("/joinus", function (req, res) {
  res.render("joinus");
});
app.post("/add_me", urlencodedParser, function (req, res) {
  let user_email_phone;
  let mobile_or_email;
  if (req.body.user_email === undefined) {
    user_email_phone = req.body.user_mobile;
    mobile_or_email = "mobile";
  } else if (req.body.user_mobile === undefined) {
    user_email_phone = req.body.user_email;
    mobile_or_email = "email";
  }
  let device_type = req.device.type.toUpperCase();
  let user_info = {
    user: user_email_phone,
    type: mobile_or_email,
    device: device_type,
  };
  // add to firestore database
  console.log(user_info);

  const options = {
    url : 'https://api.jsonbin.io/b',
    json : true,
    headers : {
      'Content-Type' : 'application/json',
      'secret-key' : key
    },
    body : user_info
  };
  
  request.post(options, (err, res, body) => {
    if(err){
      console.log(err);
    }
    console.log(`Status: ${res.statusCode}`);
  });

  // redirect to main page
  res.redirect("/");
});

// popular destinations
app.get("/city?", function (req, res) {
  let city_obj = {
    dubai: `https://hotellook.com/cities/dubai-city?marker=${process.env.AFFILIATE_KEY}`,
    istanbul: `https://hotellook.com/cities/istanbul?marker=${process.env.AFFILIATE_KEY}`,
    barcelona: `https://hotellook.com/cities/barcelona?marker=${process.env.AFFILIATE_KEY}`,
    amsterdam: `https://hotellook.com/cities/amsterdam?marker=${process.env.AFFILIATE_KEY}`,
    antalya: `https://hotellook.com/cities/antalya?marker=${process.env.AFFILIATE_KEY}`,
    bangkok: `https://hotellook.com/cities/bangkok?marker=${process.env.AFFILIATE_KEY}`,
  };
  let query_list = url.parse(req.url, true);
  let dest_city = JSON.parse(JSON.stringify(query_list.query));
  res.redirect(`${city_obj[dest_city.name]}`);
});

// error handler
app.get("*", function (req, res) {
  res.render("404");
});

console.log(`affiliate key : ${affiliate_key}`);

app.listen(port, console.log(`Server runs on port ${port}`));
