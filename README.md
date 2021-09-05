# Push Me

A simple application + web server to push interactive notifications to yourself or others.

## Installation

Install APK from somewhere...


## Usage

This app does nothing on it's own, only allowing registration and enrolment.

Use the web service along with your username to choose a device and push a notification to it.

API Docs can be found on the server.

## Features

Push Types:

### Simple Push

Simple push just has a message and a title.
No action will be performed on click.

**Webhook Payload**
```json
{
    title: "Notification Title",
    description: "Desc / Body",
}
```

### Interactive Push

Interactive push requires a type pre-defined within the application, the following actions are inbuilt and provide an action for each of the options listed.

This can call an outbound web service to acknowledge or action noticiations.

#### Buttons
button.yes_no - Yes / No
button.approve_deny - Approve / Deny
button.acknowledge - Acknowledge
button.open_link - Open Link

### Input Field Plus..
input.submit - "Submit"
input.reply - "Reply"
input.approve_deny - "Approve" & "Deny"


**Webhook Payload**
```json
{
    title: "Notification Title",
    description: "Desc / Body",
    intent: "button.yes_no",
}
```

## License

MIT

Icon `notification by Viktor Ostrovsky from the Noun Project`
https://thenounproject.com/term/notification/315894/

