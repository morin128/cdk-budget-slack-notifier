#!/bin/bash

cd `dirname $0`

echo -n "Enter your slack workspace ID: "
read SLACK_WORKSPACE_ID
export SLACK_WORKSPACE_ID=$SLACK_WORKSPACE_ID

echo -n "Enter your slack channel ID: "
read SLACK_CHANNEL_ID
export SLACK_CHANNEL_ID=$SLACK_CHANNEL_ID

echo -n "Enter unit (default 'USD'): "
read UNIT
export UNIT=${UNIT:='USD'}

echo -n "Enter amount value (default 10): "
read AMOUNT
export AMOUNT=${AMOUNT:=10}

echo -n "Enter threshold value (default 100): "
read THRESHOLD
export THRESHOLD=${THRESHOLD:=100}

echo -n "Choose a threshold type [ABSOLUTE_VALUE | PERCENTAGE] (default 'PERCENTAGE'): "
read THRESHOLD_TYPE
export THRESHOLD_TYPE=${THRESHOLD_TYPE:='PERCENTAGE'}

echo -n "Choose a time unit [ANNUALLY | DAILY | MONTHLY | QUARTERLY] (default 'MONTHLY'): "
read TIME_UNIT
export TIME_UNIT=${TIME_UNIT:='MONTHLY'}
