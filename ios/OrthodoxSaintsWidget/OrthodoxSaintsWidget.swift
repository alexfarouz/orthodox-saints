import WidgetKit
import SwiftUI
import UIKit

// MARK: - Model
struct SaintInfo { let name: String; let quote: String; let imageName: String }

let SAINT_BY_HOUR: [SaintInfo] = [
  SaintInfo(
    name: "St. Anthony the Great",
    quote: "Everyday I say to myself, \"Today I will begin.\"",
    imageName: "st-anthony"
  ),
  SaintInfo(
    name: "St. Jacob of Nisibis",
    quote: "Lord, strengthen our hearts in Your faith and keep our lips from deceit, that we may praise Your holy Name.",
    imageName: "st-jacob-nisibis"
  ),
  SaintInfo(
    name: "St. Athanasius the Apostolic",
    quote: "O Lord, grant me to behold the light of Thy grace, that I may understand Thy divine words that are read unto me.",
    imageName: "st-athanasius"
  ),
  SaintInfo(
    name: "St. John Chrysostom",
    quote: "O Lord, deprive me not of Thy heavenly blessings.",
    imageName: "st-johnc"
  ),
  SaintInfo(
    name: "St. Moses the Strong",
    quote: "Go, sit in your cell, and your cell will teach you everything.",
    imageName: "st-moses"
  ),
  SaintInfo(
    name: "St. Ephrem the Syrian",
    quote: "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.",
    imageName: "st-ephrem-syrian"
  ),
  SaintInfo(
    name: "St. Shenouda the Archimandrite",
    quote: "Master, do not allow these holy things to be unto my condemnation, but unto purification of soul and body and spirit.",
    imageName: "st-shenouda"
  ),
  SaintInfo(
    name: "St. Pachomius the Great",
    quote: "Come and dwell within us, cleanse us of all impurity, and save our souls, O Good One.",
    imageName: "st-pachomius"
  ),
  SaintInfo(
    name: "St. Isaac the Syrian",
    quote: "O Lord, give me humility, simplicity, and love which are above all virtues.",
    imageName: "st-isaac"
  ),
  SaintInfo(
    name: "St. Gregory of Nazianzus",
    quote: "My soul is like a house, small for You to enter, but I pray You to enlarge it. It is in ruins, but I ask You to remake.",
    imageName: "st-gregory-theologian"
  ),
  SaintInfo(
    name: "St. Arsenius the Great",
    quote: "O God, do not leave me; I have done nothing good in Thy sight, but grant me, in Thy mercy, to make a beginning.",
    imageName: "st-arsenius"
  ),
  SaintInfo(
    name: "St. Severus",
    quote: "O Lord who sittest in the secret place of the Most High, shelter us beneath the shadow of the wings of Thy mercy, and have compassion upon us",
    imageName: "st-severus"
  ),
  SaintInfo(
    name: "St. Abba Agathon",
    quote: "Grant me to see my own faults and not to judge my brother.",
    imageName: "st-agathon"
  ),
  SaintInfo(
    name: "St. Jacob of Serugh",
    quote: "O Christ, our hope, adorn our souls with Your light and make them dwell in the peace of Your kingdom.",
    imageName: "st-jacob-serugh"
  ),
  SaintInfo(
    name: "St. Abba Poemen",
    quote: "Lord, heal me from my sins, for they are like leprosy before Your holiness.",
    imageName: "st-poemen"
  ),
  SaintInfo(
    name: "Pope Kryillos VI",
    quote: "I ask You not to treat me according to my sins or hardness of heart, but according to Your mercy and sympathy.",
    imageName: "pope-kyrillos"
  ),
  SaintInfo(
    name: "Pope Shenouda III",
    quote: "Lord, I do not find anyone to have mercy on me and hold me. You are the One whom I trust, to whom I open my heart and tell all my secrets.",
    imageName: "pope-shenouda-iii"
  ),
  SaintInfo(
    name: "St. Serapion",
    quote: "O God of powers, heal every sickness and every infirmity; deliver those in suffering and raise them up.",
    imageName: "st-serapion"
  ),
  SaintInfo(
    name: "St. Mary of Egypt",
    quote: "O Lady, Mother of God, do not forsake me a sinner; permit me to enter, that I may behold the Cross of Your Son.",
    imageName: "st-mary-egypt"
  ),
  SaintInfo(
    name: "St. Basil the Great",
    quote: "Purify our souls, our bodies, and our spirits, that we may partake of Your Holy Mysteries without falling into judgment.",
    imageName: "st-basil"
  ),
  SaintInfo(
    name: "St. Sisoes the Great",
    quote: "O Lord, give me time to repent, for I tremble; yet I trust in Your mercy.",
    imageName: "st-sisoes"
  ),
  SaintInfo(
    name: "Fr. Bishoy Kamel",
    quote: "Make me worthy to stand before Your throne, and receive me not as one condemned, but as one delivered by Your mercy. Grant me Your peace. Amen.",
    imageName: "fr-bishoy-kamel"
  ),
  SaintInfo(
    name: "St. Pishoy the Perfect Man",
    quote: "My Lord, heaven is too small for You and earth trembles at Your glory. How can a sinner like me carry You?",
    imageName: "st-pishoy"
  ),
  SaintInfo(
    name: "St. Macarius the Great",
    quote: "Thou hast led me to the end of this day—be merciful to me a sinner; raise up my fallen soul.",
    imageName: "st-macarius"
  )
]


