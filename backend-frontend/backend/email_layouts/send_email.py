from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_email_with_attachment(subject, body, html_body, recipient_list):
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list,
    )

    email.attach_alternative(html_body, "text/html")

    # Send the email
    email.send()


def send_business_qr(subject, body, html_body, recipient_list, file_path):
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list,
    )

    #     # Add an attachment
    with open(file_path, 'rb') as f:
        email.attach(filename=file_path.split('/')[-1], content=f.read(), mimetype='application/vnd.apple.pkpass')

    email.attach_alternative(html_body, "text/html")

    # Send the email
    email.send()


def send_password_recovery_link(subject, body, html_body, recipient_list):
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list,
    )

    # Add an attachment

    email.attach_alternative(html_body, "text/html")

    # Send the email
    email.send()
