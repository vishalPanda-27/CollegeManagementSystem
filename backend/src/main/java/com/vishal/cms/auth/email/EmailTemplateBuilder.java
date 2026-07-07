package com.vishal.cms.auth.email;

import org.springframework.stereotype.Component;

@Component
public class EmailTemplateBuilder {

    public String buildVerificationEmail(
            String username,
            String verificationLink
    ) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                </head>

                <body style="
                    margin:0;
                    padding:40px 0;
                    background-color:#f4f6f9;
                    font-family:Arial,sans-serif;
                ">

                <table
                    width="100%%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                >
                    <tr>
                        <td align="center">

                            <table
                                width="600"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    background:#ffffff;
                                    border-radius:12px;
                                    overflow:hidden;
                                    box-shadow:0 2px 8px rgba(0,0,0,0.1);
                                "
                            >

                                <tr>
                                    <td
                                        style="
                                            background:#0d6efd;
                                            color:#ffffff;
                                            text-align:center;
                                            padding:24px;
                                            font-size:28px;
                                            font-weight:bold;
                                        "
                                    >
                                        College Management System
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:40px;">

                                        <h2 style="
                                            margin-top:0;
                                            color:#212529;
                                        ">
                                            Welcome, %s!
                                        </h2>

                                        <p style="
                                            color:#495057;
                                            line-height:1.6;
                                        ">
                                            Thank you for registering with
                                            the College Management System.
                                        </p>

                                        <p style="
                                            color:#495057;
                                            line-height:1.6;
                                        ">
                                            Please verify your email address
                                            to activate your account and gain
                                            access to all features.
                                        </p>

                                        <div style="
                                            text-align:center;
                                            margin:40px 0;
                                        ">

                                            <a
                                                href="%s"
                                                style="
                                                    background:#0d6efd;
                                                    color:#ffffff;
                                                    text-decoration:none;
                                                    padding:14px 28px;
                                                    border-radius:8px;
                                                    display:inline-block;
                                                    font-weight:bold;
                                                    font-size:16px;
                                                "
                                            >
                                                Verify Email
                                            </a>

                                        </div>

                                        <p style="
                                            color:#495057;
                                            line-height:1.6;
                                        ">
                                            If the button above doesn't work,
                                            copy and paste the following link
                                            into your browser:
                                        </p>

                                        <p style="
                                            background:#f8f9fa;
                                            border:1px solid #dee2e6;
                                            border-radius:8px;
                                            padding:12px;
                                            word-break:break-all;
                                            color:#0d6efd;
                                        ">
                                            %s
                                        </p>

                                        <p style="
                                            color:#dc3545;
                                            font-weight:bold;
                                        ">
                                            This verification link will expire
                                            in 15 minutes.
                                        </p>

                                        <hr style="
                                            border:none;
                                            border-top:1px solid #dee2e6;
                                            margin:30px 0;
                                        ">

                                        <p style="
                                            color:#6c757d;
                                            font-size:14px;
                                            line-height:1.6;
                                        ">
                                            If you did not create this account,
                                            you can safely ignore this email.
                                        </p>

                                        <p style="
                                            color:#6c757d;
                                            font-size:12px;
                                        ">
                                            This is an automated message.
                                            Please do not reply.
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

                </body>
                </html>
                """.formatted(
                username,
                verificationLink,
                verificationLink
        );
    }
}