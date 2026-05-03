# Auth flow

## Login / Register
- Frontend lähettää käyttäjätiedot backendille.
- Backend palauttaa AuthResponseDto-vastauksen.
- Frontend tallentaa access tokenin, refresh tokenin ja niiden vanhenemisajat.
- Frontend hakee käyttäjän tiedot `/api/auth/me`-endpointista.
- RolePermissions-listasta johdetaan roolit ja permissionit.

## Init
- Sovelluksen käynnistyessä AuthContext tarkistaa localStoragen tokenit.
- Jos access token on voimassa, käyttäjän tiedot haetaan suoraan.
- Jos access token on vanhentumassa mutta refresh token on voimassa, tehdään refresh.
- Jos refresh token on vanhentunut, auth-tila tyhjennetään.

## Automatic refresh
- AuthContext asettaa ajastimen access tokenin vanhenemisajan perusteella.
- Token päivitetään ennen vanhenemista.
- Backend palauttaa uuden access tokenin ja refresh tokenin.
- Molemmat tallennetaan localStorageen.

## Logout
- Frontend lähettää refresh tokenin backendille.
- Backend revokoi refresh tokenin.
- Frontend tyhjentää auth-tilan ja localStoragen.