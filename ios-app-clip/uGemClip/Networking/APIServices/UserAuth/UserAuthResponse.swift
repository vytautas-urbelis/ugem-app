//
//  UserAuthResponse.swift
//  uGem
//
//  Created by Vytautas Urbelis on 14.02.2025.
//

import Foundation

struct UserResponse: Codable {
    let customer: Customer
    let access: String
    let refresh: String
}

struct Customer: Codable {
    let email: String
    let dateJoined: Date
    let customerUserProfile: CustomerUserProfile

    enum CodingKeys: String, CodingKey {
        case email
        case dateJoined = "date_joined"
        case customerUserProfile = "customer_user_profile"
    }
}

struct CustomerUserProfile: Codable {
    let nickname: String
    let avatar: String?
    let customerCard: CustomerCard

    enum CodingKeys: String, CodingKey {
        case nickname, avatar
        case customerCard = "customer_card"
    }
}

struct CustomerCard: Codable {
    let qrCode: String
    let cardType: CardType

    enum CodingKeys: String, CodingKey {
        case qrCode = "qr_code"
        case cardType = "card_type"
    }
}

struct CardType: Codable {
    let type: String
}
