import {
  expect as expectCDK,
  haveResourceLike,
  countResources
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as BudgetSlackNotifier from "../lib/budget-slack-notifier-stack";

test("BudgetSlackNotifierStack", () => {
  const app = new cdk.App();

  // WHEN
  const testProps = {
    slackChannelId: "dummyChannel",
    slackWorkspaceId: "dummyWorkspace",
    unit: "USD",
    amount: 10,
    threshold: 100,
    thresholdType: "PERCENTAGE",
    timeUnit: "MONTHLY"
  };
  const stack = new BudgetSlackNotifier.BudgetSlackNotifierStack(
    app,
    "TestBudgetSlackNotifierStack",
    testProps
  );

  // THEN
  /* SNS */
  expectCDK(stack).to(countResources("AWS::SNS::Topic", 1));
  expectCDK(stack).to(
    haveResourceLike("AWS::SNS::Topic", {
      TopicName: "budget-slack-notifier-topic"
    })
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::SNS::TopicPolicy", {
      PolicyDocument: {
        Statement: [
          {
            Action: "SNS:Publish",
            Effect: "Allow",
            Principal: {
              Service: "budgets.amazonaws.com"
            }
          }
        ]
      }
    })
  );

  /* Chatbot */
  expectCDK(stack).to(countResources("AWS::IAM::Role", 1));
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "sns.amazonaws.com"
            }
          }
        ]
      }
    })
  );

  expectCDK(stack).to(countResources("AWS::IAM::Policy", 1));
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: "cloudwatch:*",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      }
    })
  );

  expectCDK(stack).to(
    countResources("AWS::Chatbot::SlackChannelConfiguration", 1)
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::Chatbot::SlackChannelConfiguration", {
      ConfigurationName: "budget-slack-notifier-channel-config",
      LoggingLevel: "ERROR",
      SlackChannelId: testProps.slackChannelId,
      SlackWorkspaceId: testProps.slackWorkspaceId
    })
  );

  /* Budget */
  expectCDK(stack).to(countResources("AWS::Budgets::Budget", 1));
  expectCDK(stack).to(
    haveResourceLike("AWS::Budgets::Budget", {
      Budget: {
        BudgetLimit: {
          Amount: testProps.amount,
          Unit: testProps.unit
        },
        BudgetType: "COST",
        TimeUnit: testProps.timeUnit
      },
      NotificationsWithSubscribers: [
        {
          Notification: {
            ComparisonOperator: "GREATER_THAN",
            NotificationType: "ACTUAL",
            Threshold: testProps.threshold,
            ThresholdType: testProps.thresholdType
          },
          Subscribers: [
            {
              SubscriptionType: "SNS"
            }
          ]
        }
      ]
    })
  );
});
