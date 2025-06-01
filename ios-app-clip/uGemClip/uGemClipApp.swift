/*
 See LICENSE folder for this sample’s licensing information.
 */

import SwiftUI
import SwiftData

@main
struct ScrumdingerApp: App {
  
  // Using modelContext to add, fetch, delete and update local database
  @Environment(\.modelContext) var modelContext
  
  var body: some Scene {
    
    WindowGroup {
      MainView()
        .modelContainer(for: User.self)
    }
  }
  }
