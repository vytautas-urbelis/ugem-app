//
//  StampSelector.swift
//  uGem
//
//  Created by Vytautas Urbelis on 19.02.2025.
//

enum StampDesign: Int {
    case design1 = 1
    case design2 = 2
    case design3 = 3
    case design4 = 4
    case design5 = 5
    case design6 = 6
    case design7 = 7
    case design8 = 8
    case design9 = 9
    case design10 = 10
    case design11 = 11

    var imageName: String {
        switch self {
        case .design1:
            return "check"
        case .design2:
            return "apple"
        case .design3:
            return "beer"
        case .design4:
            return "bowl"
        case .design5:
            return "burger"
        case .design6:
            return "coffee"
        case .design7:
            return "hotdog"
        case .design8:
            return "ice-cream"
        case .design9:
            return "pizza"
        case .design10:
            return "smile"
        case .design11:
            return "star"
        }
    }
}
