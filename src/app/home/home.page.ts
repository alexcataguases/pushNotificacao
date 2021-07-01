import { Component, OnInit } from '@angular/core';// adicionado aqui o OnInit

import { HttpClient, HttpClientModule } from '@angular/common/http';//TEM QUE SER COLOCADO TB NO APP.MODULE.TS!!!!

//imports do PUSH
import { FCM } from '@capacitor-community/fcm';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
//------------

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {// adicionado aqui o OnInit

  chave = "sem chave";
  ngOnInit() {
    this.registro();
    this.registroNoTopico("topicotodos");
  }

  constructor(public http: HttpClient) { }

  registro() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        alert('Push registration success, token: ' + token.value);
        this.chave = token.value;
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  registroNoTopico(nome) {
    PushNotifications.register()
      .then((_) => {
        FCM.subscribeTo({ topic: nome })
          .then((r) => alert(`subscribed to topic ${nome}`))
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(JSON.stringify(err)));
  }

  unsubscribeFrom(nome) {//NÃO ESTOU USANDO ESSA FUNÇÃO NESTE EXEMPLO
    FCM.unsubscribeFrom({ topic: nome })
      .then((r) => alert(`unsubscribed from topic ${nome}`))
      .catch((err) => console.log(err));
    FCM.deleteInstance();

  }

  formulario: any = { titulo: '', texto: '' };
  enviarMensagem() {
    let resultadoInserir: any = [];
    this.http.get("https://petshopkta.000webhostapp.com/firebase/mensagempushdocelular.php?titulo=" + this.formulario.titulo + "&texto=" + this.formulario.texto).subscribe(
      data => {
        ;
      })
    alert("Mensagem enviada pra todos");
    this.formulario.titulo = "";
    this.formulario.texto = "";
  }

}
