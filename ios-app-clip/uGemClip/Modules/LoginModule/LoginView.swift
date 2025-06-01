//
//  LoginView.swift
//  uGem
//
//  Created by Vytautas Urbelis on 13.02.2025.
//

import SwiftUI
import SwiftData
import AuthenticationServices

public struct LoginView: View {
  
  // Using modelContext to add, fetch, delete and update local database
  @Environment(\.modelContext) private var modelContext
  
  //Using Quary to fetch data from local database
  @Query private var user: [User]
  
  @State private var isLogedIn: Bool = false
  @State private var signInCoordinator: SignInWithAppleCoordinator?
  
  public var body: some View {
    VStack{
      if !isLogedIn {
        VStack {
          HStack {
            Image("uGem")
              .resizable()
              .frame(width: 140, height: 40)
            
          }
          .frame(width: 180, height: 60)
          .background(Color.white)
          .cornerRadius(20)
          .padding(.top, 40)
            
          Spacer()
          SignInWithAppleButton(.continue) { request in
            request.requestedScopes = [.email, .fullName]
          } onCompletion: { result in
              switch result {
          case .success(let authorization):
                Task {
                  await handleSuccessfulLogin(with: authorization)
                }
          case .failure(let error):
      //        handleLoginError(with: error)
                print("Error", error)
          }
          }
          .frame(height: 50)
          .padding()
        }
        .background(Image("homeBackground")
          .resizable()
          .edgesIgnoringSafeArea(.all)
          .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
        )
        .onAppear {
          triggerAutomaticSignIn()
        }
      } else {
        VStack {
          HomeView()
        }
      }
    }
    .onAppear {
      print("User:", user)
    }
  }
  
  /// Automatically open Sign in with Apple modal when the view appears
  private func triggerAutomaticSignIn() {
      let appleIDProvider = ASAuthorizationAppleIDProvider()
      let request = appleIDProvider.createRequest()
      request.requestedScopes = [.email, .fullName]

      let controller = ASAuthorizationController(authorizationRequests: [request])
      let coordinator = SignInWithAppleCoordinator { authorization in
          Task {
              await handleSuccessfulLogin(with: authorization)
          }
      }

      controller.delegate = coordinator
      controller.presentationContextProvider = coordinator

      // Keep a strong reference so the coordinator is not deallocated
      self.signInCoordinator = coordinator

      controller.performRequests()
  }
  
  private func handleSuccessfulLogin(with authorization: ASAuthorization) async {
      if let userCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
        
        let identityToken = String(data: userCredential.identityToken!, encoding: .utf8)
        
        let userAuthAPI = UserAuthAPI()
        do {
          let user = try await userAuthAPI.appleAuth(email: userCredential.email ?? "",
                                                     userID: userCredential.user,
                                                     identityToken: identityToken!)
          do {
            try modelContext.delete(model: User.self)
          }
          modelContext.insert(user)
          isLogedIn = true
        } catch {
          print("Error: \(error)")
        }
        
          
      }
  }

}


struct LoginView_Previews: PreviewProvider {
  static var previews: some View {
    LoginView()

  }
    
}
