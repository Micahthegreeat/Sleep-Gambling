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
    /*
     * array list of their usernames
     */
    public ArrayList<String> friends;

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
                    s2.close();
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




        String currentDirectoryPath = System.getProperty("user.dir");
        File currentDirectory = new File(currentDirectoryPath + "\\backend\\DatabaseSuper\\Database");

        // Get all files and directories in the current directory
        File[] files = currentDirectory.listFiles();

        if (files != null) {
            System.out.println("Files and directories in the current directory:");
            for (File file : files) {
                if (file.isFile()) {
                    System.out.println("File: " + file.getName());
                } else if (file.isDirectory()) {
                    System.out.println("Directory: " + file.getName());
                }
            }
        } else {
            System.out.println("Could not list files in the current directory.");
        }



        
        String filepath = "backend\\DatabaseSuper\\Database\\" + username + ".txt"; 
        System.out.println(username + "\n" + filepath);
        File f = new File(filepath);
        Scanner s = new Scanner(f);
        System.out.println("124");
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

        this.friends = new ArrayList<String>(); //TODO


        if(needToUpdateBcWeek) {
            writeToFile();
        }




        s.close();
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

    public void setPoints(int day, int points) {
        this.points = points;
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

    public String getJson() {
        String returnable = "{\"username\" : \"" + username + "\", " +
        "\"week\" : " + currWeek + ", " +
        "\"points\" : " + points + ", " + 
        "\"bedtime\" : " + bedtime + ", " + 
        "\"week\" : [" + weekSleep[0] + ", " + weekSleep[1] + ", " + weekSleep[2] + ", " + weekSleep[3] + ", " + weekSleep[4] + ", " + weekSleep[5] + ", " + weekSleep[6] + "], " +
        "\"items\" : {";
        for(int i = 0; i < items.size(); i ++) {
            returnable += "\"" + items.get(i) + "\" :  " + itemCount.get(i);
            if(i != items.size() - 1) {
                returnable +=", ";
            } 
        }
        returnable += "}, \"friends\" : [";

        for(int i = 0; i < friends.size(); i ++) {
            /*returnable += "\"" + items.get(i) + "\" :  " + itemCount.get(i);
            if(i != items.size() - 1) {
                returnable +=", ";
            } */
           returnable += "\"" + friends.get(i) + "\"";
           if(i != items.size() - 1) {
                returnable +=", ";
            }
        }
        /*
    },
    "friends" : ["friendNum", "friendNum"]
    }*/
        returnable += "]}";
        return returnable;
    }
    public String getShortJson() {
        return "{\"username\" : \"" + username + "\", " +
        "\"points\" : " + points + "}";
    }
}
