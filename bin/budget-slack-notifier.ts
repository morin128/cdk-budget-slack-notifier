#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BudgetSlackNotifierStack } from '../lib/budget-slack-notifier-stack';

const app = new cdk.App();
new BudgetSlackNotifierStack(app, 'BudgetSlackNotifierStack', {
  slackChannelId: process.env.SLACK_CHANNEL_ID!,
  slackWorkspaceId: process.env.SLACK_WORKSPACE_ID!,
  unit: process.env.UNIT ?? "USD",
  amount: process.env.AMOUNT != null ? Number(process.env.AMOUNT) : 10,
  threshold:
    process.env.THRESHOLD != null ? Number(process.env.THRESHOLD) : 100,
  thresholdType: process.env.THRESHOLD_TYPE ?? "PERCENTAGE",
  timeUnit: process.env.TIME_UNIT ?? "MONTHLY"
});
