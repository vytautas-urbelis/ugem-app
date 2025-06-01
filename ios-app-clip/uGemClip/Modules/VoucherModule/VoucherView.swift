//
//  VoucherView.swift
//  uGem
//
//  Created by Vytautas Urbelis on 19.02.2025.
//

import SwiftUI

struct VoucherView: View {
  
  @Binding var isShowingVoucher: Bool
  @Binding var reward: Reward?
  
  var body: some View {
    VStack {
      VStack  {
        headerSection
        VStack {
          Text("\(reward?.voucher?.name ?? "No name")")
            .font(.title)
            .padding()
          Text(reward?.voucher?.voucherDescription ?? "No Description")
            .font(.subheadline)
            .foregroundColor(Color(white: 0.3))
            .padding()
        }
        
        qrCodeSection
        
        VStack {
          Text(reward?.voucher?.additionalInformation ?? "")
            .font(.subheadline)
            .foregroundColor(Color(white: 0.6))
            .padding()
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
      AsyncImage(url: URL(string: "https://ugem.app\(reward?.voucher?.logo ?? "")" )) { image in
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
                  Text(reward?.voucher?.businessName.first?.uppercased() ?? "?")
                      .font(.title)
              }
      }
      VStack(alignment: .leading) {
        Text("\(reward?.voucher?.businessName ?? "No Name")")
          .font(.headline)
        Text((reward?.voucher?.dateCreated ?? Date()), style: .date)
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
  
  // View for the middle section containing the QR code
  private var qrCodeSection: some View {
      VStack {
        AsyncImage(url: URL(string: "https://ugem.app/\(reward?.voucher?.qrCode ?? "")")) { image in
              image
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 200, height: 200)
          } placeholder: {
              Rectangle()
                  .foregroundColor(Color(white: 0.98))
                  .frame(width: 200, height: 200)
          }
      }
      .padding(.vertical, 40)
      .accessibilityLabel("Voucher QR code")
  }
  
  
  // View for the bottom section containing the ending date and logo
  private var joinDateAndLogoSection: some View {
      VStack {
          HStack {
              VStack {
                Text("Campaign ends \(reward?.voucher?.expirationDate ?? "")")
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

struct VoucherView_Previews: PreviewProvider {
//  static var date = "2025-02-19T08:10:21.430258Z".data(using: .utf8)!
  static var voucher: Voucher = Voucher(
    dateCreated: Date(),
    qrCode: "4",
    name: "Free Beer",
    voucherDescription: "Some description",
    additionalInformation: "Additional information here",
    expirationDate: "String",
    image: "String",
    logo: "String",
    businessName: "Good old Business")
  static var reward: Reward = Reward(type: "voucher", collector: nil, voucher: voucher)
  static var previews: some View {
    VoucherView(isShowingVoucher: .constant(true), reward: .constant(reward))
  }
}
