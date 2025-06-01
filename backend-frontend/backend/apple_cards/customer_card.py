from django.http import FileResponse
from wallet.models import Pass, Barcode, Generic
import jwt


def generate_authentication_token(secret_key, customer_id):
    return jwt.encode({"customer_id": customer_id}, secret_key, algorithm="HS256")


def create_customer_card(nickname, serial_nr, to_qr, secret_key, customer_id):
    cardInfo = Generic()
    cardInfo.addPrimaryField(f'{nickname}', 'REWARDS CARD', 'SWIFTY CARD')
    cardInfo.addSecondaryField('Holder', f'{nickname}', 'CARD HOLDER')
    cardInfo.addAuxiliaryField('Card id', f'#{serial_nr}', 'CARD ID')
    cardInfo.addBackField('website', 'https://swiftybee.ch/', 'Find More:')

    organizationName = 'SwiftyBee'
    passTypeIdentifier = 'pass.ch.swiftybee'
    teamIdentifier = '5MJ649KLV6'

    passfile = Pass(cardInfo,
                    passTypeIdentifier=passTypeIdentifier,
                    organizationName=organizationName,
                    teamIdentifier=teamIdentifier)
    passfile.serialNumber = f'{serial_nr}'
    passfile.barcode = Barcode(message=f'{to_qr}', format='PKBarcodeFormatQR')
    passfile.logoText = 'SWIFTYBEE'
    passfile.headerField = '@'

    passfile.webServiceURL = 'https://swiftybee.ch/backend/api'
    passfile.authenticationToken = generate_authentication_token(secret_key, customer_id)

    # Including the icon and logo is necessary for the passbook to be valid.
    passfile.addFile('icon.png', open('apple_cards/customer_data/img/icon.png', 'rb'))  # Standard resolution
    passfile.addFile('icon@2x.png', open('apple_cards/customer_data/img/icon@2x.png', 'rb'))  # Retina display
    passfile.addFile('icon@3x.png', open('apple_cards/customer_data/img/icon@3x.png', 'rb'))  # Super retina display

    passfile.addFile('logo.png', open('apple_cards/customer_data/img/logo.png', 'rb'))  # Standard resolution
    passfile.addFile('logo@2x.png', open('apple_cards/customer_data/img/logo@2x.png', 'rb'))  # Retina display
    passfile.addFile('logo@3x.png', open('apple_cards/customer_data/img/logo@3x.png', 'rb'))  # Super retina display

    passfile.addFile('thumbnail.png', open('apple_cards/customer_data/img/thumbnail.png', 'rb'))  # Standard resolution
    passfile.addFile('thumbnail@2x.png', open('apple_cards/customer_data/img/thumbnail@2x.png', 'rb'))  # Retina display
    passfile.addFile('thumbnail@3x.png',
                     open('apple_cards/customer_data/img/thumbnail@3x.png', 'rb'))  # Super retina display

    # Create and output the Passbook file (.pkpass)
    password = 'Admin@123'
    file_name = f'passes/customer_cards/{nickname}.pkpass'
    passfile.create('apple_cards/customer_data/keys/certificate.pem', 'apple_cards/customer_data/keys/mykey.key',
                    'apple_cards/customer_data/keys/AppleWWDRCA.pem', password, file_name)
    response = FileResponse(open(f'{file_name}', 'rb'), as_attachment=True, filename=f'{nickname}.pkpass')
    return response
