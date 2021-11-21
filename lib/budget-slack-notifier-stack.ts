import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";
import * as iam from "@aws-cdk/aws-iam";
import * as chatbot from "@aws-cdk/aws-chatbot";
import * as budgets from "@aws-cdk/aws-budgets";

export interface ConditionProps extends cdk.StackProps {
  readonly slackChannelId: string;
  readonly slackWorkspaceId: string;
  readonly unit: string;
  readonly amount: number;
  readonly threshold: number;
  readonly thresholdType: string;
  readonly timeUnit: string;
}

export class BudgetSlackNotifierStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConditionProps) {
    super(scope, id, props);

    /* SNS */
    const topic = new sns.Topic(this, "budget-slack-notifier-topic", {
      topicName: "budget-slack-notifier-topic"
    });

    topic.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["SNS:Publish"],
        principals: [new iam.ServicePrincipal("budgets.amazonaws.com")],
        resources: [topic.topicArn]
      })
    );

    /* Chatbot */
    const chatbotRole = new iam.Role(
      this,
      "budget-slack-notifier-chatbot-role",
      {
        assumedBy: new iam.ServicePrincipal("sns.amazonaws.com")
      }
    );

    chatbotRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["cloudwatch:*"]
      })
    );

    new chatbot.CfnSlackChannelConfiguration(
      this,
      "budget-slack-notifier-channel-config",
      {
        configurationName: "budget-slack-notifier-channel-config",
        iamRoleArn: chatbotRole.roleArn,
        loggingLevel: "ERROR",
        slackChannelId: props!.slackChannelId,
        slackWorkspaceId: props!.slackWorkspaceId,
        snsTopicArns: [topic.topicArn]
      }
    );

    /* Budgets */
    new budgets.CfnBudget(this, "budget-slack-notifier", {
      budget: {
        budgetType: "COST",
        timeUnit: props!.timeUnit,
        budgetLimit: {
          amount: props!.amount,
          unit: props!.unit
        }
      },
      notificationsWithSubscribers: [
        {
          notification: {
            comparisonOperator: "GREATER_THAN",
            notificationType: "ACTUAL",
            threshold: props!.threshold,
            thresholdType: props!.thresholdType
          },
          subscribers: [
            {
              address: topic.topicArn,
              subscriptionType: "SNS"
            }
          ]
        }
      ]
    });
  }
}
