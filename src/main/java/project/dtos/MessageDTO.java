package project.dtos;

public class MessageDTO {
    private String messageText;
    private String email;
    private String name;

    public MessageDTO(String messagetext, String email, String name) {
        this.messageText = messagetext;
        this.email = email;
        this.name = name;
    }

    public String getMessageText() {
        return messageText;
    }
    public void setMessageText(String messageText) {
        this.messageText = messageText;
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
