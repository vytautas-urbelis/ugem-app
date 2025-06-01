////
////  HomeView.swift
////  uGem
////
////  Created by Vytautas Urbelis on 13.02.2025.
////
//
//import SwiftUI
//import SwiftData
//import UIKit
//
//struct HomeView: View {
//  
//  // Using modelContext to add, fetch, delete and update local database
//  @Environment(\.modelContext) var modelContext
//
//  //Using Quary to fetch data from local database
//  @Query private var user: [User]
//  
//  @State private var stackPath: [String] = []
//  
//  var body: some View {
//    
//    
//    NavigationStack(path: $stackPath) {
//        VStack {
//          HStack {
//            Image("uGem")
//              .resizable()
//              .scaledToFit()
//              .frame(height: 28)
//              .padding(.bottom)
//          }
//
//          .frame(maxWidth: .infinity)
//          .background(Color(white: 1))
//          .overlay(
//              Rectangle()
//                .frame(height: 0.2)
//                .foregroundColor(.gray),
//                  alignment: .bottom)
//          ScrollView {
//            VStack {
//              if let firstUser = user.first {
//                UserCardView(user: firstUser)
//              }   else {
//                Text("No user found")
//              }
//            }
//            .frame(
//              minWidth: 0,
//              maxWidth: .infinity,
//              minHeight: 100
//            )
//            .overlay(
//                RoundedRectangle(cornerRadius: 6)
//                  .stroke(Color.gray, lineWidth:0.5)
//  //                  .shadow(radius: 1)
//            )
//            .padding(.horizontal)
//            .padding(.top, 50)
//            Spacer()
//          }
//
//        }
//        .background(Image("homeBackground")
//          .resizable()
//          .edgesIgnoringSafeArea(.all)
//          .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
//          .opacity(0.6)
//        )
//        .frame(
//          maxWidth: .infinity,
//          maxHeight: .infinity
//        )
//        .navigationDestination(for: String.self) { value in
//          Text("Destination for \(value)")
//        }
//      }
//    
//      .onAppear {
//        print("User: \(user)")
////        stackPath.append("Coconut")
//      }
//
//
//  }
//    
//
//}
//
//struct HomeView_Previews: PreviewProvider {
//    static var previews: some View {
//        HomeView()
//            .modelContainer(for: User.self, inMemory: true) { result in
//                // Unwrap the result to get the container
//                if case .success(let container) = result {
//                    let context = container.mainContext
//
//                    // Insert sample user into context
//                    let sampleUser = User(
//                        email: "test@example.com",
//                        dateJoined: Date(),
//                        nickname: "PreviewUser",
//                        avatar: "",
//                        cardType: "#Regular",
//                        qrCode: "",
//                        refresh: "",
//                        access: ""
//                    )
//                    context.insert(sampleUser)
//                }
//            }
//    }
//}
//

//
//  HomeView.swift
//  uGem
//
//  Created by Vytautas Urbelis on 13.02.2025.
//

import SwiftUI
import SwiftData
import UIKit

struct HomeView: View {
  // Using modelContext to add, fetch, delete, and update local database
  @Environment(\.modelContext) var modelContext
  // Using Query to fetch data from local database
  @Query private var users: [User]
//  @Query private var rewards: [Reward]
  
  @State private var extractedCode: String?
  @State private var navigationPath: [String] = []
  @State private var isShowingCollector: Bool = false
  @State private var isShowingVoucher: Bool = false
  @State private var newReward: Reward?
  
  @State private var invocationURL: URL? = nil
  
  var rewardAPI = RewardAPI()
  
