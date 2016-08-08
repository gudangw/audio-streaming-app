<div class="page-header">
  <h1  id="page-title">Releases > IOS</h1>
</div>

Detailed instructions on how to prepare a build releases for IOS.
CLI commands are MAC or Linux based. Windows users must adjust syntax.


___
### Preparation
Use the instructions from the project's README.md to download and setup a local repo. name the
new local repo using the version number. (audio-streaming-app-ios-083)

___
### Update the config.xml file
A few attributes need to be verified prior to creating a release build by adjusting the version number and ios-CFBundleVersion.
Be sure that the (id)
in the widget element is correctly set and has not been changed as Xcode will use it as the Bundle Identifier.

Set attributes in the widget element. Note and use the proper version number.
```
version ="0.8.0"

id="io.kirtan.audiostreaming"

ios-CFBundleVersion="0.8.0"
```

___
### Update package.json file
The build does not reference the version number in the package.json file but it should be
changed so the GitHub tag for the release includes the proper package.json.version.
```
version="0.8.0"
```

___
### Run the build --release command
The following command will create a release that will display in Xcode.
```
ionic prepare --release ios
```

___
### Xcode pre-archive setup
Open the 24 Hour platforms > ios > __Kirtan Radio.xcodeproj__ file to launch Xcode.
Verify general settings shown below. Note the Team setting as 24HourKirtan. If your Apple ID
is not associated with 24HouKirtan contact its admin.

```
Use 8.0 as the deployment target for IOS.
```

* ![Alt text](img/xcode/verify-general-settings.png)  

___
### Clean the Project
Select Product > Clean from from the menu bar.

___
### Create an Archive
Build an Archive and upload to iTunesConnect. Your Apple ID must exist at the target
commercial account for 24HourKirtan.

<br/>
##### Creating the Archive file  
Be sure the target is set to Kirtan radio, any device.
* ![Alt text](img/xcode/target-kirtan.png)

<br/>
Go to Product > __Archive__. If the menu Product > Archive is disabled you may need to
switch between Kirtan Radio and Cordova.Lib and back again.  

Follow the prompts to validate and upload to the iTunesConnect website.

<br/>
__Archive build error__  
In newer versions of Xcode 7.1+ a failure when creating
an archive may occur. (CDVViewController.h file not found) Build and run will succeed.

Add or update this line to the Build Settings -> Header Search Paths:
```
old > "$(OBJROOT)/UninstalledProducts/include"  
new > "$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include"   
```

<br/>
* ![Alt text](img/xcode/CDVViewController.not-found.png)

___
### Create GitHub Release
See the document: Releases > [GitHub Release](index.html?md=pages_builds_githubReleases.md).



___
### App Store (iTunesConnect)
Logon to https://itunesconnect.apple.com to manage the Archive for beta testing or production deployment.
More information about iTunesConnect in the __[Apple App Store](index.html?md=pages_builds_appstore.md)__ section.

___