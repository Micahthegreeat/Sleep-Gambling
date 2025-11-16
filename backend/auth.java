package backend;

public class auth {
    public static boolean checkToken(long token){
        return false;
    }

    public static boolean checkUsername(String username) {
        return false;
    }

    public static boolean checkHash(String hash) {
        return false;
    }

    public static String getSalt(String username) {
        return "";
    }

    public static long getToken(String username, String hash) {
        // We reserve -1 for a non matching username and hash
        return -1;
    }

    
}