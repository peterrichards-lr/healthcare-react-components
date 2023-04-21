#!/bin/sh
rowCount=30
# Add admin username and password here
username=
password=
mockarooBaseUrl=https://api.mockaroo.com/api
liferayBaseUrl=https://webserver-lctseuk-prd.lfr.cloud/o/c
mockarooApiKey=6775da80
enableHeartRate=true
enableBloodPressure=true
enableSteps=true
enableWeight=true

if [ "$enableHeartRate" = true ] ; then
   echo "Posting heart rate data"
   mockarooSchemaKey=76f8f520
   liferayBatchUrl=heartrates/batch
   curl -s "$mockarooBaseUrl/$mockarooSchemaKey?count=$rowCount" -H "X-API-Key: $mockarooApiKey" | jq '[.[] | del(.rowNumber)]' | curl -s -X POST "$liferayBaseUrl/$liferayBatchUrl" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(</dev/stdin)" --user $username:$password > /dev/null
fi

if [ "$enableBloodPressure" = true ] ; then
   echo "Posting blood pressure data"
   mockarooSchemaKey=453107c0
   liferayBatchUrl=bloodpressures/batch
   curl -s "$mockarooBaseUrl/$mockarooSchemaKey?count=$rowCount" -H "X-API-Key: $mockarooApiKey" | jq '[.[] | del(.rowNumber)]' | curl -s -X POST "$liferayBaseUrl/$liferayBatchUrl" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(</dev/stdin)" --user $username:$password > /dev/null
fi

if [ "$enableSteps" = true ] ; then
   echo "Posting step cound data"
   mockarooSchemaKey=8e30e370
   liferayBatchUrl=stepses/batch
   curl -s "$mockarooBaseUrl/$mockarooSchemaKey?count=$rowCount" -H "X-API-Key: $mockarooApiKey" | jq '[.[] | del(.rowNumber)]' | curl -s -X POST "$liferayBaseUrl/$liferayBatchUrl" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(</dev/stdin)" --user $username:$password > /dev/null
fi

if [ "$enableWeight" = true ] ; then
   echo "Posting weight data"
   mockarooSchemaKey=3fa56bf0
   liferayBatchUrl=weights/batch
   curl -s "$mockarooBaseUrl/$mockarooSchemaKey?count=$rowCount" -H "X-API-Key: $mockarooApiKey" | jq '[.[] | del(.rowNumber)]' | curl -s -X POST "$liferayBaseUrl/$liferayBatchUrl" -H 'accept: application/json' -H 'Content-Type: application/json' -d "$(</dev/stdin)" --user $username:$password > /dev/null
fi