import axios from 'axios';

export type NotificationContent = {
  title: string;
  description: string;
  data: { [key: string]: any };
};

export const sendNotification = async (
  externalIds: string[],
  content: NotificationContent,
) => {
  const apiKey = process.env.ONESIGNAL_API_KEY;
  const appId = process.env.ONESIGNAL_APP_ID;

  console.log(externalIds);

  const payload = {
    app_id: appId,
    headings: { en: content.title },
    contents: { en: content.description },
    target_channel: 'push',
    include_aliases: {
      external_id: externalIds.map((id) => `kioku_${id.toString()}`),
    },
    data: content.data,
  };

  console.log(payload, JSON.stringify(payload, null, 2));

  const config = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${apiKey}`,
    },
  };

  axios
    .post(`https://onesignal.com/api/v1/notifications`, payload, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error.response);
    });
};
