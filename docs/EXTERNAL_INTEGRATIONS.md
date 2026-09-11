# External integration handoff

The local prototype now has the database schema, PostGIS hazard import, authenticated fleet position API, field-report queue, alert APIs and a provider-ready broadcast simulator. The remaining external steps require accounts, devices or authority data and are intentionally kept server-side.

## GPS fleet tracking

For the SIH demo, use the browser GPS sharing control after signing in. It sends latitude, longitude, accuracy and the device timestamp to the authenticated `POST /api/v1/fleet/positions` endpoint. This proves the API contract, but it is not continuous fleet telemetry.

For a field pilot, obtain either:

- Android devices with a consented background location app, or
- GPS trackers from a fleet telematics provider that can send HTTPS webhooks.

The provider must supply a vehicle identifier, latitude, longitude, accuracy, recorded timestamp and an authenticated webhook/API. Store its server credential in `GPS_INGESTION_API_KEY`; never expose it in the frontend. Before a pilot, define driver consent, retention period, device ownership and geofence policy.

## SMS and WhatsApp

The current UI deliberately shows a formatted dispatch simulation. It does not claim that a message was delivered. To enable delivery, the team needs an approved provider account and sender registration:

- Government SMS: obtain the authorised C-DAC/department gateway endpoint, sender ID, template IDs and API credential from the responsible department.
- Commercial SMS fallback: obtain a provider account, approved sender/template and delivery-status webhook.
- WhatsApp: create a Meta WhatsApp Business app, verify the business, register a phone number, create approved message templates and obtain a server-side access token and phone-number ID.

Set the provider values only in the backend environment (`SMS_PROVIDER_*`, `WHATSAPP_*`). Add a backend delivery adapter and persist provider message IDs/status callbacks in `delivery_jobs`; do not mark a dispatch delivered merely because the provider request was accepted.

## Field pilot and calibrated ML

The current model is a domain-informed prototype score. A valid calibration study needs a versioned labelled dataset containing road segment, observation time, rainfall, slope/elevation, surface/bridge attributes, incident outcome and source confidence. Split by time and geography, train on the training partition, calibrate probabilities on a validation partition, and report held-out precision/recall, ROC-AUC, Brier score and calibration plots. Do not use the 467 historical NASA points as current closure labels.

Run the pilot on one corridor with authority-reviewed incident reports, GPS traces and arrival delays. Freeze the graph/risk snapshot, compare baseline versus Risk-A* routes, and publish the sample size, missingness, confidence intervals and failure cases before making safety or efficiency claims.
