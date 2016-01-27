var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');

function scrapeMeteo()
{
    var url = 'http://www.agriturismo-venezia.it/meteo/polonautico.html';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var json = {
                scraping_time: "",
                wind_velocity: "",
                wind_direction: "",
                temperature: "",
                humidity: "",
                dew_point: "",
                pression: "",
                rain: ""
            };

            $('#table-2').filter(function(){

                var table = $(this);
                json.scraping_time = table.children('tbody').children('tr').eq(0).children('td').first().text();
                json.wind_velocity = table.children('tbody').children('tr').eq(2).children('td').first().text();
                json.wind_direction = table.children('tbody').children('tr').eq(2).children('td').eq(1).text();
                json.temperature = table.children('tbody').children('tr').eq(6).children('td').eq(1).text();
                json.humidity = table.children('tbody').children('tr').eq(8).children('td').eq(1).text();
                json.dew_point = table.children('tbody').children('tr').eq(9).children('td').eq(1).text();
                json.pression = table.children('tbody').children('tr').eq(10).children('td').eq(1).text();
                json.rain = table.children('tbody').children('tr').eq(11).children('td').eq(1).text();
            });
        }

        fs.appendFile('crawled_data/meteo_values.csv',
            '"' + json.scraping_time + '",' +
            '"' + json.wind_velocity + '",' +
            '"' + json.wind_direction + '",' +
            '"' + json.temperature + '",' +
            '"' + json.humidity + '",' +
            '"' + json.dew_point + '",' +
            '"' + json.pression + '",' +
            '"' + json.rain + '\n'

        , function(err){
            console.log('File creato in /crawled_data');
        });
    });

    console.log('Magic happens on port 8081');
}


var minutes = 1, the_interval = minutes * 60 * 1000;

setInterval(function() {

    scrapeMeteo();

}, the_interval);