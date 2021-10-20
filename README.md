# cdk-budget-slack-notifier

Notify aws billing alert to your own specified slack channel by using AWS Chatbot.

# How to use

## Preparation

1. Check your "slack workspace ID" and "slack channel ID". When setup environment, you use it.
2. Create AWS Chatbot Workspace configuration on AWS management console.
3. Invite AWS Chatbot Agent to your slack channel by executing as below.

```
/invite @aws
```

## Setup environment variables

Setup each environment variables by executing the following command.

```sh
$ source ./env.sh
```

Environment variables can be set interactively.
Refer to [Environment variables](#environment-variables) for the meaning of each setting value.

```sh
Enter your slack workspace ID: xxxxx
Enter your slack channel ID: xxxxx
Enter unit (default 'USD'): USD
Enter amount value (default 10): 10
Enter threshold value (default 100): 100
Choose a threshold type [ABSOLUTE_VALUE | PERCENTAGE] (default 'PERCENTAGE'): PERCENTAGE
Choose a time unit [ANNUALLY | DAILY | MONTHLY | QUARTERLY] (default 'MONTHLY'): MONTHLY
```

# Environment variables

- SLACK_WORKSPACE_ID
  - Your slack workspace ID
- SLACK_CHANNEL_ID
  - Your slack channel ID
- UNIT
  - The unit of measurement that is used for the budget forecast, actual spend, or budget threshold, such as USD or GB.
- AMOUNT
  - The cost or usage amount that is associated with a budget forecast, actual spend, or budget threshold.
- THRESHOLD
  - The threshold that is associated with a notification. Thresholds are always a percentage, and many customers find value being alerted between 50% - 200% of the budgeted amount. The maximum limit for your threshold is 1,000,000% above the budgeted amount.
- THRESHOLD_TYPE
  - The type of threshold for a notification. For ABSOLUTE_VALUE thresholds, AWS notifies you when you go over or are forecasted to go over your total cost threshold. For PERCENTAGE thresholds, AWS notifies you when you go over or are forecasted to go over a certain percentage of your forecasted spend. For example, if you have a budget for 200 dollars and you have a PERCENTAGE threshold of 80%, AWS notifies you when you go over 160 dollars.
  - Allowed values
    - `ABSOLUTE_VALUE | PERCENTAGE`
- TIME_UNIT
  - The length of time until a budget resets the actual and forecasted spend. DAILY is available only for RI_UTILIZATION and RI_COVERAGE budgets.
  - Allowed values
    - `ANNUALLY | DAILY | MONTHLY | QUARTERLY`

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
