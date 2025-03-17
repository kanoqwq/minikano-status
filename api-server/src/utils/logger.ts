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
        new winston.transports.File({
            filename: path.join(logDir, "log.txt"),
            maxsize: 10 * 1024 * 1024,  // 最大日志文件大小：10MB
            maxFiles: 5,  // 保留的最大日志文件数量
            tailable: true,  // 如果设置为 true，将始终将日志写入最新文件
        }),
    ],
});

