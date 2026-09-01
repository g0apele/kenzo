const shareButton = document.getElementById("share-location");
const statusEl = document.getElementById("status");
const phoneNumber = "+37255552628";

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function openSms(body) {
  const encodedBody = encodeURIComponent(body);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // iOS and Android handle the SMS body separator slightly differently.
  const separator = isIOS ? "&" : "?";
  window.location.href = `sms:${phoneNumber}${separator}body=${encodedBody}`;
}

if (shareButton) {
  shareButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      setStatus("Selles seadmes ei ole asukoha määramine saadaval.");
      openSms(
        "Tere! Nägin Kenzot. Minu telefon ei saanud asukohta automaatselt lisada, kuid soovin tema kohta märku anda."
      );
      return;
    }

    shareButton.disabled = true;
    setStatus("Määran sinu asukohta…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const body =
          `Tere! Nägin Kenzot.\n\n` +
          `Asukoht: ${mapsLink}\n` +
          `Asukoha täpsus: umbes ${Math.round(accuracy)} m.\n\n` +
          `Saadan selle teate Kenzo QR-koodi kaudu.`;

        setStatus("Asukoht leitud. Avan valmis SMS-i…");
        openSms(body);

        setTimeout(() => {
          shareButton.disabled = false;
        }, 1200);
      },
      (error) => {
        shareButton.disabled = false;

        let message = "Asukohta ei õnnestunud määrata.";

        if (error.code === error.PERMISSION_DENIED) {
          message = "Asukoha kasutamiseks ei antud luba.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Telefon ei saanud hetkel sinu asukohta määrata.";
        } else if (error.code === error.TIMEOUT) {
          message = "Asukoha määramine võttis liiga kaua aega.";
        }

        setStatus(`${message} Avan SMS-i ilma asukohata.`);

        openSms(
          "Tere! Nägin Kenzot. Asukohta ei õnnestunud automaatselt lisada, kuid soovin tema kohta märku anda."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  });
}
