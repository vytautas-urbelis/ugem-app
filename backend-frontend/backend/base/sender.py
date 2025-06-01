from django.http import HttpResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# import json


def voucher_created(secret_key, voucher):
    # Get the channel layer
    channel_layer = get_channel_layer()
    # message = json.dumps(voucher)

    # Define the room name and group name
    room_name = secret_key  # Replace with the actual room name
    room_group_name = "chanel_%s" % room_name

    # Send a message to the group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": "voucher_object",
            "voucher": voucher
        }
    )

    return HttpResponse("Message sent to WebSocket consumers.")


def collector_updated(secret_key, collector):
    # Get the channel layer
    channel_layer = get_channel_layer()
    # message = json.dumps(voucher)

    # Define the room name and group name
    room_name = secret_key  # Replace with the actual room name
    room_group_name = "chanel_%s" % room_name

    # Send a message to the group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": "collector_object",
            "collector": collector
        }
    )

    return HttpResponse("Message sent to WebSocket consumers.")
