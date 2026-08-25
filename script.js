const phoneNumber = "+37255552628";
const intro = "Tere! Nägin Kenzot Taara/Kruusa tänava piirkonnast kaugemal.";
const button = document.querySelector("#share-location");
const buttonLabel = button.querySelector("span");
const status = document.querySelector("#status");

function openSms(message) {
  const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isAppleDevice ? "&" : "?";
  window.location.href = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;
}

function resetButton() {
  button.disabled = false;
  buttonLabel.textContent = "Jaga asukohta SMS-iga";
}

button.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    status.textContent = "Asukohta ei saanud automaatselt lisada. Avan valmis SMS-i.";
    openSms(`${intro} Minu asukoht: `);
    return;
  }

  button.disabled = true;
  buttonLabel.textContent = "Ootan asukohta…";
  status.textContent = "Küsin telefonilt asukohta…";

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const latitude = coords.latitude.toFixed(6);
      const longitude = coords.longitude.toFixed(6);
      const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      status.textContent = "Asukoht lisatud. Avan SMS-i…";
      resetButton();
      openSms(`${intro} Minu asukoht: ${mapLink}`);
    },
    () => {
      status.textContent = "Asukohaluba ei antud. Avan SMS-i, kuhu saad koha ise lisada.";
      resetButton();
      openSms(`${intro} Minu asukoht: `);
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    },
  );
});
