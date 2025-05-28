#!/system/bin/sh

# 获取 dumpsys media_session 输出
session=$(dumpsys media_session)

# 提取网易云播放块
cloudmusic=$(echo "$session" | awk '/MediaSession com.netease.cloudmusic\/MediaSession/ {in_block=1} in_block && /MediaSession / && !/com.netease.cloudmusic/ {in_block=0}  in_block {print}')

# 提取 metadata 行
desc_line=$(echo "$cloudmusic" | grep "metadata: size=" | head -n1)

# 提取 description 内容（避免 null）
description=$(echo "$desc_line" | sed -n 's/.*description=\([^,]*\), *\([^,]*\).*/\1 - \2/p')

# 输出结果
echo "🎵 歌曲信息: $description"