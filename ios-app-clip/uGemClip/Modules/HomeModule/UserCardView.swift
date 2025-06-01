////
////  UserCardView.swift
////  uGem
////
////  Created by Vytautas Urbelis on 14.02.2025.
////
//
//import SwiftUI
//
//struct UserCardView: View {
//  var user: User
//  
//  var body: some View {
//    VStack {
//    HStack {
//      VStack(alignment: .leading) {
//          Text("Card Holder")
//          .font(.caption)
//          Text("@\(user.nickname)")
//          .font(.headline)
//          .padding(.bottom)
//          Text("Card Type")
//          .font(.caption)
//        Text("#\(user.cardType)")
//          .font(.headline)
//          .padding(.bottom)
//      }
//      Spacer()
//      VStack(alignment: .trailing) {
//        AsyncImage(url: URL(string: "https://ugem.app/\(user.avatar ?? "")" )) { image in
//          image
//            .resizable()
//            .aspectRatio(contentMode: .fit)
//            .frame(width: 100, height: 100)
//        } placeholder: {
//          Rectangle()
//            .foregroundColor(Color(white: 0.9))
//            .frame(width: 100, height: 100)
//            .cornerRadius(10)
//            .overlay() {
//              Text(user.nickname.first?.uppercased() ?? "?")
//                .font(.title)
//            }
//        }
//      }
//    }
//    .padding()
//    VStack {
//      AsyncImage(url: URL(string: "https://ugem.app/\(user.qrCode)")) { image in
//        image
//          .resizable()
//          .aspectRatio(contentMode: .fit)
//          .frame(width: 200, height: 200)
//      } placeholder: {
//        Rectangle()
//          .foregroundColor(Color(white: 0.98))
//          .frame(width: 200, height: 200)
//            
//      }
//    }
//    .padding(.vertical, 40)
//      VStack {
//        HStack {
//          VStack {
//            Text("Created \(user.dateJoined, style: .date)")
//            .font(.caption)
//
//          }
//          Spacer()
//          VStack {
//            Image("uGem")
//              .resizable()
//              .frame(width: 53, height: 16)
//          }
//        }
//      }
//      .padding()
//    }
//    .background(Color(.white))
//    .opacity(0.85)
//  }
//    
//}
//
//struct UserCardView_Previews: PreviewProvider {
//  
//  static let sampleUser = User(
//      email: "test@example.com",
//      dateJoined: Date(),
//      nickname: "PreviewUser",
//      avatar: "",
//      cardType: "Regular",
//      qrCode: "https://ugem.app/media-files/user_qr/vytas.urbelis%40gmail.commm/qr_vytas.urbelisgmail.commm_33.png",
//      refresh: "",
//      access: ""
//  )
//  static var previews: some View {
//    UserCardView(user: sampleUser)
//  }
//}

//
//  UserCardView.swift
//  uGem
//
//  Created by Vytautas Urbelis on 14.02.2025.
//

import SwiftUI

// UserCardView is a SwiftUI view that displays user information in a card format.
struct UserCardView: View {
    var user: User

    var body: some View {
        VStack {
            // Top section containing user details and avatar
            userInfoSection

            // Middle section containing QR code
            qrCodeSection

            // Bottom section containing join date and logo
            joinDateAndLogoSection
        }
        .background(Color.white)
        .opacity(0.85)
    }

    // View for the top section containing user details and avatar
    private var userInfoSection: some View {
        HStack {
            userTextDetails
            Spacer()
            avatarImage
        }
        .padding()
    }

    // View for the user text details
    private var userTextDetails: some View {
        VStack(alignment: .leading) {
            Text("Card Holder")
                .font(.caption)
            Text("@\(user.nickname)")
                .font(.headline)
                .padding(.bottom)
            Text("Card Type")
                .font(.caption)
            Text("#\(user.cardType)")
                .font(.headline)
                .padding(.bottom)
        }
    }

    // View for the avatar image with a placeholder
    private var avatarImage: some View {
        AsyncImage(url: URL(string: "https://ugem.app/\(user.avatar ?? "")")) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
        } placeholder: {
            Rectangle()
                .foregroundColor(Color(white: 0.9))
                .frame(width: 100, height: 100)
                .cornerRadius(10)
                .overlay {
                    Text(user.nickname.first?.uppercased() ?? "?")
                        .font(.title)
                }
        }
        .accessibilityLabel("User avatar")
    }

    // View for the middle section containing the QR code
    private var qrCodeSection: some View {
        VStack {
            AsyncImage(url: URL(string: "https://ugem.app/\(user.qrCode)")) { image in
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
        .accessibilityLabel("User QR code")
    }

    // View for the bottom section containing the join date and logo
    private var joinDateAndLogoSection: some View {
        VStack {
            HStack {
                VStack {
                    Text("Created \(user.dateJoined, style: .date)")
                        .font(.caption)
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

// Preview provider for UserCardView
struct UserCardView_Previews: PreviewProvider {
    static let sampleUser = User(
        email: "test@example.com",
        dateJoined: Date(),
        nickname: "PreviewUser",
        avatar: "",
        cardType: "Regular",
        qrCode: "https://ugem.app/media-files/user_qr/vytas.urbelis%40gmail.commm/qr_vytas.urbelisgmail.commm_33.png",
        refresh: "",
        access: ""
    )

    static var previews: some View {
        UserCardView(user: sampleUser)
    }
}
