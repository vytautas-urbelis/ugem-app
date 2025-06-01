import jwt
from django.http import FileResponse
from wallet.models import Pass, Barcode, StoreCard


def generate_authentication_token(secret_key, customer_id):
    return jwt.encode({"customer_id": customer_id}, secret_key, algorithm="HS256")


def collector_to_voucher(nickname, serial_nr, to_qr, campaign_name, business_name, collector_id, secret_key,
                         customer_id):
    cardInfo = StoreCard()
    cardInfo.addPrimaryField('Voucher', f'{campaign_name}', f'{campaign_name} VOUCHER CARD')
    cardInfo.addSecondaryField('Card holder', f'#{nickname}', 'Card Holder')
    cardInfo.addAuxiliaryField('Card id', f'#{serial_nr}', 'Card Id')
    cardInfo.addBackField('website', 'https://swiftybee.ch/', 'Find More:')

    organizationName = 'SwiftyBeeCollector'
    passTypeIdentifier = 'pass.ch.swiftybee.collector'
    teamIdentifier = '5MJ649KLV6'

    passfile = Pass(cardInfo,
                    passTypeIdentifier=passTypeIdentifier,
                    organizationName=organizationName,
                    teamIdentifier=teamIdentifier)
    passfile.serialNumber = f'{serial_nr}'
    passfile.barcode = Barcode(message=f'{to_qr}', format='PKBarcodeFormatQR')
    passfile.logoText = f'{business_name}'
    passfile.headerField = '@'

    passfile.backgroundColor = '#F7EF65'

    passfile.webServiceURL = 'https://swiftybee.ch/backend/api'
    passfile.authenticationToken = generate_authentication_token(secret_key, customer_id)

    # Including the icon and logo is necessary for the passbook to be valid.
    passfile.addFile('icon.png', open('apple_cards/collector_data/img/icon.png', 'rb'))  # Standard resolution
    passfile.addFile('icon@2x.png', open('apple_cards/collector_data/img/icon@2x.png', 'rb'))  # Retina display
    passfile.addFile('icon@3x.png', open('apple_cards/collector_data/img/icon@3x.png', 'rb'))  # Super retina display

    passfile.addFile('logo.png', open('apple_cards/collector_data/img/logo.png', 'rb'))  # Standard resolution
    passfile.addFile('logo@2x.png', open('apple_cards/collector_data/img/logo@2x.png', 'rb'))  # Retina display
    passfile.addFile('logo@3x.png', open('apple_cards/collector_data/img/logo@3x.png', 'rb'))  # Super retina display

    # Create and output the Passbook file (.pkpass)
    password = 'Admin@123'
    file_name = f'passes/collector_cards/{nickname}_collector_{collector_id}.pkpass'
    passfile.create('apple_cards/collector_data/keys/collector_cert.pem',
                    'apple_cards/collector_data/keys/mykey.key',
                    'apple_cards/collector_data/keys/AppleWWDRCA.pem', password, file_name)
    response = FileResponse(open(f'{file_name}', 'rb'), as_attachment=True,
                            filename=f'{nickname}_collector_{collector_id}.pkpass')
    return response
