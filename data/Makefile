include config.mk

.PHONY : all
all: house senate

.PHONY: clean
clean: 
	rm merged_eitc_senate.geojson merged_eitc_house.geojson 


.PHONY : house
house: merged_eitc_house.geojson 

.PHONEY : senate
senate: merged_eitc_senate.geojson 

.PHONEY : cleanup_shapefiles
cleanup_shapefiles :		
	rm *.dbf *.prj *.shx *.xml *.cpg

.INTERMEDIATE : house_boundaries.shp
house_boundaries.shp : src/$(HOUSE_SHAPE).zip
	unzip -j "$<"
	rename -v 's/$(HOUSE_SHAPE)(.*)/house_boundaries$$1/' *.*
	touch house_boundaries.shp

.INTERMEDIATE : senate_boundaries.shp
senate_boundaries.shp : src/$(SENATE_SHAPE).zip
	unzip -j "$<"
	rename -v 's/$(SENATE_SHAPE)(.*)/senate_boundaries$$1/' *.*
	touch senate_boundaries.shp

%.table: %.shp
	shp2pgsql -I -s 4326 -d $< $* | \
		psql -d $(PG_DB) -U $(PG_USER) -h $(PG_HOST) -p $(PG_PORT)
	touch $@

eitc_%.table: eitc_%_formatted.csv
	psql -d $(PG_DB) -U $(PG_USER) -h $(PG_HOST) -p $(PG_PORT) -c "DROP TABLE IF EXISTS info_by_$*"
	csvsql $< \
		--db "postgresql://$(PG_USER):@$(PG_HOST):$(PG_PORT)/$(PG_DB)" --table info_by_$* --insert
	touch $@


merged_eitc_%.shp: %_boundaries.table eitc_%.table
	pgsql2shp -f $@ -h $(PG_HOST) -u $(PG_USER) -p $(PG_PORT) $(PG_DB) \
		"SELECT $*_boundaries.geom, info_by_$*.* FROM $*_boundaries \
		JOIN info_by_$* ON cast($*_boundaries.NAME as smallint) = cast(info_by_$*.district_number as smallint)"

merged_eitc_%.geojson: merged_eitc_%.shp
	ogr2ogr -simplify 0.0001 -f GeoJSON $@ $<






.PHONY : create_db
create_db :
	createdb -U $(PG_USER) -h $(PG_HOST) -p $(PG_PORT) wv_eitc
	psql -d $(PG_DB) -U $(PG_USER) -h $(PG_HOST) -p $(PG_PORT) -c "CREATE EXTENSION postgis"
