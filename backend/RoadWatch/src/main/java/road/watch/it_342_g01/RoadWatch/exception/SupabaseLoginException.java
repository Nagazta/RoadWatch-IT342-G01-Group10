package road.watch.it_342_g01.RoadWatch.exception;

public class SupabaseLoginException extends RuntimeException {
    
    public SupabaseLoginException(String message) {
        super(message);
    }
    
    public SupabaseLoginException(String message, Throwable cause) {
        super(message, cause);
    }
}