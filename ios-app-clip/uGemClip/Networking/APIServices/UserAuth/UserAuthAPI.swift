////
////  UserAuthAPI.swift
////  uGem
////
////  Created by Vytautas Urbelis on 13.02.2025.
////
//
//import Foundation
//import SwiftData
//import AuthenticationServices
//
//
//
//@MainActor
//final class UserAuthAPI {
//  
//  func checkAccessToken(accessToken: String) async throws -> Bool {
//    // prepare json data
//    let json: [String: Any] = ["token": accessToken]
//    let jsonData = try? JSONSerialization.data(withJSONObject: json)
//    
//    // create post request
//    let endpoint = URL(string: "https://ugem.app/backend/api/auth/token/verify/")!
//    var request = URLRequest(url: endpoint)
//    request.httpMethod = "POST"
//    
//    // Set headers
//    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//    
//    // insert json data to the request
//    request.httpBody = jsonData
//    
//    let (responseData, response) = try await URLSession.shared.data(for: request)
//    
//    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//      if let responseString = String(data: responseData, encoding: .utf8) {
//        print("Response Data: \(responseString)")
//      } else {
//        print("Unable to parse response data.")
//      }
//      throw URLError(.badServerResponse)
//    }
//    
//    return true
//  }
//    
//  func appleAuth(email: String, userID: String, identityToken: String) async throws -> User {
//      
//    let json: [String: Any]
//    // prepare json data
//    if email.isEmpty {
//      json = ["user_apple_id": userID, "identity_token": identityToken]
//    } else {
//      json = ["email": email, "user_apple_id": userID, "identity_token": identityToken]
//    }
//      
//    let jsonData = try? JSONSerialization.data(withJSONObject: json)
//      
//    // create post request
//    let endpoint = URL(string: "https://ugem.app/backend/api/apple/auth/clip/sign-in/")!
//    var request = URLRequest(url: endpoint)
//    request.httpMethod = "POST"
//      
//    // Set headers
//    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//      
//    // insert json data to the request
//    request.httpBody = jsonData
//      
//    let (responseData, response) = try await URLSession.shared.data(for: request)
//      
//    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//      if let responseString = String(data: responseData, encoding: .utf8) {
//        print("Response Data: \(responseString)")
//      } else {
//        print("Unable to parse response data.")
//      }
//      // Sukurti savo errorus
//      throw URLError(.badServerResponse)
//    }
//    
////    let responseString = String(data: responseData, encoding: .utf8)
////    print(responseString!)
//    
//    // Set up JSONDecoder with ISO8601 date decoding including fractional seconds
//    let decoder = JSONDecoder()
//    let iso8601Formatter = ISO8601DateFormatter()
//    iso8601Formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
//    
//    decoder.dateDecodingStrategy = .custom({ decoder -> Date in
//        let container = try decoder.singleValueContainer()
//        let dateStr = try container.decode(String.self)
//        if let date = iso8601Formatter.date(from: dateStr) {
//            return date
//        }
//        throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format: \(dateStr)")
//    })
//    
//    // Decode the response into our intermediary model
//    let userResponse = try decoder.decode(UserResponse.self, from: responseData)
//    
//    // Map the decoded values to your User model
//    let user = User(
//        email: userResponse.customer.email,
//        dateJoined: userResponse.customer.date_joined,
//        nickname: userResponse.customer.customer_user_profile.nickname,
//        avatar: userResponse.customer.customer_user_profile.avatar,
//        cardType: userResponse.customer.customer_user_profile.customer_card.card_type.type,
//        qrCode: userResponse.customer.customer_user_profile.customer_card.qr_code,
//        refresh: userResponse.refresh,
//        access: userResponse.access
//    )
//    
//    print(user.email, user.dateJoined, user.nickname, user.qrCode)
//    
//    return user
//
//  }
//  struct UserResponse: Codable {
//      let customer: Customer
//      let access: String
//      let refresh: String
//  }
//
//  struct Customer: Codable {
//      let email: String
//      let date_joined: Date
//      let customer_user_profile: CustomerUserProfile
//  }
//
//  struct CustomerUserProfile: Codable {
//      let nickname: String
//      let avatar: String?
//      let customer_card: CustomerCard
//  }
//
//  struct CustomerCard: Codable {
//      let qr_code: String
//      let card_type: CardType
//  }
//  
//  struct CardType: Codable {
//      let type: String
//  }
//}

