package com.vishal.cms.exceptions;

public class TimetableNotFoundException extends RuntimeException {
    public TimetableNotFoundException(String message) {
        super(message);
    }
}
