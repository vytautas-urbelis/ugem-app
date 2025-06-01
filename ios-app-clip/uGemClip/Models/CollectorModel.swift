//
//  CollectorModel.swift
//  uGem
//
//  Created by Vytautas Urbelis on 18.02.2025.
//

import Foundation
import SwiftUI
import SwiftData

@Model
final class Collector: ObservableObject {
  var dateCreated: Date
  var valueCounted: Int
  var valueGoal: Int
  var name: String
  var campaignDescription: String
  var additionalInformation: String?
  var endingDate: String
  var stampDesign: Int?
  var collectorType: Int
  var color: String?
  var image: String?
  var logo: String
  var businessName: String
  
  init(dateCreated: Date, valueCounted: Int, valueGoal: Int, name: String, campaignDescription: String, additionalInformation: String?,  endingDate: String, stampDesign: Int?, collectorType: Int, color: String?, image: String?, logo: String,  businessName: String) {
    
    self.dateCreated = dateCreated
    self.valueCounted = valueCounted
    self.valueGoal = valueGoal
    self.name = name
    self.campaignDescription = campaignDescription
    self.additionalInformation = additionalInformation
    self.endingDate = endingDate
    self.stampDesign = stampDesign
    self.collectorType = collectorType
    self.color = color
    self.image = image
    self.logo = logo
    self.businessName = businessName
  }
  
}