//import Foundation
//
//@MainActor
//final class UserAuthAPI {
//    func checkAccessToken(accessToken: String) async throws -> Bool {
//        let endpoint = URL(string: "https://ugem.app/backend/api/auth/token/verify/")!
//        let payload = ["token": accessToken]
//        let _: [String: String] = try await request(endpoint: endpoint, method: "POST", body: payload)
//        return true
//    }
//
//    func appleAuth(email: String, userID: String, identityToken: String) async throws -> User {
//        let endpoint = URL(string: "https://ugem.app/backend/api/apple/auth/clip/sign-in/")!
//        var payload: [String: Any] = ["user_apple_id": userID, "identity_token": identityToken]
//        if !email.isEmpty { payload["email"] = email }
//
//        let userResponse: UserResponse = try await request(endpoint: endpoint, method: "POST", body: payload)
//
//        return User(
//            email: userResponse.customer.email,
//            dateJoined: userResponse.customer.dateJoined,
//            nickname: userResponse.customer.customerUserProfile.nickname,
//            avatar: userResponse.customer.customerUserProfile.avatar,
//            cardType: userResponse.customer.customerUserProfile.customerCard.cardType.type,
//            qrCode: userResponse.customer.customerUserProfile.customerCard.qrCode,
//            refresh: userResponse.refresh,
//            access: userResponse.access
//        )
//    }
//
//    private func request<T: Decodable>(endpoint: URL, method: String, body: [String: Any]?) async throws -> T {
//        var request = URLRequest(url: endpoint)
//        request.httpMethod = method
//        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//
//        if let body = body {
//            request.httpBody = try JSONSerialization.data(withJSONObject: body)
//        }
//
//        let (data, response) = try await URLSession.shared.data(for: request)
//        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//            throw URLError(.badServerResponse)
//        }
//
//        let decoder = JSONDecoder.iso8601withFractionalSeconds
//        return try decoder.decode(T.self, from: data)
//    }
//}
//
//extension JSONDecoder {
//    static var iso8601withFractionalSeconds: JSONDecoder {
//        let decoder = JSONDecoder()
//        let formatter = ISO8601DateFormatter()
//        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
//        decoder.dateDecodingStrategy = .custom { decoder in
//            let container = try decoder.singleValueContainer()
//            let dateStr = try container.decode(String.self)
//            if let date = formatter.date(from: dateStr) {
//                return date
//            }
//            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format: \(dateStr)")
//        }
//        return decoder
//    }
//}

import Foundation

@MainActor
final class UserAuthAPI {
    // Method to check the validity of an access token
    func checkAccessToken(accessToken: String) async throws -> Bool {
        let endpoint = URL(string: "https://ugem.app/backend/api/auth/token/verify/")!
        let payload = ["token": accessToken]

        // Perform the request and handle the response
        let _: [String: String] = try await performRequest(endpoint: endpoint, method: "POST", body: payload)
        return true
    }

    // Method to handle Apple authentication
    func appleAuth(email: String, userID: String, identityToken: String) async throws -> User {
        let endpoint = URL(string: "https://ugem.app/backend/api/apple/auth/clip/sign-in/")!
        var payload: [String: Any] = ["user_apple_id": userID, "identity_token": identityToken]
        if !email.isEmpty { payload["email"] = email }
      
        print(payload)

        // Perform the request and decode the response
        let userResponse: UserResponse = try await performRequest(endpoint: endpoint, method: "POST", body: payload)

        return User(
            email: userResponse.customer.email,
            dateJoined: userResponse.customer.dateJoined,
            nickname: userResponse.customer.customerUserProfile.nickname,
            avatar: userResponse.customer.customerUserProfile.avatar,
            cardType: userResponse.customer.customerUserProfile.customerCard.cardType.type,
            qrCode: userResponse.customer.customerUserProfile.customerCard.qrCode,
            refresh: userResponse.refresh,
            access: userResponse.access
        )
    }

    // Generic method to perform network requests
    private func performRequest<T: Decodable>(endpoint: URL, method: String, body: [String: Any]?) async throws -> T {
        var request = URLRequest(url: endpoint)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body = body {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }

        let decoder = JSONDecoder.iso8601withFractionalSeconds
        return try decoder.decode(T.self, from: data)
    }
}

extension JSONDecoder {
    // Custom JSONDecoder to handle ISO8601 date format with fractional seconds
    static var iso8601withFractionalSeconds: JSONDecoder {
        let decoder = JSONDecoder()
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateStr = try container.decode(String.self)
            if let date = formatter.date(from: dateStr) {
                return date
            }
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Invalid date format: \(dateStr)")
        }
        return decoder
    }
}
