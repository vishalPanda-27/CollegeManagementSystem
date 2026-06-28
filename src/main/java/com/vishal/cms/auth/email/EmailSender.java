package com.vishal.cms.auth.email;

public interface EmailSender {

    void send(String to, String email);

}