package backend;
import java.util.NoSuchElementException;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.time.Instant;
import java.io.PrintWriter;
import java.util.ArrayList;

public class database {

    public long currWeek;

    public int[] weekSleep; 

    public int points;

    public int bedtime;

    public ArrayList<String> items;

    public ArrayList<Integer> itemCount;

    public String username;

    public String salt;

    public String hash;

    public database(String username) throws NoSuchElementException {
        try{
            constructionHelper(username);
        } catch(FileNotFoundException e) {
            throw new NoSuchElementException();
        }
    }

    public database(long token) throws NoSuchElementException, FileNotFoundException{
        File f = new File("DatabaseSuper\\tokens");
        Scanner s = new Scanner(f);
        while (s.hasNextLine()) {
            Scanner s2 = new Scanner(s.nextLine());
            long currCheckingToken = s2.nextLong();
            String currCheckingUsername = s2.next();
            long currCheckingSec = s2.nextLong();
            if(token == currCheckingToken && sameDay(currCheckingToken)) {
                sameDay(currCheckingSec);
                try{
                    constructionHelper(currCheckingUsername);
                } catch(FileNotFoundException e) {
                    throw new NoSuchElementException();
                }
                
                s.close();
                s2.close();
                return;
            }
            s2.close();
        }
        s.close();
        throw new NoSuchElementException();
    }
    
    private void constructionHelper(String username) throws FileNotFoundException{
        boolean needToUpdateBcWeek;
        this.username = username;
        String filepath = "DatabaseSuper\\Database\\" + username; 
        File f = new File(filepath);
        Scanner s = new Scanner(f);
        
        //get salt and hash
        Scanner s2 = new Scanner(s.nextLine());
        salt = s2.next();
        hash = s2.next();
        s2.close();

        //get week number and points
        s2 = new Scanner(s.nextLine());
        needToUpdateBcWeek = s2.nextLong() == currWeek();
        currWeek = currWeek();
        if (!needToUpdateBcWeek){
            points = s2.nextInt();
        } else {
            points = 0;
        }
        s2.close();

        //get bedtime
        bedtime = Integer.parseInt(s.nextLine());

        if (!needToUpdateBcWeek){
            s2 = new Scanner(s.nextLine());
            int[] currWeekSleep= {s2.nextInt(), s2.nextInt(), s2.nextInt(), s2.nextInt(), s2.nextInt(), s2.nextInt(), s2.nextInt()};
            weekSleep = currWeekSleep;
            s2.close();
        } else {
            s.nextLine();
            weekSleep = new int[7];
        }
        items = new ArrayList<String>();
        itemCount = new ArrayList<Integer>();
        while(s.hasNextLine()){
            s2 = new Scanner(s.nextLine());
            items.add(s2.next());
            itemCount.add(s2.nextInt());
            s2.close();
        }
        if(needToUpdateBcWeek) {
            writeToFile();
        }
    }

    private void writeToFile() {
        String toBeWritten = 
            salt + " " + hash + "\n" +
            currWeek + " " + points + "\n" +
            bedtime + "\n" + 
            weekSleep[0] + " " + weekSleep[1] + " " + weekSleep[2] + " " + weekSleep[3] + " " + weekSleep[4] + " " + weekSleep[5] + " " + weekSleep[6] + " ";
        for(int i = 0; i < items.size(); i ++) {
            toBeWritten += "\n" + items.get(i) + " " + itemCount.get(i);
        }
        File f = new File("DatabaseSuper\\Database\\" + username);
        try(PrintWriter p = new PrintWriter(f)){
            
            p.println(toBeWritten);
            p.close();
        }catch( Exception e){

        }

    }

    private static long currSec() {
        Instant now = Instant.now();

        // Get the seconds since epoch
        return now.getEpochSecond();
    }

    private static boolean sameDay(long givenSec) {
        return currSec() - givenSec > 86400;
    }

    private static boolean sameWeek(long givenWeek) {
        return givenWeek == currWeek();
    }

    private static long currWeek() {
        return currSec() / 604800;
    }

    public void setBedtime(int bedTime) {
        this.bedtime = bedTime;
        writeToFile();
    }
    
    public void setSleep(int day, int sleepMinutes) {
        this.weekSleep[day] = sleepMinutes;
        writeToFile();
    }

    public static void addToken(long token, String username, long currTime) throws FileNotFoundException{
        ArrayList<String> tokenCurrent = new ArrayList<String>();
        File f = new File("DatabaseSuper\\tokens");
        Scanner s = new Scanner(f);
        while(s.hasNextLine()) {
            tokenCurrent.add(s.nextLine());
        }
        s.close();
        try(PrintWriter p = new PrintWriter(f)){
            for(int i = 0; i < tokenCurrent.size(); i ++) {
                p.println(tokenCurrent.get(i));
            }
            String nextAddition = token + " " + username + " " + currTime;
            p.println(nextAddition);
            p.close();

        }catch( Exception e){
            throw e;
        }
    }
}
