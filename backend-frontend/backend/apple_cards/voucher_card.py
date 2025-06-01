from django.http import FileResponse
from wallet.models import Pass, Barcode, Coupon


def create_voucher_card(nickname, serial_nr, to_qr, voucher_id, campaign_name, card_type, business_name):
    cardInfo = Coupon()
    cardInfo.addPrimaryField(f'{nickname}', f'{campaign_name}', f'{campaign_name} Voucher Card')
    cardInfo.addSecondaryField('Holder', f'{nickname}', 'CARD HOLDER')
    cardInfo.addAuxiliaryField('Card Type', f'#{card_type}', 'Card Type')
    cardInfo.addBackField('website', 'https://swiftybee.ch/', 'FIND MORE:')

    # organizationName = 'BeeSmart'
    # passTypeIdentifier = 'pass.com.beesmart.com'
    # teamIdentifier = '5MJ649KLV6'

    organizationName = 'SwiftyBeeVoucher'
    passTypeIdentifier = 'pass.ch.swiftybee.voucher'
    teamIdentifier = '5MJ649KLV6'

    passfile = Pass(cardInfo,
                    passTypeIdentifier=passTypeIdentifier,
                    organizationName=organizationName,
                    teamIdentifier=teamIdentifier)
    passfile.serialNumber = f'{serial_nr}'
    passfile.barcode = Barcode(message=f'{to_qr}', format='PKBarcodeFormatQR')
    passfile.logoText = f'{business_name}'
    passfile.headerField = '@'

    passfile.webServiceURL = 'https://swiftybee.ch/backend/api'
    passfile.authenticationToken = 'jsdhisudafg879sd8yg9s87dgtf9sd8fgyt9s7dgf690s87fy9s87gf6s98dfgy09sd8g67'

    # Including the icon and logo is necessary for the passbook to be valid.
    passfile.addFile('icon.png', open('apple_cards/voucher_data/img/icon.png', 'rb'))  # Standard resolution
    passfile.addFile('icon@2x.png', open('apple_cards/voucher_data/img/icon@2x.png', 'rb'))  # Retina display
    passfile.addFile('icon@3x.png', open('apple_cards/voucher_data/img/icon@3x.png', 'rb'))  # Super retina display

    passfile.addFile('logo.png', open('apple_cards/voucher_data/img/logo.png', 'rb'))  # Standard resolution
    passfile.addFile('logo@2x.png', open('apple_cards/voucher_data/img/logo@2x.png', 'rb'))  # Retina display
    passfile.addFile('logo@3x.png', open('apple_cards/voucher_data/img/logo@3x.png', 'rb'))  # Super retina display

    # at some point add strip img
    # passfile.addFile('thumbnail.png', open('apple_cards/keys/img/thumbnail.png', 'rb'))  # Standard resolution
    # passfile.addFile('thumbnail@2x.png', open('apple_cards/keys/img/thumbnail@2x.png', 'rb'))  # Retina display
    # passfile.addFile('thumbnail@3x.png', open('apple_cards/keys/img/thumbnail@3x.png', 'rb'))  # Super retina display

    # Create and output the Passbook file (.pkpass)
    password = 'Admin@123'
    file_name = f'passes/voucher_cards/{nickname}_voucher{voucher_id}.pkpass'
    passfile.create('apple_cards/voucher_data/keys/voucher_cert.pem', 'apple_cards/voucher_data/keys/mykey.key',
                    'apple_cards/voucher_data/keys/AppleWWDRCA.pem', password,
                    file_name)
    response = FileResponse(open(f'{file_name}', 'rb'), as_attachment=True,
                            filename=f'{nickname}_voucher{voucher_id}.pkpass')
    return response
