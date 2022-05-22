//
//  RNDynamicBundle.m
//  DynamicBundle
//
//  Created by Roshan Gautam on 22.05.22.
//

#import <Foundation/Foundation.h>
#import "RNDynamicBundle.h"
#import <React/RCTBundleURLProvider.h> //This won't be required later


@implementation RNDynamicBundle

RCT_EXPORT_MODULE(RNDynamicBundle)

+(NSURL *)setBundleUrl {
  NSString *searchFilename = @"main.js";
  NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];

  NSString *getPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%@",searchFilename]];
  NSLog(@"%@", getPath);
  
  NSFileManager *fileManager  = [NSFileManager defaultManager];
  NSString *isDevMode = [[NSUserDefaults standardUserDefaults] valueForKey:@"isDevMode"];
  
  // finally it should look like this only the production code:
  // we always run from metro in case of debug mode
  
//  if ([fileManager fileExistsAtPath:getPath] && [isDevMode isEqualToString:@"true"]){
//        return [NSURL fileURLWithPath:getPath];
//      } else {
//        return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//      }
//  

#if DEBUG
  @try {
    if ([fileManager fileExistsAtPath:getPath] && [isDevMode isEqualToString:@"true"]){
      return [NSURL fileURLWithPath:getPath];
    } else {
      return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
    }
  }
  @catch (NSException *exception) {
  }
#else
if ([fileManager fileExistsAtPath:getPath] && [isDevMode isEqualToString:@"true"]){
      return [NSURL fileURLWithPath:getPath];
    } else {
      return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    }
#endif
}

RCT_EXPORT_METHOD(enableDevMode) {
  [[NSUserDefaults standardUserDefaults]setValue:@"true" forKey:@"isDevMode"];
}

RCT_EXPORT_METHOD(getDevMode:(RCTPromiseResolveBlock)resolve rejecter:(__unused RCTPromiseRejectBlock)reject) {
  resolve([[NSUserDefaults standardUserDefaults] valueForKey:@"isDevMode"]);
}

RCT_EXPORT_METHOD(disableDevMode) {
  [[NSUserDefaults standardUserDefaults]removeObjectForKey:@"isDevMode"];
}


@end