struct SimpleEntry: TimelineEntry { let date: Date; let saint: SaintInfo }

// MARK: - Provider
struct Provider: TimelineProvider {
  
  private func getSaintForHour(_ hour: Int) -> SaintInfo {
    let index = hour % 24
    return SAINT_BY_HOUR[index]
  }
  
  func placeholder(in context: Context) -> SimpleEntry {
    let now = Date()
    let calendar = Calendar.current
    let hour = calendar.component(.hour, from: now)
    return SimpleEntry(date: now, saint: getSaintForHour(hour))
  }
  
  func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
    let now = Date()
    let calendar = Calendar.current
    let hour = calendar.component(.hour, from: now)
    completion(SimpleEntry(date: now, saint: getSaintForHour(hour)))
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
    let calendar = Calendar.current
    let now = Date()
    let currentHour = calendar.component(.hour, from: now)
    
    var entries: [SimpleEntry] = []
    
    // Current hour entry
    if let startOfCurrentHour = calendar.date(from: calendar.dateComponents([.year, .month, .day, .hour], from: now)) {
      entries.append(SimpleEntry(date: startOfCurrentHour, saint: getSaintForHour(currentHour)))
    }
    
    // Next 5 hours only to reduce memory
    for offset in 1...5 {
      if let futureHour = calendar.date(byAdding: .hour, value: offset, to: now),
         let startOfFutureHour = calendar.date(from: calendar.dateComponents([.year, .month, .day, .hour], from: futureHour)) {
        let hour = calendar.component(.hour, from: futureHour)
        entries.append(SimpleEntry(date: startOfFutureHour, saint: getSaintForHour(hour)))
      }
    }
    
    // Refresh in 6 hours
    let refreshDate = calendar.date(byAdding: .hour, value: 6, to: now) ?? now.addingTimeInterval(21600)
    
    let timeline = Timeline(entries: entries, policy: .after(refreshDate))
    completion(timeline)
  }
}

// MARK: - View helpers
struct WidgetBGClear: ViewModifier {
  func body(content: Content) -> some View {
    if #available(iOS 17.0, *) {
      content.containerBackground(.clear, for: .widget)
    } else {
      content
    }
  }
}

// Optimized image loading
struct SafeImage: View {
  let name: String
  
  var body: some View {
    if let ui = UIImage(named: name, in: .main, compatibleWith: nil) {
      // Downsample image to widget size to save memory
      let targetSize = CGSize(width: 340, height: 340)
      if let downsampled = downsample(image: ui, to: targetSize) {
        Image(uiImage: downsampled).resizable()
      } else {
        Image(uiImage: ui).resizable()
      }
    } else {
      ZStack {
        Color.gray
        Text("MISSING:\n\(name)")
          .font(.caption2)
          .bold()
          .foregroundStyle(.white)
          .multilineTextAlignment(.center)
      }
    }
  }
  
  private func downsample(image: UIImage, to targetSize: CGSize) -> UIImage? {
    let size = image.size
    let widthRatio = targetSize.width / size.width
    let heightRatio = targetSize.height / size.height
    let ratio = min(widthRatio, heightRatio)
    
    let newSize = CGSize(width: size.width * ratio, height: size.height * ratio)
    
    UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
    image.draw(in: CGRect(origin: .zero, size: newSize))
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    return newImage
  }
}

// MARK: - Widget View
struct OrthodoxSaintsWidgetEntryView: View {
  var entry: Provider.Entry

  private func hourString(_ d: Date) -> String {
    let f = DateFormatter()
    f.dateFormat = "h a"
    return f.string(from: d)
  }

  var body: some View {
    GeometryReader { geo in
      ZStack(alignment: .topLeading) {
        SafeImage(name: entry.saint.imageName)
          .scaledToFill()
          .frame(width: geo.size.width, height: geo.size.height)
          .clipped()

        Text("\(hourString(entry.date)): \"\(entry.saint.quote)\"")
          .font(.system(size: 16, weight: .bold, design: .rounded))
          .foregroundStyle(.white)
          .shadow(color: .black.opacity(0.95), radius: 4)
          .lineLimit(10)
          .minimumScaleFactor(0.7)
          .multilineTextAlignment(.leading)
          .padding(12)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    .clipShape(ContainerRelativeShape())
    .modifier(WidgetBGClear())
  }
}

// MARK: - Widget
struct OrthodoxSaintsWidget: Widget {
  let kind = "OrthodoxSaintsWidget_DEBUG3"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      OrthodoxSaintsWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Orthodox Saints")
    .description("Hourly prayers from Orthodox Saints")
    .supportedFamilies([.systemSmall])
    .contentMarginsDisabled()
  }
}
