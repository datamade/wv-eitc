# Invest in West Virginia Families

http://investinwvfamilies.org

## Running locally

This website is built using Jekyll. You will need to [install it first](http://jekyllrb.com/docs/installation/).

```console
git clone https://github.com/datamade/wv-eitc.git
cd wv-eitc
jekyll serve -w
```

Then open your web browser and navigate to http://localhost:5000

# Web dependencies
We used the following open source tools:

* [Jekyll](http://jekyllrb.com/) - Static site generator built in Ruby
* [Bootstrap](http://getbootstrap.com/) - Responsive HTML, CSS and Javascript framework
* [Leaflet](http://leafletjs.com/) - javascript library interactive maps
* [jQuery Address](https://github.com/asual/jquery-address) - javascript library creating RESTful URLs
* [GitHub pages](https://pages.github.com/) - free static website hosting

# Data sources

West Virginia Upper and Lower legislative districts come from the US Census: https://www.census.gov/geo/maps-data/data/cbf/cbf_sld.html

EITC impact numbers collected and provided by the West Virginia Center on Budget & Policy.

[See our README for more on working with this data](https://github.com/datamade/wv-eitc/tree/master/data)

## Team

* Derek Eder - developer, content
* Eric van Zanten - developer, GIS data merging

## Errors / Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
Report it here: https://github.com/datamade/wv-eitc/issues

## Note on Patches/Pull Requests
 
* Fork the project.
* Make your feature addition or bug fix.
* Commit, do not mess with rakefile, version, or history.
* Send a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2015 DataMade and Voices for West Virginia Center on Budget & Policy. Released under the [MIT License](https://github.com/datamade/wv-eitc/blob/master/LICENSE).

This project is based on [EITC Works!](http://eitcworks.org/) by DataMade and Voices for Illinois Children. [See the code](https://github.com/datamade/eitc-map).
