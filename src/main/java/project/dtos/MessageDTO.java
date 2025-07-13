package project.dtos;

public class MessageDTO {
    private String messagetext;
    private String email;
    private String name;

    public MessageDTO(String messagetext, String email, String name) {
        this.messagetext = messagetext;
        this.email = email;
        this.name = name;
    }

    public String getMessagetext() {
        return messagetext;
    }
    public void setMessagetext(String messagetext) {
        this.messagetext = messagetext;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
