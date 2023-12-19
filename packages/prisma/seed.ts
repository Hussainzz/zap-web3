import { getPrismaClient } from ".";

const prisma = getPrismaClient();

async function main() {
  const appsData = [
    {
      app_name: "Slack",
      app_key: "slack",
      app_description:
        "Slack is an instant messaging program designed by Slack Technologies and owned by Salesforce.",
      app_auth_url:
        "https://slack.com/oauth/v2/authorize?client_id=5478345267201.5472938788390&scope=channels:history,channels:manage,channels:read,channels:write.topic,chat:write,chat:write.customize,chat:write.public,groups:history,groups:read,groups:write,incoming-webhook,links:write,conversations.connect:read,conversations.connect:write,reminders:read,reminders:write,users:read,users.profile:read&user_scope=",
    },
    {
      app_name: "Webhook",
      app_key: "webhook",
      app_description: "Trigger your custom webhook",
    },
  ];
  const apps = await prisma.$transaction(
    appsData.map((appInfo) => prisma.app.create({ data: appInfo }))
  );

  const appEndpointData: any[] = [];
  apps.forEach((app) => {
    const appId = app.id;
    const appKey = app.app_key;
    switch (appKey) {
      case "slack":
        appEndpointData.push({
          appId,
          endpoint_key: "postMessageToChannel",
          endpoint_name: "Post Message To Channel",
          endpoint_description: "Post message to the selected channel",
          endpoint_type: "lib",
          endpoint_payload: {}
        });
        break;

      default:
        break;
    }
  });

  if (appEndpointData?.length) {
    await prisma.appEndpoint.createMany({
      data: appEndpointData,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
