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

            // If token is there and valid, send data for requested page
            if (heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token)))) {
                // Send data for requested page in body
            } else if (heads.containsKey(username) && auth.checkUsername(heads.getFirst(username))) {
                // Validate hash
                // Send token
            }
            
            // We didn't have valid token or we didn't have matching valid username and hash
            t.sendResponseHeaders(401, 0);
            sendResponse(t, "");
        }

        private static void sendResponse(HttpExchange t, String response) throws IOException{
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}