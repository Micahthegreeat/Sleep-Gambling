package backend;

public class databaseTest {
    public static void main(String[] args) {
       database d = new database("John69");
       System.out.println(d.getJson()); 
       System.out.println(d.getShortJson()); 
    }
}
