import { Component,ViewChild  } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {HomePage} from "../home/home";
import {OptionPage} from "../option/option";
import { Printer,PrintOptions } from '@ionic-native/printer';
import {Screenshot} from "@ionic-native/screenshot";

declare var pdfMake: any;
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var cordova:any;
import {File} from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the ViewRecordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-records',
  templateUrl: 'view-records.html',
})
export class ViewRecordsPage {
  @ViewChild('myMap') myMap ;
  eventId;
  pdfObj = null;
  isCopart;
  letterObj = {
    to: '',
    from: '',
    text: ''
  }
  eventName;
  response: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbProvider: DatabaseProvider,
              public file:File,public fileOpener:FileOpener,public plt:Platform) {
    this.eventId = this.navParams.get('eventId');
    this.eventName = this.navParams.get('eventName');
    console.log("Event Id-> " + this.eventId + " eventName-> " + this.eventName);
    this.isCopart = this.navParams.get('eventCopart');
    this.getResponse(this.eventId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRecordsPage');
  }

  getResponse(eventId) {
    this.dbProvider.getAllResponseByEventId(eventId).then(data => {
      this.response = data;
      for (let response of data) {
        console.log("QUESTIONS-> " + response.QUESTIONS + " -> " + response.RESPONSE);
      }

    }).catch(error => {
      console.log("error View Records")
    })
  }

  HomePage() {
    this.navCtrl.push(OptionPage);
  }

//   printCurrentPage() {
//     let env = this;
//     console.log("Print start");
//     let myBase64 = "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";
//     var page = location.href;
//     // let folderpath = this.file.dataDirectory;
//     let base64Screenshot;
//     // let myBase64 = "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";
//     let contentType = "image/png";
//     let filename = "ourcodeworld.png";
//
//     this.screenShot.URI(80).then(data => {
//       base64Screenshot = data.URI;
//       env.printScreenShot(base64Screenshot);
//       let block = base64Screenshot.split(";");
// // Get the content type
//       let dataType = block[0].split(":")[1];// In this case "image/png"
// // get the real base64 content of the file
//       let realData = block[1].split(",")[1];
//       // env.base64ToGallery.base64ToGallery(realData, { prefix: '_img' }).then(
//       //   res => console.log('Saved image to gallery ', res),
//       //   err => console.log('Error saving image to gallery ', err)
//       // );
//       alert(data.URI);
//     }).catch(error => {
//       alert("Failed");
//     });
//     // cordova.plugins.printer.print(page, 'Document.html');
//     // this.printer.isAvailable().then(function () {
//     //   // var body = document.body;
//     //   console.log("Printer Available");
//     //   env.printer.print(myBase64,{}).then(function () {
//     //     alert("printing done successfully !");
//     //   }, function (data) {
//     //     alert("Error while printing !" + data);
//     //   });
//     // }, function () {
//     //   alert('Error : printing is unavailable on your device ');
//     // });
//
//     // env.printer.isAvailable().then(function () {
//     //   env.printer.print("https://www.techiediaries.com").then(function () {
//     //     alert("printing done successfully !");
//     //   }, function () {
//     //     alert("Error while printing !");
//     //   });
//     // }, function () {
//     //   alert('Error : printing is unavailable on your device ');
//     // });
//
//   }
//
//   printScreenShot(base64Screenshot) {
//     let env = this;
//     console.log("Print start");
//     this.printer.isAvailable().then(function () {
//       env.printer.print(base64Screenshot).then(function () {
//         alert("printing done successfully !");
//       }, function (data) {
//         alert("Error while printing !" + data);
//       });
//     }, function () {
//       alert('Error : printing is unavailable on your device ');
//     });
//   }


  createPf() {
    const before = Date.now();

    document.addEventListener('deviceready', () => {
      console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');

      //generate the pdf.
      cordova.plugins.pdf.htmlToPDF({
          data: "<html><div class=\"row header\" style=\"background-color: #c6579a;color: #fff;font-size: 16px;text-align: center;\"><div style=\"width: 90px;padding: 5px;\">Sr.No.</div><div class=\"col\">Event Name</div><div class=\"col\">Question</div><div class=\"col\">Response</div></div><div class=\"border_tab\" style=\"overflow-y: scroll;height: 455px;\"><div *ngFor=\"let response of response; let i = index\" class=\"row\" style=\"text-align: center;\"> <div style=\"width: 90px;padding: 5px;\">{{i}}</div><div class=\"col\">{{eventName}}</div><div class=\"col\">{{response.RESPONSE}}</div></div></div> </html>",
          documentSize: "A4",
          landscape: "landscape",
          type: "share"
        },
        (sucess) => console.log('sucess: ', sucess),
        (error) => console.log('error:', error));
    });
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  pdfGene() {
    console.log("Is it working");
    cordova.plugins.pdf.htmlToPDF({
        data: "<html> <h1>  Hello World  </h1> </html>",
        documentSize: "A4",
        landscape: "portrait",
        type: "base64"
      },
      (sucess) => console.log('sucess: ', sucess),
      (error) => console.log('error:', error));
  }



  createDocumentDefinition() {
    // let invoice = this.getDummyData();
    // var items = invoice.Items.map(function(item) {
    //   return [item.Description, item.Quantity, item.Price];
    // });
    //
    // var dd = {
    //   content: [
    //     { text: 'INVOICE', style: 'header'},
    //     { text: invoice.Date, alignment: 'right'},
    //
    //     { text: 'From', style: 'subheader'},
    //     invoice.AddressFrom.Name,
    //     invoice.AddressFrom.Address,
    //     invoice.AddressFrom.Country,
    //
    //     { text: 'To', style: 'subheader'},
    //     invoice.AddressTo.Name,
    //     invoice.AddressTo.Address,
    //     invoice.AddressTo.Country,
    //
    //     { text: 'Items', style: 'subheader'},
    //     {
    //       style: 'itemsTable',
    //       table: {
    //         widths: ['*', 75, 75],
    //         body: [
    //           [
    //             { text: 'Description', style: 'itemsTableHeader' },
    //             { text: 'Quantity', style: 'itemsTableHeader' },
    //             { text: 'Price', style: 'itemsTableHeader' },
    //           ]
    //         ]
    //       }
    //     },
    //     {
    //       style: 'totalsTable',
    //       table: {
    //         widths: ['*', 75, 75],
    //         body: [
    //           [
    //             '',
    //             'Subtotal',
    //             invoice.Subtotal,
    //           ],
    //           [
    //             '',
    //             'Shipping',
    //             invoice.Shipping,
    //           ],
    //           [
    //             '',
    //             'Total',
    //             invoice.Total,
    //           ]
    //         ]
    //       },
    //       layout: 'noBorders'
    //     },
    //   ],
    //   styles: {
    //     header: {
    //       fontSize: 20,
    //       bold: true,
    //       margin: [0, 0, 0, 10],
    //       alignment: 'right'
    //     },
    //     subheader: {
    //       fontSize: 16,
    //       bold: true,
    //       margin: [0, 20, 0, 5]
    //     },
    //     itemsTable: {
    //       margin: [0, 5, 0, 15]
    //     },
    //     itemsTableHeader: {
    //       bold: true,
    //       fontSize: 13,
    //       color: 'black'
    //     },
    //     totalsTable: {
    //       bold: true,
    //       margin: [0, 30, 0, 0]
    //     }
    //   },
    //   defaultStyle: {
    //   }
    // };

    const before = Date.now();
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };
    document.addEventListener('deviceready', () => {
      console.log('DEVICE READY FIRED AFTER', (Date.now() - before), 'ms');

      //generate the pdf.
      cordova.plugins.pdf.htmlToPDF({
          data: this.myMap,
          documentSize: "A4",
          landscape: "landscape",
          type: "share"
        },
        (sucess) => console.log('sucess: ', sucess),
        (error) => console.log('error:', error));
    });
  }


  getDummyData() {
    return {
      Date: new Date().toLocaleDateString("en-IE", { year: "numeric", month: "long", day: "numeric" }),
      AddressFrom: {
        Name: "Sumit",
        Address: "Jaipur",
        Country: "India"
      },
      AddressTo: {
        Name: "Nicks",
        Address: "Chennai",
        Country: "Asia"
      },
      Items: [
        { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
        { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
      ],
      Subtotal: '€2010',
      Shipping: '€6',
      Total: '€2016'
    };
  }

}
