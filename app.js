const pmx = require('pmx');
const path = require('path');
const fs = require('fs');
const log = console.log;
const conf = pmx.initModule(
    {
        // Override PID to be monitored
        pid: pmx.resolvePidPaths(['/var/run/redis.pid'])
    },
    function (err, config) {
        // Now the module is initialized
        const { maxLogs, interval, logPath, pattern } = config;
        const logNameReg = new RegExp(pattern);
        let timer = null;

        clean();
        watch();

        function clean() {
            fs.readdir(logPath, 'utf-8', (err, data) => {
                if (err) {
                    log(`Read Logs Error - ${err}`);
                    return;
                }
                const logs = data
                    .filter(filename => logNameReg.test(filename))
                    .map(logName => {
                        const [prefix, dateTime, suffix] = logName.split('.');
                        const [year, month, date] = dateTime
                            .split('-')
                            .map(v => +v);
                        return {
                            filename: logName,
                            prefix,
                            year,
                            month,
                            date,
                            suffix
                        };
                    });
                if (logs.length > maxLogs) {
                    log(
                        `LogSchedule - maxLogs/${maxLogs},existLogs/${logs.length},clean...`
                    );
                    // log按创建时间排序，删除最后创建的保留最新的log
                    logs.sort((a, b) => b.date - a.date)
                        .sort((a, b) => b.month - a.month)
                        .sort((a, b) => b.year - a.year);

                    for (let i = logs.length; i > maxLogs; i--) {
                        const curLog = logs[i - 1];
                        fs.unlink(path.join(logPath, curLog.filename), err => {
                            if (err) {
                                log(
                                    `LogSchedule - file ${curLog.filename} delete Faild`
                                );
                                return;
                            }
                            log(
                                `LogSchedule - file ${curLog.filename} delete successed`
                            );
                        });
                    }
                } else {
                    log(
                        `LogSchedule - maxLog/${maxLogs},existLogs/${logs.length},do not clean.`
                    );
                }
            });
        }

        function watch() {
            timer && clearInterval(timer);
            timer = setInterval(clean, interval * 24 * 60 * 60 * 1000);
        }
    }
);
