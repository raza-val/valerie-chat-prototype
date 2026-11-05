// tts list                         — English voices: id, name, language, quality (1 default, 2 enhanced, 3 premium)
// tts <voiceId> <outBase> <text> [rate]  — writes <outBase>.caf and <outBase>.json { words: [{w, at}], env: [0..1 per 1/60s], ms }
import AVFoundation
import Foundation

let args = CommandLine.arguments
if args.count > 1 && args[1] == "list" {
  for v in AVSpeechSynthesisVoice.speechVoices() where v.language.hasPrefix("en") {
    print("\(v.identifier)\t\(v.name)\t\(v.language)\t\(v.quality.rawValue)")
  }
  exit(0)
}
let voiceId = args[1], out = args[2], text = args[3]
final class Watch: NSObject, AVSpeechSynthesizerDelegate {
  var ranges: [(NSRange, Int)] = []
  var count: () -> Int = { 0 }
  func speechSynthesizer(_ s: AVSpeechSynthesizer, willSpeakRangeOfSpeechString r: NSRange, utterance: AVSpeechUtterance) { ranges.append((r, count())) }
}
let watch = Watch()
let synth = AVSpeechSynthesizer()
synth.delegate = watch
let u = AVSpeechUtterance(string: text)
guard let voice = AVSpeechSynthesisVoice(identifier: voiceId) else { print("no voice \(voiceId)"); exit(1) }
u.voice = voice
if args.count > 4, let r = Float(args[4]) { u.rate = r }
var file: AVAudioFile?
var marks: [(String, Int)] = []
var samples: [Float] = []
var sampleRate = 22050.0
var bytesPerFrame = 2
var done = false
watch.count = { samples.count }
synth.write(u, toBufferCallback: { buf in
  guard let pcm = buf as? AVAudioPCMBuffer else { return }
  if pcm.frameLength == 0 { done = true; return }
  if file == nil {
    sampleRate = pcm.format.sampleRate
    bytesPerFrame = Int(pcm.format.streamDescription.pointee.mBytesPerFrame)
    file = try! AVAudioFile(forWriting: URL(fileURLWithPath: out + ".caf"), settings: pcm.format.settings, commonFormat: pcm.format.commonFormat, interleaved: pcm.format.isInterleaved)
  }
  try! file!.write(from: pcm)
  let n = Int(pcm.frameLength)
  for i in 0..<n {
    if let f = pcm.floatChannelData { samples.append(f[0][i]) } else if let d = pcm.int16ChannelData { samples.append(Float(d[0][i]) / 32768) }
  }
}, toMarkerCallback: { ms in
  for m in ms { if ProcessInfo.processInfo.environment["DEBUG"] != nil { print("mark", m.mark.rawValue, m.byteSampleOffset, m.textRange) }; guard m.mark == .word else { continue }
    let ns = text as NSString
    marks.append((ns.substring(with: m.textRange), m.byteSampleOffset))
  }
})
while !done { RunLoop.current.run(until: Date().addingTimeInterval(0.02)) }
if ProcessInfo.processInfo.environment["DEBUG"] != nil { for (r, c) in watch.ranges { print("range", (text as NSString).substring(with: r), c) } }
file = nil
let win = Int(sampleRate / 60)
var env: [Float] = []
var i = 0
while i < samples.count { let e = min(samples.count, i + win); var a: Float = 0; for j in i..<e { a += samples[j] * samples[j] }; env.append(sqrt(a / Float(e - i))); i = e }
let peak = env.max() ?? 1
let totalMs = Double(samples.count) / sampleRate * 1000
func toMs(_ off: Int, _ div: Int) -> Int { Int(Double(off / div) / sampleRate * 1000) }
// byteSampleOffset is in bytes on some systems and frames on others: pick the reading that fits inside the audio.
let lastOff = marks.last?.1 ?? 0
let div = Double(lastOff) / sampleRate * 1000 > totalMs ? bytesPerFrame : 1
let json: [String: Any] = [
  "ms": Int(totalMs),
  "words": watch.ranges.map { ["w": (text as NSString).substring(with: $0.0), "at": Int(Double($0.1) / sampleRate * 1000)] },
  "env": env.map { (($0 / peak) * 100).rounded() / 100 },
]
let data = try! JSONSerialization.data(withJSONObject: json)
try! data.write(to: URL(fileURLWithPath: out + ".json"))
print("ok \(Int(totalMs))ms \(watch.ranges.count) words")
