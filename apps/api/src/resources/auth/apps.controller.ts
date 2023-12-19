const { WebClient } = require("@slack/web-api");
import {
  createUserAppsRecord,
  deleteUserAppRecord,
  getAppEndpoint,
  getUserAppRecord,
} from "@zap/core/src/repositories/app.repo";
import AppError from "@zap/core/src/utils/appError";

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;
const client = new WebClient();

const handleSlackAuthCallback = async (
  userId: number,
  appId: number,
  data: any
) => {
  let result = false;
  const { code } = data;
  try {
    const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;
    const response = await client.oauth.v2.access({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code: code,
    });

    if (response?.ok) {
      const accessToken = response?.access_token ?? null;
      if (accessToken && userId) {
        const insertData = {
          userId: userId,
          appId: appId,
          access_token: accessToken,
          response_payload: response,
        };
        await createUserAppsRecord(insertData);
        result = true;
      }
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return result;
};

const getSlackUserInfo = async (req: any, res: any, next: any) => {
  const { appEndpointId, appKey, dataType } = req?.body;
  const userId = req?.user?.id;

  const slackUserResponse = {
    dataRequested: dataType,
    status: "error",
    data: null,
  };

  try {
    const appEndpointInfo = await getAppEndpoint(
      {
        id: appEndpointId,
      },
      ["appId", "endpoint_key", "endpoint_type"]
    );
    if (appEndpointInfo) {
      const endpointKey = appEndpointInfo?.endpoint_key;
      const userApp = await getUserAppRecord(
        {
          userId: userId,
          appId: appEndpointInfo?.appId,
        },
        ["access_token", "response_payload"]
      );

      if (userApp) {
        slackUserResponse.status = "success";
        switch (appKey) {
          case "slack":
            const slackData = await getSlackAppInfo(
              dataType?.length ? dataType : endpointKey,
              userApp
            );
            slackUserResponse.data = slackData;
            break;

          default:
            break;
        }
      }
    }
  } catch (error) {}
  res.status(200).json(slackUserResponse);
};

const getSlackAppInfo = async (endpointKey: string, userApp: any) => {
  let data = null;
  switch (endpointKey) {
    case "postMessageToChannel":
      //channels
      data = await getUserSlackChannels(userApp);
      break;
    default:
      break;
  }
  return data;
};

const getUserSlackChannels = async (userApp: any) => {
  if (!userApp?.response_payload?.team?.id) return null;
  try {
    const result = await client.conversations.list({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      token: userApp?.access_token,
      team_id: userApp?.response_payload?.team?.id,
    });
    if (result?.ok) {
      return result?.channels;
    }
  } catch (error: any) {
    console.log(error?.message);
  }
  return null;
};

const revokeUserApp = async (req: any, res: any, next: any) => {
  const { appId, userAppId, appKey } = req?.body;
  const userId = req?.user?.id;
  if (!appId || !userAppId || !appKey) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  let disconnected = false;
  try {
    const userApp = await getUserAppRecord(
      {
        id: userAppId,
        userId: userId,
        appId: appId,
      },
      ["access_token", "response_payload"]
    );
    if (userApp) {
      const deleteUserApp = await deleteUserAppRecord({
        id: userAppId,
        userId: userId,
        appId: appId,
      });
      const disconnectedResult = await disconnectApp(appKey, userApp);
      disconnected = deleteUserApp && disconnectedResult;
    }
  } catch (error) {}
  res.status(200).json({disconnected});
};

const disconnectApp = async (
  appKey: string,
  userApp: { access_token: string; response_payload: any }
) => {
  let result = false;
  try {
    switch (appKey) {
      case "slack":
        result = await revokeSlackAccessToken(userApp.access_token);
        break;
      default:
        break;
    }
  } catch (error) {}
  return result;
};

const revokeSlackAccessToken = async (
  accessToken: string
): Promise<boolean> => {
  try {
    const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;
    const revokeResult = await client.auth.revoke({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      token: accessToken,
    });
    if (revokeResult?.ok && revokeResult?.revoked) {
      return true;
    }
  } catch (error: any) {
    console.log('revokeSlackAccessToken |ERROR|', error.message);

  }
  return false;
};

export { handleSlackAuthCallback, getSlackUserInfo, revokeUserApp };
