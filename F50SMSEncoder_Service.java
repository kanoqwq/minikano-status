import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class F50SMSEncoder_Service {
    @SuppressWarnings({ "rawtypes", "unchecked" })
    private static final Set<String> specialCharsIgnoreWrap = new HashSet();

    public static String decodeMessage(String str) {
        if (str == null || str.isEmpty()) {
            return "";
        }
        Set<String> set = specialCharsIgnoreWrap;
        Matcher matcher = Pattern.compile("([A-Fa-f0-9]{1,4})").matcher(str);
        StringBuffer stringBuffer = new StringBuffer();
        while (matcher.find()) {
            String group = matcher.group(1);
            if (!set.contains(group)) {
                matcher.appendReplacement(stringBuffer, hex2char(group));
            } else {
                matcher.appendReplacement(stringBuffer, "");
            }
        }
        matcher.appendTail(stringBuffer);
        return stringBuffer.toString();
    }

    public static String hex2char(String str) {
        StringBuilder sb = new StringBuilder();
        int parseInt = Integer.parseInt(str, 16);
        if (parseInt <= 65535) {
            sb.append((char) parseInt);
        } else if (parseInt <= 1114111) {
            int i = parseInt - 65536;
            sb.append((char) (55296 | (i >> 10))).append((char) ((i & 1023) | 56320));
        }
        return sb.toString();
    }

    public static void main(String[] strArr) {
        System.out.println(decodeMessage("4f60597dff0c8fd9662f4e0067616d4b8bd56d88606fff0c676581ea4e2d5174004600350030002d002d0074006500730074006100620063003100320033"));
    }
}