  var body: some View {
    NavigationStack(path: $navigationPath) {
      VStack {
        // Header section with logo
        headerSection
        
        // Main content with user card
        mainContent
        
        Spacer()
      }
      .onOpenURL { url in
          // This block is only executed when there's an invocation URL,
          // such as when launched via a QR code.
          invocationURL = url
          // You can inspect the URL here to see if it contains specific parameters.
      }
      .background(backgroundImage)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .navigationDestination(for: String.self) { value in
        Text("Destination for \(value)")
      }
      .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: handleUserActivity )
      .onAppear {
          // If invocationURL remains nil, it indicates a manual launch.
        if invocationURL?.baseURL == nil {
              // Handle manual launch (e.g., default behavior)
            print("Manual launch")
          } else {
            print(invocationURL?.baseURL)
          }
      }    }
    .sheet(isPresented: $isShowingCollector,
           onDismiss: didDismiss) {
      CollectorView(isShowingCollector: $isShowingCollector, reward: $newReward)
    }
    .sheet(isPresented: $isShowingVoucher,
            onDismiss: didDismiss) {
        VoucherView(isShowingVoucher: $isShowingVoucher, reward: $newReward)
      }
  }
  
  func didDismiss() {
    isShowingCollector = false
    isShowingVoucher = false
  }
  
  // Header section with logo
  private var headerSection: some View {
    HStack {
      Image("uGem")
        .resizable()
        .scaledToFit()
        .frame(height: 28)
        .padding(.bottom)
    }
    .frame(maxWidth: .infinity)
    .background(Color(white: 1))
    .overlay(
      Rectangle()
        .frame(height: 0.2)
        .foregroundColor(.gray),
      alignment: .bottom
    )
  }
  
  // Main content with user card
  private var mainContent: some View {
    ScrollView {
      VStack {
        if let firstUser = users.first {
          UserCardView(user: firstUser)
        } else {
          Text("No user found")
        }
      }
      .frame(minWidth: 0, maxWidth: .infinity, minHeight: 100)
      .overlay(
        RoundedRectangle(cornerRadius: 6)
          .stroke(Color.gray, lineWidth: 0.5)
      )
      .padding(.horizontal)
      .padding(.top, 50)
    }
  }
  
  // Background image
  private var backgroundImage: some View {
    Image("homeBackground")
      .resizable()
      .edgesIgnoringSafeArea(.all)
      .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
      .opacity(0.4)
  }

  
  func handleUserActivity(_ userActivity: NSUserActivity) {
    
          if let url = userActivity.webpageURL {
              print("Full Invoked URL: \(url.absoluteString)") // Debug: Print the full URL
              // Extract the code from the URL
              if let code = extractCode(from: url) {
                  // Update the state with the extracted code
                  extractedCode = code
                
                  // Making API call
                Task {
                  await handleRewardRequest(accessToken: users[0].access, campaignToken: code)
                }
                
                  print("Code extracted: \(code)") // Debug: Print the extracted code
              } else {
                  print("Code not found in URL.") // Debug: Print if code is not found
              }
          } else {
              print("No URL found in user activity.") // Debug: Print if no URL is found
          }
      }

      func extractCode(from url: URL) -> String? {
          // Create URLComponents from the URL
          guard let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
              print("Failed to create URLComponents.") // Debug: Print if URLComponents creation fails
              return nil
          }

          // Extract query items
          guard let queryItems = urlComponents.queryItems else {
              print("No query items found.") // Debug: Print if no query items are found
              return nil
          }

          // Find the query item with the name "code"
          if let codeItem = queryItems.first(where: { $0.name == "code" }) {
              return codeItem.value
          }

          print("Query item 'code' not found.") // Debug: Print if 'code' query item is not found
          return nil
      }
      
      func handleRewardRequest(accessToken: String, campaignToken: String) async {
        do {
          let reward = try await rewardAPI.rewardRequest(accessToken: accessToken, campaignToken: campaignToken)
          newReward = reward
          print(reward.type)
          if reward.type == "collector" {
            isShowingCollector = true
          } else if reward.type == "voucher" {
            isShowingVoucher = true
          }
        } catch {
          print("error")
        }
        
  }
  
  struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
      HomeView()
        .modelContainer(for: User.self, inMemory: true) { result in
          // Unwrap the result to get the container
          if case .success(let container) = result {
            let context = container.mainContext
            
            // Insert sample user into context
            let sampleUser = User(
              email: "test@example.com",
              dateJoined: Date(),
              nickname: "PreviewUser",
              avatar: "",
              cardType: "#Regular",
              qrCode: "",
              refresh: "",
              access: ""
            )
            context.insert(sampleUser)
          }
        }
    }
  }
}
