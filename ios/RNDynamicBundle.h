#import <React/RCTBridgeModule.h>

@interface RNDynamicBundle : NSObject <RCTBridgeModule> {
  
}
+(NSURL *)setBundleUrl:(NSString*)name;
@end

