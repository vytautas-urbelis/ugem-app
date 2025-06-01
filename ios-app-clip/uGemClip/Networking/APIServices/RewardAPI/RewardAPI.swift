import Foundation

@MainActor
final class RewardAPI {
  
    // Method to handle Apple authentication
  func rewardRequest(accessToken: String, campaignToken: String) async throws -> Reward {
      print("data", accessToken, campaignToken)
      let endpoint = URL(string: "https://ugem.app/backend/api/self-scan/")!
      let payload: [String: Any] = ["campaign_token": campaignToken]

      // Perform the request and decode the response
      let rewardResponse: RewardResponse = try await performRewardRequest(endpoint: endpoint, method: "POST", body: payload, accessToken: accessToken)
    
      var today: Date = Date()
  
    
      if rewardResponse.type == "voucher" {
        let voucher = Voucher(
            dateCreated: rewardResponse.voucher?.dateCreated ?? today,
            qrCode: rewardResponse.voucher?.qrCode ?? "nil",
            name: rewardResponse.voucher?.campaign.name ?? "nil",
            voucherDescription: rewardResponse.voucher?.campaign.voucherDescription ?? "nil",
            additionalInformation: rewardResponse.voucher?.campaign.additionalInformation ?? "nil",
            expirationDate: rewardResponse.voucher?.expirationDate ?? "nil",
            image: rewardResponse.voucher?.campaign.image ?? "nil",
            logo: rewardResponse.voucher?.businessUserProfile.logo ?? "nil",
            businessName: rewardResponse.voucher?.businessUserProfile.businessName ?? "nil"
        )
        
        let reward = Reward(type: "voucher", collector: nil, voucher: voucher)
        
        return reward
        
      } else if rewardResponse.type == "collector" {
        let collector = Collector(
          dateCreated: rewardResponse.collector?.dateCreated ?? today,
            valueCounted: rewardResponse.collector?.valueCounted ?? 0,
            valueGoal: rewardResponse.collector?.valueGoal ?? 0,
            name: rewardResponse.collector?.campaign.name ?? "nil",
            campaignDescription: rewardResponse.collector?.campaign.description ?? "nil",
            additionalInformation: rewardResponse.collector?.campaign.additionalInformation ?? "nil",
            endingDate: rewardResponse.collector?.campaign.endingDate ?? "nil",
            stampDesign: rewardResponse.collector?.campaign.stampDesign ?? 0,
            collectorType: rewardResponse.collector?.campaign.collectorType ?? 0,
            color: rewardResponse.collector?.campaign.color ?? "nil",
            image: rewardResponse.collector?.campaign.image ?? "nil",
            logo: rewardResponse.collector?.businessUserProfile.logo ?? "nil",
            businessName: rewardResponse.collector?.businessUserProfile.businessName ?? "nil"
        )
        let reward = Reward(type: "collector", collector: collector, voucher: nil)
        
        return reward
      }

    
    return Reward(type: "none", collector: nil, voucher: nil)

    }

    // Generic method to perform network requests
    private func performRewardRequest<T: Decodable>(endpoint: URL, method: String, body: [String: Any]?, accessToken: String) async throws -> T {
          var request = URLRequest(url: endpoint)
          request.httpMethod = method
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

          if let body = body {
              request.httpBody = try JSONSerialization.data(withJSONObject: body)
          }

          let (data, response) = try await URLSession.shared.data(for: request)
          guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 || httpResponse.statusCode == 200 else {
              throw URLError(.badServerResponse)
          }

          let decoder = JSONDecoder.iso8601withFractionalSeconds2
//          let rewardType = try decoder.decode(T.self, from: data)
        
          return try decoder.decode(T.self, from: data)
    }
}

extension JSONDecoder {
    // Custom JSONDecoder to handle ISO8601 date format with fractional seconds
    static var iso8601withFractionalSeconds2: JSONDecoder {
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
