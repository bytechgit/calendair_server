import { createRequire } from "module";
import { Request, Application, Response } from "express";
const require = createRequire(import.meta.url);
const schedule = require('node-schedule');

import { getMessaging, MulticastMessage} from "firebase-admin/messaging";
import { getFirestore  } from "firebase-admin/firestore";
const admin = require("firebase-admin");

const key = require("./serviceAccountKey.json");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "calendair-8abb9",
    "private_key_id": "fbf597961ea5ac1b20947bf077d4c39d39547b27",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTSn7b2gzr9/UM\nkG1htX7Cf1KJYq6iQ1Ld4lXkJlb5f9bBVgfTJXzW/g4KiH9tnPRtbFY+W8gxb//O\nCLKDjAlwKCmM7dCDqiribF7wJ/cLp+qCNexQl5rBQLsh0a0n8GVff5ZVbJYxy/O6\nY7UVPRlBrLQZwaNROzxSQX6c8GU61Aoirvt7x0C1ohNTG4O+38QiiUyrRbBrisqU\nMzVSMhq+v1TQFClDWDyIjaLK+JQY0qRoWsx8nAKUGdwuMRBarc5XztbpWj85nayc\ndyIY3fMb7HhneBXLWCSeEvWYM6nSd4Lco+kUN5LSa83WjMYkZcZgFGXbJy9xFq2W\nWpR0XZbRAgMBAAECggEACPVLwUd6GBcz7sphM7NSIQZVRNS1GDp54ZO+q3ZTPYAb\nZbV7uvllhg4sOJLoFKiqU1YmqerjQnH8U/mykUaA67LOoaMUZrCgpHYowUid+XYS\nUM5yp61r0K+FHiPCeTqRUNFJyXrl6OQNmB9Qs/isBsL4LnWY7zOoCdzwxF7o2j6z\n9LVAmU1CQhaDRJs8VV4ljXF60JSNltRdh8sd+gPEfqvq69fd7LsQ97464axpx6wt\nQT/DXybfQf1nBonXUcABniNhW7Q8m51OoAEMBiefBPuombR47aZBRClFi5BNKwih\nimSWeJYA3npTxA9IqR6eFXX5fXL+A3LvOZjuzSEbgQKBgQDLQXYsRyCi6cG+4l67\nz+pNXF1rWuCCe3qEj1YtNaDFIOLsNajaUPZJ41xF/tzBMqpVwBoZGj0nMZAeMFsc\nhZhdKQqa74poXqZwlsOp+RDi7vLnc8ac3cflODCLWncOZKMPD2peaCE8Vc/nL9a6\nYujml4we7yVRKJUjCZWCBMekUQKBgQC5gznjufHPFFd6WqKvYm8f8W3ujHmTiNDE\nZ7i06iekauY/z6PMPrxRHA3VZ0qYYTymw4PzDK17sX5OEeH85f2H0CA98gKnagCH\nHkzvWbgnjykgylPBHjPmf7Jebyb8fikANrk0BT0COD58Juw0y1UlPQ3iym81AwuP\nLhxlwsaqgQKBgQCvnO+tcgcQu0da1dtkClA2ZweQKgSwuF8zCWU7yooNyExIKlSp\nzCn/zSF8mKfDhTMGw+PIrJMJuhj6/Gy8R/FNDJjNJQpBAwZrYNfNlBSy/iGBONbx\n0e1UbygCPzd+iBUafgc5al7M8pee+AZfI/Z2xZmbYKStapLwouc6X0bfAQKBgHfj\nuNvVZdLAgLBQNudFpC9upe8O1dtlBhaIObShxzDY7Si8Fk1/FdENYltSP8EuxjW4\nEWRYAx33XXsyz2vTbwAAn3WpG9H6DZFFIc9lmj/mo1vPpkUeMch7KlkhWH7BQdoj\ng5l88SqoEqnFtc2AwuwoAvtYfHo0F5pW4H9bW20BAoGACGaL5aVWRnEbM9Vx5hYr\nDr+OS3ZeQWwFi0OX11IqbKytlmnmvgNUI8fV3BNG2bLehb5Tbe816/0TfHuT8hTp\ncSNTGCGsOjyKXPnTPFz3c7s40H9EBigzFAjjIf0+aX0m+ilzKdy9g/GvjJGQv5fW\napo9mrVkIh6F4kJYedJtkwQ=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-kl94j@calendair-8abb9.iam.gserviceaccount.com",
    "client_id": "101116806742509390576",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kl94j%40calendair-8abb9.iam.gserviceaccount.com"
  }
  ),
});

//admin.firestore.setLogFunction(console.log);

const localDict: Map<string, any> = new Map<string,any>();

//getFirestore(firebaseApp).collection("Assignments").doc().get().then((e)=>console.log(e));



class MyFirebaseNotification {

  constructor(private app: Application) {
    getFirestore(firebaseApp).collection("Assignments")
    .onSnapshot((snapshot:any) => {
        snapshot.docChanges().forEach((change:any) => {
            if (change.type === "added") {
              console.log((change.doc.id as string).substring(0,12))
              const assignment = change.doc.data();
              const date: Date = assignment.dueDate.toDate();
              date.setDate(date.getDate()-1);
              console.log(date);
              if(date > new Date())
              {
                const reminder = schedule.scheduleJob(date,()=>{
                  console.log("Sended assignment " + (change.doc.id as string).substring(0,12)+"_assignments");
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
  });
   

  console.log("FIREBASE INIT COMPLITED");
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

 public async sendNotificationToUsers(
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
