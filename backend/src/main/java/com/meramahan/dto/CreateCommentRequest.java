package com.meramahan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String text;

    public CreateCommentRequest() {}

    public CreateCommentRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
