# WV EITC data

### Source

West Virginia Upper and Lower legislative districts come from the US Census: https://www.census.gov/geo/maps-data/data/cbf/cbf_sld.html

EITC impact numbers collected and provided by the West Virginia Center on Budget & Policy.

### Data processing

This workflow is based on DataMade's [Data Making Guidelines](https://github.com/datamade/data-making-guidelines).

Install stuff using pip & [homebrew](http://brew.sh/)
```bash
> mkvirtualenv wveitc
> pip install -r requirements.txt
> brew install gdal --with-postgresql
```

Mac users: you will also need the rename library

```bash
> brew install rename
```

Edit the `config.mk` for your settings


Configure make in `config.mk` with your DB settings, then:

```bash
> make created_db
> make all
> mace clean_shapefiles
```

This will build the necessary geojson files.