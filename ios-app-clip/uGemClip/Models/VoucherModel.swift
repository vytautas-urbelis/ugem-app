//
//  VoucherModel.swift
//  uGem
//
//  Created by Vytautas Urbelis on 18.02.2025.
//

import Foundation
import SwiftUI
import SwiftData

@Model
final class Voucher: ObservableObject {
  var dateCreated: Date
  var qrCode: String
  var name: String
  var voucherDescription: String
  var additionalInformation: String?
  var expirationDate: String
  var image: String?
  var logo: String
  var businessName: String
  
  init(dateCreated: Date, qrCode: String, name: String, voucherDescription: String, additionalInformation: String?, expirationDate: String, image: String?, logo: String,  businessName: String) {
    self.dateCreated = dateCreated
    self.qrCode = qrCode
    self.name = name
    self.voucherDescription = voucherDescription
    self.additionalInformation = additionalInformation
    self.expirationDate = expirationDate
    self.image = image
    self.logo = logo
    self.businessName = businessName
  }
  
}

