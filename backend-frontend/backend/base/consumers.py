import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    room_name = ''
    room_group_name = ''

    async def connect(self):
        print('connecting')
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(self.room_name)
        self.room_group_name = "chanel_%s" % self.room_name
        print(f'Connecting to room group: {self.room_group_name}')

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

        print(f'WebSocket disconnected: close_code: {close_code}')

    async def receive(self, text_data=None, bytes_data=None):
        print('received')
        print(text_data)

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def voucher_object(self, event):
        voucher = event["voucher"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"voucher": voucher}))

    async def collector_object(self, event):
        collector = event["collector"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"collector": collector}))
