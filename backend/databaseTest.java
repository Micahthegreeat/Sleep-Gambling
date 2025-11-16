package backend;
import java.io.FileNotFoundException;
import java.util.Random;

public class databaseTest {
    public static void main(String[] args) {
        Random r = new Random();
        System.out.println(Math.abs(r.nextLong()));

        database d = null;
        try{
            d = new database(5676545);
        } catch (FileNotFoundException e) {
            System.out.println(e.toString());

        }
       
       System.out.println(d.getJson()); 
       System.out.println(d.getShortJson()); 
       System.out.println(); 
       System.out.println(); 
       System.out.println(); 
       try{
            d = new database("John69");
        } catch (Exception e) {
            System.out.println(e.toString());

        }
       
       System.out.println(d.getJson()); 
       System.out.println(d.getShortJson()); 



       System.out.println(); 
       System.out.println(); 
       System.out.println(); 
       try{
            d = new database();
        } catch (Exception e) {
            System.out.println(e.toString());

        }
       System.out.println(d.salt);
       System.out.println(d.getJson()); 
       System.out.println(d.getShortJson()); 
    }



}
