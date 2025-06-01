//
//  UserStore.swift
//  uGem
//
//  Created by Vytautas Urbelis on 13.02.2025.
//

import Foundation
import SwiftUI
import SwiftData

@Model
final class User: ObservableObject {
  var id: Int
  var email: String
  var dateJoined: Date
  var nickname: String
  var avatar: String?
  var cardType: String
  var qrCode: String
  var refresh: String
  var access: String
  
  init(id: Int = 1, email: String, dateJoined: Date, nickname: String, avatar: String?, cardType: String, qrCode: String, refresh: String, access: String) {
    self.id = id
    self.email = email
    self.dateJoined = dateJoined
    self.nickname = nickname
    self.avatar = avatar
    self.cardType = cardType
    self.qrCode = qrCode
    self.refresh = refresh
    self.access = access
  }
  
}


