/*
 See LICENSE folder for this sample’s licensing information.
 */

import SwiftUI
import SwiftData

public struct MainView: View {
  
  // Using modelContext to add, fetch, delete and update local database
  @Environment(\.modelContext) var modelContext

  //Using Quary to fetch data from local database
  @Query private var user: [User]
  
//  @State private var errorWrapper: ErrorWrapper?
  @State private var isAccessTokenExpired: Bool = true
  @State private var isLoading: Bool = true
  
  public var body: some View {
          VStack {
            if isLoading {
              VStack {
                Image("icon")
                  .resizable()
                  .frame(width: 100, height: 100)
              }
                .background(Image("homeBackground")
                  .resizable()
                  .edgesIgnoringSafeArea(.all)
                  .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
                )
            } else {
              VStack {
                if isAccessTokenExpired == false{
                  HomeView()
                } else {
                  LoginView()
                }
              }
            }
          }
          .onAppear{
            print(user)
            if user.isEmpty == false {
              Task {
                print("not empty")
                _ = await checkIfTokenExpired(accessToken: user[0].access)
  //              _ = await checkIfTokenExpired(accessToken: "asdasdasdasda")
              }
            } else {
              isLoading = false
              print("empty")
            }
          }
    }
  
  func checkIfTokenExpired(accessToken: String) async -> Void {
    isLoading = true
    do {
//      let response = await checkAccessToken(accessToken: accessToken)
      let userAuthAPI = UserAuthAPI()
      _ = try await userAuthAPI.checkAccessToken(accessToken: accessToken)
      isAccessTokenExpired = false
      isLoading = false
      print("not expired")
      
    } catch {
      print("expired")
      do {
        try modelContext.delete(model: User.self)
      } catch {
        print("Error deleting user")
      }
      isAccessTokenExpired = true
      isLoading = false
    }
  }
}


struct MainView_Previews: PreviewProvider {
  
  static var previews: some View {
    
    MainView()
      .modelContainer(for: User.self, inMemory: true)
  }
}
