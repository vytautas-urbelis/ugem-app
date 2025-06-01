from aioapns import APNs, NotificationRequest

from apple_cards.collector_card_points import create_collector_card_points
from apple_cards.collector_card_stamps import create_collector_card_stamps
from apple_cards.collector_to_voucher_card import collector_to_voucher
from apple_cards.customer_card import create_customer_card
from apple_cards.voucher_to_used_card import voucher_to_used
from voucher_card.models import VoucherCard


async def send_push_token(push_token, pass_id):
    try:
        apns_cert_client = APNs(
            client_cert='apple_cards/push_notification/passupdate.pem',
            use_sandbox=False,
        )
        apns_key_client = APNs(
            key='apple_cards/push_notification/AuthKey_NZDYR2KBK2.p8',
            key_id='NZDYR2KBK2',
            team_id='5MJ649KLV6',
            # topic='pass.ch.swiftybee',  # Bundle ID
            topic=pass_id,
            use_sandbox=False,
        )
        request = NotificationRequest(
            # device_token='c3485f24c6e69a7ae2cdc7e8d915690ea7745de30b785435eb1c8e0414e94d1c',
            device_token=push_token,

            message={
                "aps": {
                    "alert": "Your pass was updated",
                    "badge": "1",
                }
            },
            # notification_id=str(uuid4()),  # optional
            # time_to_live=3,  # optional
            # push_type=PushType.ALERT,  # optional
        )
        response = await apns_cert_client.send_notification(request)
        print("Certificate response:", response)
        response2 = await apns_key_client.send_notification(request)
        print("Token response:", response2)
    except Exception as e:
        print("An error occurred:", e)


# loop = asyncio.get_event_loop()
# loop.run_until_complete(run())

# asyncio.run(send_push_token('c3485f24c6e69a7ae2cdc7e8d915690ea7745de30b785435eb1c8e0414e94d1c', 'pass.ch.swiftybee'))
#


# import ssl
# print(ssl._ssl._test_decode_cert('push_notification/passupdate.pem'))


def update_customer_card(customer_user_profile):
    customer_card = customer_user_profile.customer_card
    nickname = customer_user_profile.nickname
    secret_key = customer_user_profile.secret_key
    customer_id = customer_user_profile.user.id
    serial_nr = customer_card.serial_nr
    to_qr = customer_card.to_qr
    response = create_customer_card(nickname, serial_nr, to_qr, secret_key, customer_id)

    return response


def update_voucher_card(voucher_card, customer_user_profile):
    # Attempt to send an email with the QR code
    nickname = customer_user_profile.nickname
    secret_key = customer_user_profile.secret_key
    customer_id = customer_user_profile.user.id
    business_name = voucher_card.business_name
    serial_nr = voucher_card.serial_nr
    voucher_id = voucher_card.id
    response = voucher_to_used(nickname, serial_nr, business_name, voucher_id, secret_key, customer_id)

    return response


def update_collector_card_stamps(collector_card):
    campaign_name = collector_card.campaign_name
    business_name = collector_card.business_name
    strip_img = collector_card.strip_img
    collector_id = collector_card.id
    nickname = collector_card.customer_user_profile.nickname
    secret_key = collector_card.customer_user_profile.secret_key
    customer_id = collector_card.customer_user_profile.user.id
    serial_nr = collector_card.serial_nr

    # If collector is already collected but still not used, we are converting collector to voucher
    if strip_img == 10 and not collector_card.is_used:
        voucher_card = VoucherCard.objects.get(collector_card=collector_card)
        voucher_to_qr = voucher_card.to_qr
        response = collector_to_voucher(nickname, serial_nr, voucher_to_qr, campaign_name, business_name,
                                        collector_id, secret_key, customer_id)

    # If collector is already collected and used we are converting voucher to used voucher
    elif collector_card.strip_img == 10 and collector_card.is_used:
        voucher_card = VoucherCard.objects.get(collector_card=collector_card)
        used_date = voucher_card.date_used
        str_date = used_date.strftime('%d %B %Y')
        response = voucher_to_used(nickname, serial_nr, business_name, collector_id, secret_key, customer_id, str_date)

    # in this case collector is still collecting stamps, we are updating collector
    else:
        to_qr = collector_card.to_qr
        response = create_collector_card_stamps(nickname, serial_nr, to_qr, campaign_name, business_name, strip_img,
                                                collector_id, secret_key, customer_id)

    return response


def update_collector_card_points(collector_card, collector_type):
    campaign_name = collector_card.campaign_name
    business_name = collector_card.business_name
    value_counted = collector_card.value_counted
    value_goal = collector_card.value_goal
    collector_id = collector_card.id

    nickname = collector_card.customer_user_profile.nickname
    secret_key = collector_card.customer_user_profile.secret_key
    customer_id = collector_card.customer_user_profile.user.id
    serial_nr = collector_card.serial_nr
    to_qr = collector_card.to_qr

    # If collector is already collected but still not used, we are converting collector to voucher
    if value_goal <= value_counted and not collector_card.is_used:
        voucher_card = VoucherCard.objects.get(collector_card=collector_card)
        voucher_to_qr = voucher_card.to_qr
        response = collector_to_voucher(nickname, serial_nr, voucher_to_qr, campaign_name, business_name,
                                        collector_id, secret_key, customer_id)

    # If collector is already collected and used we are converting voucher to used voucher
    elif value_goal <= value_counted and collector_card.is_used:
        voucher_card = VoucherCard.objects.get(collector_card=collector_card)
        used_date = voucher_card.date_used
        str_date = used_date.strftime('%d %B %Y')
        response = voucher_to_used(nickname, serial_nr, business_name, collector_id, secret_key, customer_id, str_date)

    # in this case collector is still collecting points, we are updating collector
    else:
        response = create_collector_card_points(nickname, serial_nr, to_qr, campaign_name, business_name, value_counted,
                                                collector_id, secret_key, customer_id, collector_type, value_goal)

    return response
