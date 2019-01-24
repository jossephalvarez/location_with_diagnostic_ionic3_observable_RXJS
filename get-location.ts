   ionViewWillEnter() {
 if (this.platform.is('core') || this.platform.is('mobileweb')) {   
      this.subscription = this.getPosition()
        .flatMap(coords => {
            return this.getOffersByLocation(coords);           
          }
        )
        .subscribe((offers: Offer[]) => {
            this.processOffers(offers);
            this.loading.dismiss().then(r => {
              this.showText = true;
            });
          }, error => {
            this.loading.dismissAll();
            console.log("ERROR UBICATION ON DESKTOP->" + JSON.stringify(error));
            if (error.code == 1 && error.message === 'User denied Geolocation') {
              this.activateGPS(false);
            } else {
              this.navCtrl.pop().then(() => {
                this.presentToast('Ups, ha ocurrido un error.Inténtalo en breve.');
              })
            }
          }
        )
    } else {
      if (this.platform.is('android')) {
        this.subscription = this.diagnosticGPS()
          .flatMap(results => this.checkGPS(results))
          .flatMap((coords: Geoposition) => this.getOffersByLocation(coords))
          .subscribe((offers: Offer[]) => {
            this.processOffers(offers);
            this.loading.dismissAll();
          }, error => {
            console.log("ERROR----------->" + JSON.stringify(error));
            this.navCtrl.pop().then(() => {
              this.presentToast('Ups, ha ocurrido un error.Inténtalo en breve.');
            })
          })
      } else if (this.platform.is('ios')) {
        alert("IOS ");        
      }
      }
      
 getPosition() {
    return Observable.fromPromise(this.geolocation.getCurrentPosition());
  }
