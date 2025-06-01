//
//  CollectorView.swift
//  uGem
//
//  Created by Vytautas Urbelis on 18.02.2025.
//

import SwiftUI

struct CollectorView: View {
  
  @Binding var isShowingCollector: Bool
  @Binding var reward: Reward?
  
  private func rows (stamps: Int) -> [GridItem] {
    let rowsNumber = 3
    let rows: [GridItem] = Array(repeating: GridItem(.fixed(80)), count: rowsNumber)
    return rows
  }
  
  var body: some View {
    VStack {
      VStack  {
        headerSection
        VStack {
          Text("\(reward?.collector?.name ?? "No name")")
            .font(.title)
            .padding()
          Text(reward?.collector?.campaignDescription ?? "No Description")
            .font(.subheadline)
            .foregroundColor(Color(white: 0.3))
            .padding(.horizontal, 20)
            .padding(.bottom)
        }
  
        // Checking collector type
        if reward?.collector?.collectorType == 1 {
          stampsSection
          Text("You need another \((reward?.collector?.valueGoal ?? 0) - (reward?.collector?.valueCounted ?? 0)) stamps to redeem the voucher.")
            .font(.caption)
            .padding(.horizontal, 20)
            .padding(.top)
            
        } else if reward?.collector?.collectorType == 2 {
          pointsSection
          Text("You need another \((reward?.collector?.valueGoal ?? 0) - (reward?.collector?.valueCounted ?? 0)) points to redeem the voucher.")
            .font(.caption)
          
        }
        joinDateAndLogoSection
        
      }
      .background(Color.white)
      .cornerRadius(8)
      .overlay(
        RoundedRectangle(cornerRadius: 8)
          .stroke(Color(white: 0.16), lineWidth: 0.5)
      )
      
      }
      .frame( maxWidth: .infinity, maxHeight: .infinity)
      .padding(20)
      .background(Color(white: 0.95))
      
  }
  
  // View for header section
  private var headerSection: some View {
    HStack(alignment: .top) {
      AsyncImage(url: URL(string: "https://ugem.app\(reward?.collector?.logo ?? "")" )) { image in
          image
              .resizable()
//              .aspectRatio(contentMode: .fit)
              .frame(width: 50, height: 50)
              .cornerRadius(8)
      } placeholder: {
          Rectangle()
              .foregroundColor(Color(white: 0.7))
              .frame(width: 50, height: 50)
              .cornerRadius(8)
              .overlay {
                  Text(reward?.collector?.businessName.first?.uppercased() ?? "?")
                      .font(.title)
              }
      }
      VStack(alignment: .leading) {
        Text("\(reward?.collector?.businessName ?? "No Name")")
          .font(.headline)
        Text((reward?.collector?.dateCreated ?? Date()), style: .date)
          .font(.caption)
          .foregroundColor(Color(white: 0.3))
      }
      Spacer()
      VStack {
      }
    }
    .frame(maxWidth: .infinity)
    .padding()
    .background(Image("paper")
      .resizable()
      .frame(maxHeight: 100)
      .opacity(0.3))
  }
  
  // View for stamps section
  private var stampsSection: some View {
    LazyVGrid(columns: rows(stamps: reward?.collector?.valueGoal ?? 0), spacing: 30) {
      ForEach(0..<(reward?.collector?.valueGoal ?? 0), id: \.self) { index in
        if index < reward?.collector?.valueCounted ?? 0 {
          
          let stampDesign = (reward?.collector?.stampDesign ?? 1)
          let design = StampDesign(rawValue: stampDesign)
          
          Rectangle()
            .foregroundColor(Color(white: 0.93))
            .frame(width: 60, height: 60)
            .cornerRadius(100)
            .overlay(
              Image(design?.imageName ?? "check")
                .resizable()
                .frame(width: 90, height: 90)
                .padding(5)
              )
        }
        else {
          Rectangle()
            .foregroundColor(Color(white: 0.93))
            .frame(width: 60, height: 60)
            .cornerRadius(100)
        }
              }
                 }
    .padding()
  }
  
  // View for points section
  private var pointsSection: some View {
    ZStack {
      // grey background circle
      let progress = Double(reward?.collector?.valueCounted ?? 1) / Double(reward?.collector?.valueGoal ?? 1)
      Circle()
        .stroke(lineWidth: 25)
        .opacity(0.3)
        .foregroundColor(Color(UIColor.systemGray3))
      
      // green base circle to receive shadow
      Circle()
        .trim(from: 0.0, to: CGFloat(min(Double(1.0), Double(progress))))
        .stroke(style: StrokeStyle(lineWidth: 23, lineCap: .round, lineJoin: .round))
        .foregroundColor(Color(UIColor.black))
        .rotationEffect(Angle(degrees: 270.0))
      
      Text("\((reward?.collector?.valueCounted ?? 1)) points")
        .font(.title)
        .padding(.bottom, 30)
      
      Text("out of \((reward?.collector?.valueGoal ?? 1)) ")
        .font(.title3)
        .padding(.top, 30)
    }
    .padding(60)
  }
  
  // View for the bottom section containing the ending date and logo
  private var joinDateAndLogoSection: some View {
      VStack {
          HStack {
              VStack {
                Text("Campaign ends \(reward?.collector?.endingDate ?? "---")")
                      .font(.caption)
                      .foregroundColor(Color(white: 0.3))
              }
              Spacer()
              VStack {
                  Image("uGem")
                      .resizable()
                      .frame(width: 53, height: 16)
              }
          }
      }
      .padding()
  }
}

struct CollectorView_Previews: PreviewProvider {
//  static var date = "2025-02-19T08:10:21.430258Z".data(using: .utf8)!
  static var collector1: Collector = Collector(
    dateCreated: Date(),
    valueCounted: 3,
    valueGoal: 9,
    name: "This could be all yours!",
    campaignDescription: "Empower your customers to collect stamps and points in a sleek, modern way—digitally!",
    additionalInformation: "Effortlessly scan your customers' vouchers and reward them instantly!",
    endingDate: "2025-02-19",
    stampDesign: 11,
    collectorType: 1,
    color: "#333",
    image: "String",
    logo: "String",
    businessName: "uGem")
  static var reward1: Reward = Reward(type: "collector", collector: collector1, voucher: nil)
  
  static var previews: some View {
    CollectorView(isShowingCollector: .constant(true), reward: .constant(reward1) )
  }
}
