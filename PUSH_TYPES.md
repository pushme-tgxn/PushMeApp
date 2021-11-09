# Push Types

## Simple Push

Simple push just has a message and a title.
No action will be performed on click.

**Webhook Payload**
```json
{
    title: "Notification Title",
    body: "Desc / Body",
    data: {},
}
```

## Interactive Push

Interactive push requires a type pre-defined within the application, the following actions are inbuilt and provide an action for each of the options listed.

This can call an outbound web service to acknowledge or action noticiations.

### Buttons

#### `button.yes_no` - Yes / No


#### `button.approve_deny` - Approve / Deny
#### `button.acknowledge` - Acknowledge
#### `button.open_link` - Open Link

## Input Field Plus..
#### `input.submit` - Submit
#### `input.reply` - Reply
#### `input.approve_deny` - Approve / Deny


**Webhook Payload**
```json
{
    title: "Notification Title",
    body: "Desc / Body",
    intent: "button.yes_no",
    data: {},
}
```