# def business_verification_link(front_end_root, code, media_host):
#     return f'''<!DOCTYPE html>
# <html lang="en">
# <head>
# <meta charset="UTF-8">
# <meta name="viewport" content="width=device-width, initial-scale=1.0">
# </head>
# <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
#     <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
#         <tr style="background-color: #f2edae;">
#             <td style="padding: 20px; text-align: center;">
#                 <img src="https://ugem.app/assets/ugem-logo-D5_rOqog.png" alt="uGem" width="100" style="vertical-align: middle;">
#                 <h1 style="color: #333; font-size: 24px; margin-top: 20px;">Welcome to uGem!</h1>
#             </td>
#         </tr>
#         <tr>
#             <td style="padding: 20px; text-align: center; background-color: #fff;">
#                 <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
#                     Thank you for joining us! Please press on "VERIFY" below to finish your email verification:
#                 </p>
#                 <p style="color: #555; font-size: 16px;">
#                     <a href="{front_end_root}/verify-business-email/{code}"
#                     style="color: #333; text-decoration: none; font-weight: bold;">VERIFY</a>
#                 </p>
#             </td>
#         </tr>
#         <tr style="background-color: #f2edae; color: #333;">
#             <td style="text-align: center; padding: 10px; font-size: 14px;">
#                 Follow us on
#                 <a href="https://ugem.app/" style="color: #333; text-decoration: none;
#                 font-weight: bold;">Social Media</a>
#             </td>
#         </tr>
#     </table>
# </body>
# </html>'''

def business_verification_link(front_end_root, code):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }}
        table {{
            width: 100%;
            border-spacing: 0;
        }}
        .header {{
            background-color: #f2edae;
            text-align: center;
            padding: 20px;
        }}
        .content {{
            margin-top: 20px;
            padding: 20px;
            background-color: #ffffff;
            text-align: center;
        }}
        .footer {{
            background-color: #f2edae;
            color: #333;
            text-align: center;
            padding: 10px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 20px;
            background-color: #453f4d;
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 4px;
            margin-top: 20px;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <table role="presentation">
        <tr class="header">
            <td>
                <img src="https://ugem.app/assets/ugem-logo-D5_rOqog.png"
                alt="uGem" width="100" style="vertical-align: middle;">
                <h1 style="color: #333; margin-top: 20px;">Welcome to uGem!</h1>
            </td>
        </tr>
        <tr class="content">
            <td>
                <p style="color: #555; font-size: 16px;">
                Thank you for joining us! To complete your registration, please click the button below to verify your email address:
                </p>
                <a href="{front_end_root}/verify-business-email/{code}" class="button">Verify Your Email</a>
            </td>
        </tr>
        <tr class="footer">
            <td>
                <p style="font-size: 14px; color: #555;">If you didn't register for uGem, please ignore this email.</p>

            </td>
        </tr>
    </table>
</body>
</html>'''

# <p>Follow us on <a href="https://ugem.app/" style="color: #333; text-decoration: none;">Social Media</a>.</p>
