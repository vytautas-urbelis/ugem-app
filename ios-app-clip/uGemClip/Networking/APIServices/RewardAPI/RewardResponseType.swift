//
//  RewardResponseType.swift
//  uGem
//
//  Created by Vytautas Urbelis on 18.02.2025.
//

struct RewardResponse: Codable {
  let type: String
  let voucher: VoucherCard?
  let collector: CollectorCard?
  
  enum CodingKeys: String, CodingKey {
    case type = "type"
    case collector = "collector"
    case voucher = "voucher"
  }
}
