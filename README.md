# 3Dee PRO PWA package

Tento balík obsahuje hotový web s podporou inštalácie na telefón a s lokálnou
knižnicou SheetJS pre import a export Excel súborov.

## Nasadenie na GitHub

1. V repozitári otvorte hlavnú vetvu `main`.
2. Nahrajte celý obsah tohto balíka so zachovaním priečinkov `icons` a `vendor`.
3. Existujúci `index.html` nahraďte súborom z balíka.
4. Počkajte, kým GitHub Pages dokončí nové nasadenie.
5. Web prvýkrát otvorte s internetovým pripojením a obnovte stránku.

Nie je potrebné ručne meniť HTML. Nový `index.html` sa od pôvodnej verzie líši
iba PWA metadátami, registráciou service workera a lokálnou cestou ku knižnici
SheetJS. Kalkulačné, dátové a cloudové funkcie zostali zachované.

## Inštalácia do telefónu

- Android/Chrome: menu prehliadača → **Pridať na plochu** alebo
  **Nainštalovať aplikáciu**.
- iPhone/Safari: **Zdieľať** → **Pridať na plochu**.

## Offline režim

Service worker ukladá iba statické rozhranie, ikony a lokálnu Excel knižnicu.
Google Apps Script, cloudové odpovede a používateľské údaje sa necachujú.
Synchronizácia s Google cloudom preto naďalej vyžaduje internet.

## Aktualizácia webu

Po nahratí novšej verzie zmeňte hodnotu `CACHE_VERSION` v `service-worker.js`,
napríklad z `3dee-pro-pwa-v1` na `3dee-pro-pwa-v2`. Staršia cache sa potom
automaticky odstráni.
