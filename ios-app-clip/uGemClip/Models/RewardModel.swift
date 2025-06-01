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
final class Reward: ObservableObject {
  var type: String
  var collector: Collector?
  var voucher: Voucher?

  
  init(type: String, collector: Collector?, voucher: Voucher?) {
    self.type = type
    self.collector = collector
    self.voucher = voucher
  }
  
}

