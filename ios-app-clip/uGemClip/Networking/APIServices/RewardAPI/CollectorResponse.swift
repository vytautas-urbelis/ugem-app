//
//  UserAuthResponse.swift
//  uGem
//
//  Created by Vytautas Urbelis on 14.02.2025.
//

import Foundation


struct CollectorResponse: Codable {
  let type: String
  let collector: CollectorCard
  
  enum CodingKeys: String, CodingKey {
    case type = "type"
    case collector = "collector"
  }
}

struct CollectorCard: Codable {
  let dateCreated: Date
  let valueCounted: Int
  let valueGoal: Int
  let campaign: CollectorCampaign
  let businessUserProfile: CollectorBusinessUserProfile
  
  enum CodingKeys: String, CodingKey {
    case dateCreated = "date_created"
    case valueCounted = "value_counted"
    case valueGoal = "value_goal"
    case campaign = "campaign"
    case businessUserProfile = "business_user_profile"
  }
}

struct CollectorCampaign: Codable {
  let name: String
  let description: String
  let additionalInformation: String?
  let endingDate: String
  let stampDesign: Int?
  let collectorType: Int
  let color: String?
  let image: String?
  
  enum CodingKeys: String, CodingKey {
    case name = "name"
    case description = "description"
    case additionalInformation = "additional_information"
    case endingDate = "ending_date"
    case stampDesign = "stamp_design"
    case collectorType = "collector_type"
    case color = "color"
    case image = "image"
  }
}

struct CollectorBusinessUserProfile: Codable {
  let userId: Int
  let logo: String
  let businessName: String

  enum CodingKeys: String, CodingKey {
    case userId = "user_id"
    case logo = "logo"
    case businessName = "business_name"
  }
}
