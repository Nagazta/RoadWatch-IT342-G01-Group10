package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class userEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String supabaseId; 
    
    private String username;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    @Transient 
    private String password;
    
    private String contact;
    
    @Enumerated(EnumType.STRING)
    private role role;
    
    public userEntity() {}
    
    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getSupabaseId() { 
        return supabaseId; 
    }
    
    public void setSupabaseId(String supabaseId) { 
        this.supabaseId = supabaseId; 
    }
    
    public String getUsername() { 
        return username; 
    }
    
    public void setUsername(String username) { 
        this.username = username; 
    }
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }
    
    public String getPassword() { 
        return password; 
    }
    
    public void setPassword(String password) { 
        this.password = password; 
    }
    
    public String getContact() { 
        return contact; 
    }
    
    public void setContact(String contact) { 
        this.contact = contact; 
    }
    
    public role getRole() { 
        return role; 
    }
    
    public void setRole(role role) { 
        this.role = role; 
    }
}