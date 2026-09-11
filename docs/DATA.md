# Dataset inventory and evidence rules

The collection covers the project's initial public-data needs across Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim and Tripura. It also includes a separate Siliguri gateway pilot because Siliguri is in West Bengal but serves as a major operational access corridor into the Northeast. It is a curated, reproducible bundle. It is **not an assertion that every relevant government dataset is publicly downloadable or that all sources are complete**.

Download receipts preserve source URLs, access timestamps, file sizes, SHA-256 hashes and original modification headers. `datasets/manifest-*.json` records each successful download and each failure. `datasets/processed` contains derived data, never replacements for the raw evidence.

## Sources

| Source | Local data | Coverage / proper use | Limitations |
|---|---|---|---|
| Geofabrik / OpenStreetMap | North-Eastern Zone and optional Eastern Zone PBFs, extract polygons | North-Eastern Zone covers all eight states including Sikkim. Eastern Zone provides adjacent-region context only. | Contributor coverage varies. PBFs include non-NE territory. OSM is not an official accessibility certificate. |
| geoBoundaries gbOpen IND ADM1 | Original India GeoJSON and eight-state subset | Spatial filtering and regional analysis | Metadata represents 2011 boundaries, released through a pinned 2023 source. Not a legal boundary reference. |
| Tilezen / AWS Terrain Tiles | 45 downloaded HGT tiles intersecting the eight-state boundaries | Elevation and slope derivation | Source dates/resolution vary. Elevation alone does not establish landslide susceptibility. All 45 tiles passed gzip/grid validation. |
| Open-Meteo historical API | 2021–2025 daily series at eight reference points | Rain, temperature and wind features for a first experiment | 14,608 point-days, not statewide spatial coverage. Reanalysis/model estimates, not road sensors. |
| NASA Global Landslide Catalog export | Global CSV, Northeast CSV/GeoJSON | 467 historical incident points within selected boundaries | Reporting bias and variable location accuracy. Historical incidents are not current closures. |
| MoRTH Road Accidents in India 2023 | Official PDF, extracted text and NE page index | Aggregate validation context and state comparisons | State counts are not geolocated road risk. Review source tables before quoting extracted text. |
| Assam PWD road-safety page | Saved public HTML and four raw table CSVs | Published blackspot place names and mitigation context | Merged headers need review. Verified coordinates were not extracted. |
| MoRTH blackspot protocol via Assam PWD | 2015 methodology PDF | Definitions and identification methodology | A protocol is not a dataset of current blackspots. |

## Source links and licenses

- [Geofabrik North-Eastern Zone](https://download.geofabrik.de/asia/india/north-eastern-zone.html) and [Eastern Zone](https://download.geofabrik.de/asia/india/eastern-zone.html). OSM data © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Preserve attribution and follow derivative-database obligations when sharing.
- [geoBoundaries API](https://www.geoboundaries.org/api.html). The downloaded IND ADM1 metadata specifies CC BY 2.5 IN and credits DataMeet India community / Election Commission of India. Preserve `datasets/boundary-metadata.json`.
- [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) and [Tilezen attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). Tiles combine elevation sources. Retain source attribution and do not describe them as fresh measurements.
- [Open-Meteo historical documentation](https://open-meteo.com/en/docs/historical-weather-api). Data attribution under CC BY 4.0 includes Open-Meteo and the underlying providers. The noncommercial API's service terms are separate from the data license.
- [NASA catalog](https://data.nasa.gov/dataset/global-landslide-catalog-export-f07b6). Cite Kirschbaum et al. (2010), DOI 10.1007/s11069-009-9401-4, and Kirschbaum et al. (2015), DOI 10.1016/j.geomorph.2015.03.016. The landing page describes a 2016 export, but the downloaded file contains event dates from 1988-11-07 through 2017-09-28. This discrepancy is recorded in the subset summary.
- [MoRTH 2023 report](https://morth.gov.in/backend/documents/uploaded/Road-Accident-in-India-2023-Publications.pdf) and [Assam PWD road safety](https://pwdroads.assam.gov.in/portlets/road-safety). Preserve government source attribution and verify reuse terms.

## Historical landslide counts in the spatial subset

| State | Matched catalog records |
|---|---:|
| Arunachal Pradesh | 71 |
| Assam | 89 |
| Manipur | 94 |
| Meghalaya | 38 |
| Mizoram | 35 |
| Nagaland | 85 |
| Sikkim | 50 |
| Tripura | 5 |
| Total | 467 |

These counts measure records in this particular source and geographic filter. They are unsuitable for ranking states by actual risk without reporting-bias and exposure analysis.

## Current gaps

- Full eDAR/iRAD accident microdata with road coordinates was not obtained. Public availability must be established through the responsible authority.
- The MoRTH Black Spot MIS site was reachable in web search but timed out during direct collection. No authenticated endpoints were bypassed.
- One NHIDCL tender download failed certificate verification. The downloader kept verification enabled and logged the failure.
- A reviewed, coordinate-level blackspot inventory for all eight states remains missing.
- Official current closures, road-surface inspections, bridge capacity certificates and granular live traffic are not available in this bundle.
- GSI susceptibility mapping and current flood/landslide warning products need licensing/access review and suitable geospatial exports. The NASA historical catalog is not a substitute for these products.
- Eight weather reference points cannot support road-level predictions across the whole region. Expand to a spatial grid or suitable official gridded product before claiming regional prediction quality.

## Processing rules

1. Keep source records, timestamps, units and coordinate accuracy intact.
2. Validate coordinates and remove demonstrable duplicates by source ID.
3. Produce spatial candidates in PostGIS using distances in metres.
4. Review road identity, carriageway, observation age and coordinate uncertainty.
5. Apply only accepted observations to a new versioned risk snapshot with explicit weighting and expiry rules.
6. Evaluate on time/geography holdouts and report missing coverage separately from low scores.

Raw road extracts omit footpaths and private/no-access roads from the public driving graph. They include a small state boundary buffer to retain connections and preserve referenced nodes. Original PBFs retain the broader OSM tags and relations. Turn restrictions are not yet implemented in routing.

## Runtime graph snapshots

All eight state road extracts have been converted through OSMnx into validated JSON and GraphML snapshots in `backend/data`. Each JSON snapshot passed schema/reference validation and a fastest plus risk-aware route smoke test. The API discovers these files and loads a selected state on demand with a bounded memory cache; it does not load every state into RAM at startup. Snapshot file sizes and SHA-256 checksums are recorded in `datasets/processed/ne-coverage-catalog.json`.

Full-state geometry responses are too large for direct browser rendering, especially Assam. Production map delivery still requires viewport/bounding-box filtering or vector tiles, while routing can use the server-side full graph.

The local OSM gazetteer contains named cities, towns, villages, hamlets, suburbs and localities for every state, plus the separately extracted hospital, clinic, pharmacy, fire station, police, fuel and warehouse facilities. Search results snap to the nearest routable graph node within 2 km. The eight state capitals were verified through the live API. OSM place names are search aids and are not an official administrative register.

## Research claim handling

The 2026 [Route Map AI paper](https://www.ijrtmr.com/archiver/archives/route_map_ai_an_intelligent_route_optimization_system_integrating_gis_and_machine_learning_for_real_time_navigation.pdf) is an architectural reference. Its 23.6% claim concerns quicker trips in its reported experiment. It is not a demonstrated safety improvement for this prototype. The team's route measurements live in `docs/validation` and clearly identify the synthetic dataset.
