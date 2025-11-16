package backend;

import java.util.NoSuchElementException;
import java.util.Random;
import java.time.Instant;

public class auth {
    public static boolean checkToken(long token){
        try{
            new database(token);
            return true;
        }catch(Exception e){
            return false;
        }
        
    }

    public static boolean checkUsername(String username) {
        try{
            new database(username);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public static String getSalt(String username) {
        try{
            database d = new database(username);
            return d.salt;
        }catch(Exception e){
            return null;
        }
    }

    public static long getToken(String username, String hash) {
        database d;
        try{
            d = new database(username);
        }catch(Exception e){
            return -1;
        }
        d.hash.equals(hash);
        Instant now = Instant.now();
        Random rand = new Random();
        long token = Math.abs(rand.nextLong());
        try{
            database.addToken(token, username, now.getEpochSecond());
            return token;
        } catch (Exception e) {
            return -1;
        }
    }

    
}