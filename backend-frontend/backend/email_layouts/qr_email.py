
def email_layout(qr_code, media_root, front_end_root, secret_key):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr style="background-color: #f2edae;">
            <td style="padding: 20px; text-align: center;">
                <img src="https://ugem.app/assets/ugem-logo-D5_rOqog.png" alt="uGem" width="100" style="vertical-align: middle;">
                <h1 style="color: #333; font-size: 24px; margin-top: 20px;">Welcome to uGem!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #fff;">
                <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
                    Thank you for joining us! Below is your QR code to access our services:
                </p>
                <!-- Replace 'src' with the actual src of your QR code image -->
                <img src="{media_root}{qr_code}" alt="QR Code" width="200" style="margin-bottom: 20px;">
            </td>
        </tr>
        <tr style="background-color: #f2edae; color: #333;">
            <td style="text-align: center; padding: 10px; font-size: 14px;">
                Follow us on
                <a href="https://ugem.app/" style="color: #333; text-decoration: none; font-weight: bold;">Social Media</a>
            </td>
        </tr>
    </table>
</body>
</html>'''
