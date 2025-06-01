//
//  UserAuthResponse.swift
//  uGem
//
//  Created by Vytautas Urbelis on 14.02.2025.
//

import Foundation

struct VoucherResponse: Codable {
  let type: String
  let voucher: VoucherCard
  
  enum CodingKeys: String, CodingKey {
    case type = "type"
    case voucher = "voucher"
  }
}

struct VoucherCard: Codable {
  let dateCreated: Date
  let qrCode: String
  let expirationDate: String
  let campaign: VoucherCampaign
  let businessUserProfile: VoucherBusinessUserProfile

  enum CodingKeys: String, CodingKey {
    case qrCode = "qr_code"
    case dateCreated = "date_created"
    case expirationDate = "expiration_date"
    case campaign = "campaign"
    case businessUserProfile = "business_user_profile"
  }
}

struct VoucherCampaign: Codable {
  let name: String
  let voucherDescription: String
  let additionalInformation: String?
  let image: String?
  
  enum CodingKeys: String, CodingKey {
    case name = "name"
    case voucherDescription = "description"
    case additionalInformation = "additional_information"
    case image = "image"
  }
}

struct VoucherBusinessUserProfile: Codable {
  let logo: String
  let businessName: String

  enum CodingKeys: String, CodingKey {
    case logo = "logo"
    case businessName = "business_name"
  }
}
