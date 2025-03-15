import winston from 'winston'
import path from 'path'
import fs from 'node:fs'

// 创建日志目录（如果不存在）
const logDir = path.join("logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


// 配置 winston
export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, "log.txt") }),
    ],
});

