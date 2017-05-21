var map;

(function(){
    var lastClicked;
    var house_boundaries;
    var senate_boundaries;
    var view_mode = 'house'
    var marker;
    map = L.map('map', {minZoom: 6})
        .fitBounds([[35.2905, -77.3108],[41.0710,-83.2434]]);
    var googleLayer = new L.Google('ROADMAP', {animate: false});
    map.addLayer(googleLayer);
    map.on('zoomstart', function(e){
        if (view_mode == 'senate')
          map.removeLayer(senate_boundaries);
        else
          map.removeLayer(house_boundaries);
        if (typeof marker !== 'undefined'){
            map.removeLayer(marker);
        }
    })
    google.maps.event.addListener(googleLayer._google, 'idle', function(e){
        if (view_mode == 'senate')
          map.addLayer(senate_boundaries);
        else
          map.addLayer(house_boundaries);
        if (typeof marker !== 'undefined'){
            map.addLayer(marker);
        }
    })
    google.maps.event.addListenerOnce(googleLayer._google, 'idle', function(e){
        var house_district = $.address.parameter('house_district');
        var senate_district = $.address.parameter('senate_district');
        if (house_district && !address){
            house_boundaries.eachLayer(function(layer){
                if(layer.feature.properties['DISTRICT_N'] == house_district){
                    layer.fire('click');
                }
            })
        }
        if (senate_district && !address){
            $("#view_mode_senate").click();
            senate_boundaries.eachLayer(function(layer){
                if(layer.feature.properties['DISTRICT_N'] == senate_district){
                    layer.fire('click');
                }
            })
        }
    })
    var info = L.control({position: 'bottomleft'});
    info.onAdd = function(map){
        this._div = L.DomUtil.create('div', 'info');
        return this._div;
    }

    // load house boundaries
    $.when($.getJSON('data/merged_eitc_house.geojson')).then(
        function(shapes){
            house_boundaries = L.geoJson(shapes, {
                style: house_style,
                onEachFeature: onEachFeatureHouse
            });

            // load senate boundaries
            $.when($.getJSON('data/merged_eitc_senate.geojson')).then(
                function(shapes){
                    senate_boundaries = L.geoJson(shapes, {
                        style: senate_style,
                        onEachFeature: onEachFeatureSenate
                    });
                }
            );

            if (view_mode == 'senate')
              senate_boundaries.addTo(map);
            else
              house_boundaries.addTo(map);

        }
    );

    $('#search_address').geocomplete()
      .bind('geocode:result', function(event, result){
        if (typeof marker !== 'undefined'){
            map.removeLayer(marker);
        }
        var lat = result.geometry.location.lat();
        var lng = result.geometry.location.lng();
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 17);
        var district;
        if (view_mode == 'senate')
          district = leafletPip.pointInLayer([lng, lat], senate_boundaries);
        else
          district = leafletPip.pointInLayer([lng, lat], house_boundaries);

        $.address.parameter('address', encodeURI($('#search_address').val()));
        district[0].fire('click');
      });

    $("#search").click(function(){
      $('#search_address').trigger("geocode");
    });

    var address = convertToPlainString($.address.parameter('address'));
    if(address){
        $("#search_address").val(address);
        $('#search_address').geocomplete('find', address)
    }

    $('.view-mode').click(function(){
      var self = $(this);
      var mode = self.data('view');

      $('.view-mode').removeClass('btn-primary').addClass('btn-default');
      self.addClass('btn-primary');

      if (mode == 'senate') {
        map.removeLayer(house_boundaries);
        senate_boundaries.addTo(map);
      }
      else {
        house_boundaries.addTo(map);
        map.removeLayer(senate_boundaries);
      }

      $('#search_address').trigger("geocode");

      $.address.parameter('view_mode', mode);
      view_mode = mode;
      return false;
    });

    function house_style(feature){
        var style = {
            "color": "#333",
            "fillColor": "#fdb104",
            "opacity": 1,
            "weight": 1,
            "fillOpacity": 0.5,
        }
        return style;
    }

    function senate_style(feature){
        var style = {
            "color": "#333",
            "fillColor": "#bdce39",
            "opacity": 1,
            "weight": 1,
            "fillOpacity": 0.5,
        }
        return style;
    }

    function onEachFeatureHouse(feature, layer){
        layer.on('click', function(e){
            if(typeof lastClicked !== 'undefined'){
                house_boundaries.resetStyle(lastClicked);
            }
            e.target.setStyle({'fillColor':"#00529B"});
            $('#district-info').html(featureInfo(feature.properties));
            map.fitBounds(e.target.getBounds(), {padding: [50,50]});
            lastClicked = e.target;

            $.address.parameter('senate_district', '');
            $.address.parameter('house_district', feature.properties['DISTRICT_N']);
        });

        layer.on('mouseover', function(e){
          layer.setStyle({weight: 5})
        });
        layer.on('mouseout', function(e){
          layer.setStyle({weight: 1})
        })

        var labelText = "West Virginia House District " + parseInt(feature.properties['DISTRICT_N']);
        labelText += renderReps(feature.properties, false);
        layer.bindLabel(labelText);
    }

    function onEachFeatureSenate(feature, layer){
        layer.on('click', function(e){
            if(typeof lastClicked !== 'undefined'){
                senate_boundaries.resetStyle(lastClicked);
            }
            e.target.setStyle({'fillColor':"#00529B"});
            $('#district-info').html(featureInfo(feature.properties));
            map.fitBounds(e.target.getBounds(), {padding: [50,50]});
            lastClicked = e.target;

            $.address.parameter('house_district', '');
            $.address.parameter('senate_district', feature.properties['DISTRICT_N'])
        });

        layer.on('mouseover', function(e){
          layer.setStyle({weight: 5})
          if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
          }
        });
        layer.on('mouseout', function(e){
          layer.setStyle({weight: 1})
        })

        var labelText = "West Virginia Senate District " + parseInt(feature.properties['DISTRICT_N']);
        labelText += renderReps(feature.properties);
        layer.bindLabel(labelText);
    }

    function featureInfo(properties){
        var district = '';
        var doc_link = '';
        var name = '';
        var mode_name = "House"
        district = parseInt(properties['DISTRICT_N']);

        if (view_mode == 'senate') {
          doc_link = "/docs/wv-eitc-senate." + district + ".pdf";
          name = properties['SENATOR'];
          mode_name = "Senate"
        }
        else {
          doc_link = "/docs/wv-eitc-house." + district + ".pdf";
          name = properties['HOUSEREP'];
        }

        var blob = "<div>\
            <p><a href='index.html'>&laquo; back to State view</a></p>\
            <h3>West Virginia " + mode_name + " District " + district + "</h3>\
            <table class='table'>\
              <tbody>" + renderReps(properties, true) + "</tbody>\
            </table>\
            <h3>Local impact</h3>\
            <table class='table'>\
              <tbody>\
                  <tr>\
                      <td>Households that will receive EITC</td>\
                      <td>" + addCommas(properties['HOUSEHOLD_']) + "</td>\
                  </tr>\
                  <tr>\
                      <td>Annual boost to local economy</td>\
                      <td>" + accounting.formatMoney(properties['ECONOMIC_I'], {precision: 0}) + "</td>\
                  </tr>\
                  <tr>\
                      <td>Number of children affected</td>\
                      <td>" + addCommas(properties['CHILDREN_I']) + "</td>\
                  </tr>\
              </tbody>\
            </table>\
            <div class='col-lg-6 text-center'>\
              <h3>District " + district + " profile</h3>\
              <p><a target='_blank' href='" + doc_link + "'><img class='img-responsive img-thumbnail' src='/images/eitc_factsheet.jpg' alt='EITC Factsheet' /><br /><i class='icon-download'></i> Download district profile</a></p>\
            </div>\
            <div class='col-lg-6 text-center'>\
              <h3>Take action!</h3>\
              <p>Help us spread the word about doubling the West Virginia Earned Income Tax Credit.<br /><br /></p><p><a class='btn btn-primary' target='_blank' href='https://actionnetwork.org/letters/ask-the-wv-house-finance-committee-to-not-forget-hard-working-families'><i class='icon-bullhorn'></i> Tell your lawmaker<span class='hidden-xs hidden-sm'> EITC Works</span>!</a></p>\
            </div>\
            <div class='clearfix'></div>\
            </div>";
        return blob
    }

    function renderReps(properties, as_table){
      var repsTxt = ""
      for (i = 1; i < 6; i++) {
        if (properties['REP_NAME_' + i] != undefined && properties['REP_NAME_' + i] != "") {
          var rowTxt = properties['REP_NAME_' + i] + " (" + properties['PARTY_' + i] + " - " + properties['COUNTY_' + i] + ")";
          if (as_table)
            rowTxt = "<tr><td>" + rowTxt + "</td></tr>";
          else
            rowTxt = "<br />" + rowTxt;
          repsTxt += rowTxt;
        }
      }

      return repsTxt;
    }

    function convertToPlainString(text) {
      if (text == undefined) return '';
      return decodeURIComponent(text);
    }

    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
      }
})()
