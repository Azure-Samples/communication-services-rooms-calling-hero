---
page_type: sample
languages:
- javascript
- nodejs
- csharp
products:
- azure
- azure-communication-services
---

# Rooms Hero Sample

This is a sample application to show how the Azure Communication Services Rooms SDK can be used to build a group calling experience with allowed participants. The client-side application is a React based user interface which uses Redux for handling complex state while leveraging Microsoft Fluent UI. Powering this front-end is a C# web application powered by ASP.NET Core to connect this application with Azure Communication Services.

Before contributing to this sample, please read our [contribution guidelines](./CONTRIBUTING.md).

## ❤️ Feedback

We appreciate your feedback and energy helping us improve our services. [If you've tried the service, please give us feedback through this survey](https://microsoft.qualtrics.com/jfe/form/SV_9WTOR2ItSo0oFee). 

## Prerequisites

- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Node.js (v18.16.1 and above)](https://nodejs.org/en/download/)
- [Visual Studio (2022 and above)](https://visualstudio.microsoft.com/vs/)
- [.NET Core 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this quickstart.

## Code structure

- ./Rooms Hero Sample/ClientApp: frontend client
  - ./Rooms Hero Sample/ClientApp/src
    - ./Rooms Hero Sample/ClientApp/src/Components : React components to help build the client app calling experience
    - ./Rooms Hero Sample/ClientApp/src/Containers : Connects the redux functionality to the React components
    - ./Rooms Hero Sample/ClientApp/src/Core : Containers a redux wrapper around the Azure Communication Services Web Calling SDK
  - ./ClientApp/src/index.js : Entry point for the client app
- ./Rooms Hero Sample/Controllers : Server app core logic for client app to get a token to use with the Azure Communication Services Web Calling SDK
- ./Rooms Hero Sample/Program.cs : Entry point for the server app program logic
- ./Rooms Hero Sample/Startup.cs : Entry point for the server app startup logic
- ./Rooms Hero Sample/Rooms Hero Sample.sln : Solution file for Rooms hero sample

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. `git clone https://github.com/Azure-Samples/communication-services-rooms-calling-hero.git`
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource)
4. Once you get the `Connection String`, add the connection string to the `Rooms Hero Sample/appsetting.json` file found under the `Rooms Hero Sample` folder. Input your connection string in the variable: `ResourceConnectionString`.

## Locally deploying the sample app

1. Go to Rooms Hero Sample folder and open `Rooms Hero Sample.sln` solution in Visual Studio
2. Run `Rooms Hero Sample` project. The browser will open at `localhost:44316`

### Troubleshooting

1. Solution doesn't build, it throws errors during NPM installation/build

	Clean/rebuild the C# solution

2. The app shows an "Unsupported browser" screen but I am on a [supported browser](https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support).

	If your app is being served over a hostname other then localhost, you must serve traffic over https and not http.

3. The nuget package is not installed

	You may have to manually add the included nuget file.
	1. In Visual Studio, go to Tools > NuGet Package Manager > Package Manager Settings
	2. Under NuGet Package Manager, click Package Sources
	3. Add a new source with the source path to the packages folder
	4. Navigate to Tools > NuGet Package Manager > Manage NuGet Packages for Solution
	5. In the open window, check Include prerelease and make sure package source is either All or your newly created source
	6. Search for Azure.Communication.Rooms and add it to the project

4. This page isn't working (HTTP ERROR 500)

	This may show up on the first boot whenever you run the project. Usually a refresh of the page will fix it, however you may need to restart the app (and possibly refresh again).

## Publish to Azure

1. Right click the `Rooms Hero Sample` project and select Publish.
2. Create a new publish profile and select your app name, Azure subscription, resource group and etc.
3. Before publish, add your connection string with `Edit App Service Settings`, and fill in `ResourceConnectionString` as key and connection string (copy from appsettings.json) as value

**Note**: While you may use http://localhost for local testing, the sample when deployed will only work when served over https. The SDK [does not support http](https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#user-webrtc-over-https).

## Building off of the sample

If you would like to build off of this sample to add calling capabilities to your own awesome application, keep a few things in mind:

- The sample serves a Single Page Application. This has a few implications.
  - By default, the served app cannot be embedded in another frame (e.g. as a web widget). See ./Rooms Hero Sample/Startup.cs for details on how to enable embedding.
  - By default, the backend disables Cross-Origin Resource Sharing (CORS). If you'd like to serve the backend APIs from a different domain than the static content, you must enable (restricted) CORS. This can be done by configuring a middleware in the backend in ./Rooms Hero Sample/Startup.cs, or by configuring your server framework to modify HTTP response headers.

## Additional Reading

- [Azure Communication Calling SDK](https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features) - To learn more about the calling web sdk
- [Redux](https://redux.js.org/) - Client-side state management
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
- [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-6.0) - Framework for building web applications
- [Rooms](https://docs.microsoft.com/en-us/azure/communication-services/concepts/rooms/room-concept) - Rooms Concept
