## Description:
Regular cleanup service log,every time the Module service is started

PM2 module to automatically clear logs


# pm2-log-schedule

## Install

```bash
$ npm install pm2 -g

$ pm2 install pm2-log-schedule
```

## Configuration

*   `maxLogs` (Defaults to `10`) The maximum number of logs in your server log directory
*   `logPath` (Defaults to `/home/web/logs`) Define log path on the server
*   `pattern` (Defaults to `\\d{4}-\\d{2}-\\d{2}\\.log`) Log name that needs to be extracted
*   `interval` (Defaults to `7`) leaning the cycle of the log


#### How to set these values ?

e.g:
- `pm2 set pm2-log-schedule:interval 10` (Interval 7 days)

## Uninstall

```bash
$ pm2 uninstall pm2-log-schedule
```

# License

MIT
