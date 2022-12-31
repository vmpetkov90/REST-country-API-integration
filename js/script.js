
(function ($) {
    "use strict";

    const countries = [];

    function changeMode() {
        $(".button-mode").click(function () {
            $("body").toggleClass("dark-mode")
        })
    }

    function changeNav() {
        $("form,.back").toggle();
    }

    function backButton() {
        $(".back").on("click", function (event) {
            const target = event.currentTarget.className;
            getData("https://restcountries.com/v2/all", target);
            $(".loader").addClass("loading");
            $(".search input").val("");
            $(".filter label").text("Filter by Region");
        })
    }

    function search() {
        $(".search input").on("input", function () {
            let name = $(this).val().toLowerCase();
            if (name.length > 0) {
                $(".search label").hide();
                getData("https://restcountries.com/v2/name/" + name);
            } else {
                $(".search label").show();
                getData("https://restcountries.com/v2/all");
            }
            $(".loader").addClass("loading");
            $(".filter label").text("Filter by Region");
        });
        $(".search").click(function () {
            $(".search input").focus();
        });
    }

    function filterDropdown() {
        $(".filter").click(function () {
            $(".dropdown").fadeToggle(200);
        });
        $(".dropdown").on("click", "li", function () {
            $(".dropdown").fadeToggle(200);
        });
    }

    function filterRegion() {
        $(".dropdown").on("click", "li", function () {
            const region = $(this).text();
            getData("https://restcountries.com/v2/region/" + region);
            $(".filter label").text(region);
            $(".search input").val("");
            $(".search label").show();
            $(".loader").addClass("loading");
        });
    }

    function getRegions(url) {
        const regions = [];
        $.getJSON(url)
            .done(function (result) {
                for (let country of result) {
                    if (!regions.includes(country.region)) {
                        regions.push(country.region)
                    }
                }
                for (let region of regions) {
                    const regionContainer = $("<li></li>")
                    regionContainer.append(region);
                    $(".dropdown").append(regionContainer);
                }
            })
            .fail(function () {
                $(".dropdown").append("<p>Something went wrong</p>");
            })
    }

    function getData(url, target) {
        $.getJSON(url)
            .done(function (result) {
                $(".country, .country-details, main p").remove();
                if (target === "back") {
                    changeNav();
                }
                for (let country of result) {
                    if (countries.length < result.length) {
                        countries.push({
                            fullName: country.name,
                            shortName: country.alpha3Code
                        });
                    }
                    const countryContainer = $(`<div class="country" data-code="${country.alpha3Code}"></div>`);
                    const flagContainer = $("<div class='flag-container'></div>");
                    const flag = $(`<img class="flag" src="${country.flag}" alt="${country.name} flag">`);
                    const infoContainer = $("<div class='info-container'></div>");
                    const name = $(`<h2>${country.name}</h2>`);
                    const population = $(`<p>Population: <span>${country.population.toLocaleString()}</span></p>`);
                    const region = $(`<p>Region: <span>${country.region}</span></p>`);
                    const capital = $(`<p>Capital: <span>${country.capital}</span></p>`);

                    flagContainer.append(flag);
                    infoContainer.append(name, population, region, capital);
                    countryContainer.append(flagContainer, infoContainer);
                    $("main .container").append(countryContainer);
                    $(".loader").removeClass("loading");
                }
            })
            .fail(function () {
                $(".country, .country-details, main p").remove();
                $("main .container").append("<p>Oops! Something went wrong!<p>");
                $(".loader").removeClass("loading");
            })
    }

    function countryDetails() {
        $("main").on("click", ".country, button", function (event) {
            const countryCode = event.currentTarget.attributes["data-code"].value;
            $(".loader").addClass("loading");
            $.getJSON("https://restcountries.com/v2/alpha/" + countryCode)
                .done(function (result) {
                    $(".loader").removeClass("loading");
                    if (event.currentTarget.className === "country") {
                        changeNav();
                    }
                    const countryContainer = $(`<div class="country-details row"></div>`);
                    const flagContainer = $("<div class='flag-container col-lg-6'></div>");
                    const flag = $(`<img class="flag" src="${result.flag}" alt="${result.name} flag">`);
                    const infoContainer = $("<div class='info-container row col-lg-6'></div>");
                    const mainInfo = $("<div class='main-info col-md-6 col-lg-12 col-xl-6'></div>");
                    const additionalInfo = $("<div class='additional-info col-md-6 col-lg-12 col-xl-6'></div>");
                    const name = $(`<h2>${result.name}</h2>`);
                    const nativeName = $(`<p>Native Name: <span>${result.nativeName}</span></p>`);
                    const population = $(`<p>Population: <span>${result.population.toLocaleString()}</span></p>`);
                    const region = $(`<p>Region: <span>${result.region}</span></p>`);
                    const subRegion = $(`<p>Sub Region: <span>${result.subregion}</span></p>`);
                    const capital = $(`<p>Capital: <span>${result.capital}</span></p>`);
                    const domain = $(`<p>Top Level Domain: <span>${result.topLevelDomain}</span></p>`);
                    const currenciesVal = [];
                    for (let currency of result.currencies) {
                        currenciesVal.push(currency.name);
                    }
                    const currencies = $(`<p>Currencies: <span>${currenciesVal.join(", ")}</span></p>`);
                    const languagesVal = [];
                    for (let language of result.languages) {
                        languagesVal.push(language.name)
                    }
                    const languages = $(`<p>Languages: <span>${languagesVal.join(", ")}</span></p>`);
                    const borders = $(`<span class="borders"><p>Border Countries:</p> </span>`);
                    flagContainer.append(flag);
                    mainInfo.append(nativeName, population, region, subRegion, capital);
                    additionalInfo.append(domain, currencies, languages);
                    infoContainer.prepend(name, mainInfo, additionalInfo, borders)
                    countryContainer.append(flagContainer, infoContainer);
                    $(".country-details,.country").remove();
                    $("main .container").prepend(countryContainer);
                    for (let border of result.borders) {
                        for (let i = 0; i < countries.length; i++) {
                            if (border === countries[i].shortName) {

                                $(".borders").append(`<button data-code="${countries[i].shortName}">${countries[i].fullName}</button>`);
                            }
                        }
                    }
                    if (result.borders.length === 0) {
                        $(".borders p ").append("<span> None</span>");
                    }
                })
                .fail(function () {
                    $(".loader").removeClass("loading");
                    $(".country-details,.country").remove();
                    $("main .container").append("<p>Oops! Something went wrong!<p>");
                })


        });

    }

    $(document).ready(function () {
        filterRegion();
        filterDropdown();
        changeMode();
        getData("https://restcountries.com/v2/all");
        search();
        countryDetails();
        backButton();
        getRegions("https://restcountries.com/v2/all?fields=region;")
    });

})(jQuery);
