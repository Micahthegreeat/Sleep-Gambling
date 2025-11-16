package backend;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class server {
    private static final String token = "token";
    private static final String username = "username";
    private static final String hash = "hash";
    private static final String pageRequest = "pagerequest";

    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/index/", new MyHandler());
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
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            // Determine method 
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

        private static void sendResponse(HttpExchange t, String response) throws IOException{
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        private void handleGetRequest(HttpExchange t, Headers heads) throws IOException{
            // If token is there and valid, send data for requested page
            if (heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token)))) {

                // TODO: Send data for requested page in body

            } else if (heads.containsKey(username) && auth.checkUsername(heads.getFirst(username))) {
                if (heads.containsKey(hash) && auth.checkHash(heads.getFirst(hash))) {
                    // We have a valid username and hash, so send a token
                    t.sendResponseHeaders(201, 0);
                    sendResponse(t, String.valueOf(auth.getToken(heads.getFirst(username))));
                    return;
                }
            }
            
            // We didn't have valid token or we didn't have matching valid username and hash
            t.sendResponseHeaders(401, 0);
            sendResponse(t, "");
        }

        private void handlePostRequest(HttpExchange t, Headers heads) throws IOException{
            if (!(heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token))))) {
                // Send a 401, user needs to generate a token
                t.sendResponseHeaders(401, 0);
                sendResponse(t, "");
                return;
            }

            // TODO: Put our data into the database somehow

            t.sendResponseHeaders(200, 0);
            sendResponse(t, "");
        }
    }
}