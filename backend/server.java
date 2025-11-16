package backend;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
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

            // If token is there and valid, send data for requested page
            if (heads.containsKey(token) && auth.checkToken(Integer.parseInt(heads.getFirst(token)))) {
                // Send data for requested page in body
            } else if (heads.containsKey(username) && auth.checkUsername(heads.getFirst(username))) {
                // Validate hash
                // Send token
                // Otherwise, send 401
            } else {
                // Send 401
            }
        }
    }
}