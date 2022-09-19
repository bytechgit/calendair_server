import { createRequire } from "module";
import { Request, Application, Response } from "express";
const require = createRequire(import.meta.url);
var admin = require("firebase-admin");
const schedule = require('node-schedule');

var serviceAccount = require("./serviceAccountKey.json");
var firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = firebaseApp.firestore(); 
import { getMessaging, MulticastMessage} from "firebase-admin/messaging";

const localDict: Map<string, any> = new Map<string,any>();


class MyFirebaseNotification {

  constructor(private app: Application) {

    db.collection("Assignments")
    .onSnapshot((snapshot:any) => {
        snapshot.docChanges().forEach((change:any) => {
            if (change.type === "added") {
              console.log((change.doc.id as string).substring(0,12))
              const assignment = change.doc.data();
              const date: Date = assignment.dueDate.toDate();
              date.setDate(date.getDate()-1);
              if(date > new Date())
              {
                const reminder = schedule.scheduleJob(date,()=>{
                  console.log("REMINDER");
                  this.sendNotificationToTopic((change.doc.id as string).substring(0,12)+"_assignments", assignment.title,"1 day left to finish.");
                  localDict.get(change.doc.id)?.cancel();
                });
                localDict.set(change.doc.id, reminder);
              } 
            }
            if (change.type === "modified") {
              
            }
            if (change.type === "removed") {
              console.log("REMOVED");
              localDict.get(change.doc.id)?.cancel();
            }
        });
    });

    this.init();
  }

  init() {
    this.app.post(
      "/testsend",
      async (req: Request, res: Response): Promise<void> => {
         res.send("asd");
  });
   

  }
  public async sendNotificationToTopic(
    topic: string,
    title: string,
    body: string
  ) {
    const message = {
      data: {
        score: "850",
        time: "2:45",
      },
      notification: {
        title: title ?? "No title",
        body: body ?? "No message",
    // image:
       //   "https://lh3.googleusercontent.com/ogw/ADea4I5Z-pEWkfhAeASbHku2-CH_sG5H1QWZc36rvtUJ=s64-c-mo",
      },
      //icon:"https://lh3.googleusercontent.com/ogw/ADea4I5Z-pEWkfhAeASbHku2-CH_sG5H1QWZc36rvtUJ=s64-c-mo",
      topic: topic,
    };
    return admin.messaging().send(message);
  }

 public async sendNotificationToUser(
    tokens: string[],
    title: string,
    message: string,
    image: string
  ) {
    const messageObject: MulticastMessage = {
      data: {
        imageURL: image,
      },

      notification: image
        ? ({
            title: title ?? "No title",
            body: message ?? "No message",
            //imageUrl: image,
            image: image,
          } as any)
        : {
            title: title ?? "No title",
            body: message ?? "No message",
          },

      tokens: tokens,
    };
    return admin.messaging().sendMulticast(messageObject);
  }

  
}

export class BTFirebaseNotification {
  static instance: MyFirebaseNotification | null = null;
  static app: Application;
  constructor() {
    throw new Error("Use Singleton.getInstance()");
  }
  static getInstance() {
    if (!BTFirebaseNotification.instance)
      console.error("Notification nije inicijalizovan, pozovite funkciju init().");

    return BTFirebaseNotification.instance;
  }
  static init(app: Application) {
 
    if (!BTFirebaseNotification.instance) {
      BTFirebaseNotification.instance = new MyFirebaseNotification(
        app
      );
    }
  }
}

export function getNotificationService() {
  return BTFirebaseNotification.getInstance();
}
