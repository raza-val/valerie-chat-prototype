// encode <framesDir> <publicDir> <out.mp4>
// Frames (NNNNN.jpg, 60fps) → H.264 .mov, then the voice clips from audio.json laid in at their times → .mp4.
import AVFoundation
import ImageIO
import Foundation

let args = CommandLine.arguments
let framesDir = URL(fileURLWithPath: args[1]), publicDir = URL(fileURLWithPath: args[2]), out = URL(fileURLWithPath: args[3])
let fps: Int32 = 60
let files = try FileManager.default.contentsOfDirectory(atPath: framesDir.path).filter { $0.hasSuffix(".jpg") }.sorted()
func image(_ name: String) -> CGImage {
  let src = CGImageSourceCreateWithURL(framesDir.appendingPathComponent(name) as CFURL, nil)!
  return CGImageSourceCreateImageAtIndex(src, 0, nil)!
}
let first = image(files[0])
let W = first.width, H = first.height
let tmp = out.deletingLastPathComponent().appendingPathComponent("_video.mov")
try? FileManager.default.removeItem(at: tmp); try? FileManager.default.removeItem(at: out)

let writer = try AVAssetWriter(outputURL: tmp, fileType: .mov)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoColorPropertiesKey: [AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2, AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2, AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2],
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 16_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoExpectedSourceFrameRateKey: 60, AVVideoMaxKeyFrameIntervalKey: 120],
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H,
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)
let space = CGColorSpace(name: CGColorSpace.sRGB)!
for (i, f) in files.enumerated() {
  while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
  autoreleasepool {
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
    CVPixelBufferLockBaseAddress(pb!, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: space,
                        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
    ctx.draw(image(f), in: CGRect(x: 0, y: 0, width: W, height: H))
    CVPixelBufferUnlockBaseAddress(pb!, [])
    adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
  }
}
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { print("video failed:", writer.error as Any); exit(1) }

struct Clip: Decodable { let url: String?; let at: Double; let until: Double? }
let clips = try JSONDecoder().decode([Clip].self, from: Data(contentsOf: framesDir.appendingPathComponent("audio.json")))
let comp = AVMutableComposition()
let video = AVURLAsset(url: tmp)
let total = video.duration
let cv = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
try cv.insertTimeRange(CMTimeRange(start: .zero, duration: total), of: video.tracks(withMediaType: .video)[0], at: .zero)
let ca = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
for c in clips {
  guard let u = c.url else { continue }
  let a = AVURLAsset(url: publicDir.appendingPathComponent(String(u.dropFirst())))
  let start = CMTime(seconds: c.at / 1000, preferredTimescale: 6000)
  if start >= total { continue }
  var len = a.duration
  if let until = c.until { len = CMTimeMinimum(len, CMTime(seconds: (until - c.at) / 1000, preferredTimescale: 6000)) }
  len = CMTimeMinimum(len, CMTimeSubtract(total, start))
  try ca.insertTimeRange(CMTimeRange(start: .zero, duration: len), of: a.tracks(withMediaType: .audio)[0], at: start)
  print(String(format: "  %@ at %.2fs for %.2fs", u, c.at / 1000, len.seconds))
}
let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetPassthrough)!
ex.outputURL = out
ex.outputFileType = .mp4
let exported = DispatchSemaphore(value: 0)
ex.exportAsynchronously { exported.signal() }
exported.wait()
guard ex.status == .completed else { print("export failed:", ex.error as Any); exit(1) }
try? FileManager.default.removeItem(at: tmp)
print(String(format: "%@ · %dx%d · %d frames · %.2fs", out.lastPathComponent, W, H, files.count, total.seconds))
