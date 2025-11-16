package backend;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class server {
    private static final String token = "token";
    private static final String username = "username";
    private static final String hash = "hash";
    private static final String pageRequest = "pagerequest";
    private static final String friendsRequest = "friendsrequest";

    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/index", new MyHandler());
        //server.createContext("/index/", new MyHandler());
        server.setExecutor(null); // Creates a default executor
        server.start();
        System.out.println("HTTP Server started on port " + port);
    }

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            Headers heads = t.getRequestHeaders();
            
            // Adds headers to allow for 2 servers to run on the same machine and talk to each other
            // Only neccessary for demonstration purposes, a real server wouldn't require this
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,  token, username, hash, pagerequest, friendsrequest");

            // Determine method 
            if (t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                // t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                // t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                // t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, token, username, hash, pagerequest, friendsrequest");
                t.sendResponseHeaders(200, -1); // MUST be 200 OK
                return;
            }
            if (t.getRequestMethod().equals("GET")) {
                handleGetRequest(t, heads);
                return;
            } else if (t.getRequestMethod().equals("POST")) {
                handlePostRequest(t, heads);
                return;
            }
            
            
            // We had an invalid request method
            t.sendResponseHeaders(400, 0);
            sendResponse(t, "");
        }

        private static void sendResponse(HttpExchange t, int code, String response) throws IOException {
            byte[] bytes = response.getBytes("UTF-8");
            t.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            t.sendResponseHeaders(code, bytes.length);
            OutputStream os = t.getResponseBody();
            os.write(bytes);
            os.close();
        }

        
        private static void sendResponse(HttpExchange t, String response) throws IOException{
            byte[] bytes = response.getBytes("UTF-8");
            t.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
            t.sendResponseHeaders(200, bytes.length); // default to 200 OK
            OutputStream os = t.getResponseBody();
            os.write(bytes);
            os.close();
        }

        private void handleGetRequest(HttpExchange t, Headers heads) throws IOException{

            

            // If token is there and valid, send data for requested page
            if (heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token)))) {

                

                // TODO: Send data for requested page in body
                if(!heads.containsKey(friendsRequest)){

                    database d = null;
                    try{
                        d = new database(Long.parseLong(heads.getFirst(token)));
                    } catch (Exception e) {
                        System.out.println(e.toString());

                    }

                    //sendResponse(t, 200, "{\"test\": true}");

                    String returningJson = d.getJson();
                    System.out.println(returningJson);

                    

                    sendResponse(t, 200, returningJson);
                    // t.sendResponseHeaders(206, returningJson.getBytes().length);
                    // sendResponse(t, returningJson);
                    return;
                }

            } else if (heads.containsKey(username) && auth.checkUsername(heads.getFirst(username))) {
                if (heads.containsKey(hash)) {
                    long newToken = auth.getToken(heads.getFirst(username), heads.getFirst(hash));

                    // Username and hash do not match
                    if (newToken == -1) {
                        sendResponse(t, 401, "");
                        return;
                    }

                    // We have a valid username and hash, so send a token
                    sendResponse(t, 201, String.valueOf(newToken));

                    return;
                } else {
                    sendResponse(t, 201, auth.getSalt(heads.getFirst(username)));
                    return ;

                }
            }
            
            // We didn't have valid token or we didn't have matching valid username and hash
            sendResponse(t, 401, "");
        }

        private void handlePostRequest(HttpExchange t, Headers heads) throws IOException{
            if (!(heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token))))) {
                // Send a 401, user needs to generate a token
                sendResponse(t, 401, "");
                return;
            }

            // TODO: Put our data into the database somehow

            sendResponse(t, 200, "");
        }
    }
}