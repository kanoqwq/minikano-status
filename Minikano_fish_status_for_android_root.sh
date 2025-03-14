#!/bin/bash

kano_device_name="kano 的 OnePlus 11 📱"
kano_battery_info=$(dumpsys battery)
kano_screen_info=$(dumpsys power | awk -F'=' '/mWakefulness=/ {print $2}' | tr -d ' ')
kano_wifi_info=$(cmd wifi status | grep -q "Wifi is connected to" && echo "Wifi is connected to" || true)
kano_cellular_info=$(dumpsys connectivity)
kano_current_using_package_name=$(dumpsys window | grep mCurrentFocus | awk -F '[ /}]' '{print $5}')


kano_cellular_status=$(echo "$kano_cellular_info" | grep -E "NetworkAgentInfo.*MOBILE" | grep "CONNECTED" | awk '{print "connected"}')
kano_network_type=$(echo "$kano_cellular_info" | grep -E "NetworkAgentInfo.*MOBILE" | awk -F'\\[|\\]' '{print $2}')

kano_battery_level=$(echo "$kano_battery_info" | awk -F': ' '/level:/ {print $2}')
kano_charge_current=$(echo "$kano_battery_info" | awk -F': ' '/Battery current :/ {print $2}')
kano_temperature_raw=$(echo "$kano_battery_info" | awk -F': ' '/temperature:/ {print $2}')
kano_temperature=$(echo "scale=1; $kano_temperature_raw / 10" | bc)  # 转换为摄氏度，保留一位小数

kano_charge_fast=$(echo "$kano_battery_info" | awk -F': ' '/ChargeFastCharger:/ {print $2}')
kano_ac_powered=$(echo "$kano_battery_info" | awk -F': ' '/AC powered:/ {print $2}')
kano_usb_powered=$(echo "$kano_battery_info" | awk -F': ' '/USB powered:/ {print $2}')

kano_charging_status="false"
kano_charging_text=""  # 显式初始化为空字符串
if [ "$kano_charge_fast" = "true" ]; then
    kano_charging_status="true"
    kano_charging_text="超级闪充⚡⚡"
elif [ "$kano_ac_powered" = "true" ] || [ "$kano_usb_powered" = "true" ]; then
    kano_charging_status="true"
fi

kano_screen_status="false"
[ "$kano_screen_info" = "Awake" ] && kano_screen_status="true"

kano_wifi_status="disconnected"
[[ "$kano_wifi_info" = "Wifi is connected to" ]] && kano_wifi_status="connected"

# 转换类型值为可读格式
kano_cellular_network=""
case "$kano_network_type" in
    LTE) kano_cellular_network="4G" ;;
    NR) kano_cellular_network="5G" ;;
    *) kano_cellular_network="" ;;
esac

# 定义请求参数
API_URL="??"
TOKEN="??"

# 构建JSON时确保所有字符串字段正确引用
JSON_DATA="[{
  \"name\": \"$kano_device_name\",
  \"type\": \"phone\",
  \"isOnline\": true,
  \"detail\": {
    \"isCharging\": $kano_charging_status,
    \"chargingText\": \"$kano_charging_text\",
    \"battery\": $kano_battery_level,
    \"batteryCurrent\": $kano_charge_current,
    \"batteryTemperature\": ${kano_temperature/10},
    \"isScreenOn\": $kano_screen_status,
    \"wifiStatus\": \"$kano_wifi_status\",
    \"currentPageTabTitle\":\"$kano_current_using_package_name\",
    \"cellularStatus\": \"$kano_cellular_network${kano_cellular_status:-disconnected}\"
  }
}]"

response=$(curl -s -X POST \
  -H "Content-Type:application/json" \
  -H "token:$TOKEN" \
  -d "$JSON_DATA" \
  "$API_URL")

# 输出结果
echo "电池电量: ${kano_battery_level}"
echo "电流值: ${kano_charge_current}mA"
echo "充电状态: ${kano_charging_status}"
echo "电池温度: ${kano_temperature/10}"
echo "屏幕状态: ${kano_screen_status}"
echo "WiFi状态: ${kano_wifi_status}"
echo "当前使用应用程序: ${kano_current_using_package_name}"
echo "蜂窝网络状态: ${kano_cellular_network:-unknown} ${kano_cellular_status:-disconnected}"

# 处理响应
echo "服务器响应："
echo "$response"