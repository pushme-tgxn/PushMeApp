
# Example Push Notification JSON

# from FCM
```json
 {
    "request": {
        "trigger": {
            "remoteMessage": {
                "originalPriority": 1,
                "sentTime": 1671029018364,
                "notification": null,
                "data": {
                "categoryId": "button.approve_deny",
                "message": "Hello world! 🌐",
                "title": "📧 You've got mail",
                "data": "{\"pushId\":\"111\",\"pushIdent\":\"abc123\"}",
                "scopeKey": "@tgxn/pushme",
                "experienceId": "@tgxn/pushme",
                "pushIdent": "abc123",
                "pushId": "111"
                },
                "to": null,
                "ttl": 2419200,
                "collapseKey": null,
                "messageType": null,
                "priority": 1,
                "from": "496431691586",
                "messageId": "0:1671029018371127%5939b446f9fd7ecd"
            },
            "channelId": null,
            "type": "push"
        },
        "content": {
            "title": "📧 You've got mail",
            "badge": null,
            "categoryIdentifier": "button.approve_deny",
            "autoDismiss": true,
            "data": null,
            "body": "Hello world! 🌐",
            "sound": "default",
            "sticky": false,
            "subtitle": null
        },
        "identifier": "0:1671029018371127%5939b446f9fd7ecd"
    },
    "date": 1671029018364
}
```

# from Expo

```json
{
  "request": {
    "trigger": {
      "remoteMessage": {
        "originalPriority": 2,
        "sentTime": 1671029185921,
        "notification": null,
        "data": {
          "categoryId": "default",
          "message": "Test body.",
          "title": "Test notification title!",
          "body": "{\"pushId\":4,\"pushIdent\":\"47a929ef-cf59-43a3-8ee9-2dd5e4b0c69b\"}",
          "scopeKey": "@tgxn/pushme",
          "experienceId": "@tgxn/pushme",
          "projectId": "dc94d550-9538-48ff-b051-43562cdcf34e"
        },
        "to": null,
        "ttl": 2419200,
        "collapseKey": null,
        "messageType": null,
        "priority": 2,
        "from": "496431691586",
        "messageId": "0:1671029185939736%5939b446f9fd7ecd"
      },
      "channelId": null,
      "type": "push"
    },
    "content": {
      "title": "Test notification title!",
      "badge": null,
      "categoryIdentifier": "default",
      "autoDismiss": true,
      "data": {
        "pushIdent": "47a929ef-cf59-43a3-8ee9-2dd5e4b0c69b",
        "pushId": 4
      },
      "body": "Test body.",
      "sound": "default",
      "sticky": false,
      "subtitle": null
    },
    "identifier": "0:1671029185939736%5939b446f9fd7ecd"
  },
  "date": 1671029185921
}
```


## push response


```js
/**
      Object {
        "actionIdentifier": "expo.modules.notifications.actions.DEFAULT",
        "notification": Object {
          "date": 1630234055767,
          "request": Object {
            "content": Object {
              "autoDismiss": true,
              "badge": null,
              "body": "",
              "categoryIdentifier": "default",
              "data": Object {
                "pushId": 30,
              },
              "sound": "default",
              "sticky": false,
              "subtitle": null,
              "title": "",
            },
            "identifier": "0:1630234055770633%0ac519e6f9fd7ecd",
            "trigger": Object {
              "channelId": null,
              "remoteMessage": Object {
                "collapseKey": null,
                "data": Object {
                  "body": "{\"pushId\":30}",
                  "categoryId": "default",
                  "experienceId": "@tgxn/pushme",
                  "message": "",
                  "projectId": "dc94d550-9538-48ff-b051-43562cdcf34e",
                  "scopeKey": "@tgxn/pushme",
                  "title": "",
                },
                "from": "367315174693",
                "messageId": "0:1630234055770633%0ac519e6f9fd7ecd",
                "messageType": null,
                "notification": null,
                "originalPriority": 2,
                "priority": 2,
                "sentTime": 1630234055767,
                "to": null,
                "ttl": 2419200,
              },
              "type": "push",
            },
          },
        },
      }
       */
       ```