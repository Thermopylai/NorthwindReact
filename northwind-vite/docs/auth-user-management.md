# Auth User Management – NorthwindReact

Tämä dokumentti kokoaa yhteen `auth-user-management`-haaran tilanteen, tehdyt ratkaisut ja jatkokehityskohteet. Haara liittyy NorthwindReact-front endin käyttäjänhallintaan ja sen yhteistoimintaan NorthwindRestApi-backendin kanssa.

## Tavoite

Tämän haaran tavoitteena oli rakentaa React-frontendiin ensimmäinen toimiva Admin-käyttäjähallinta, jonka kautta voidaan:

- hakea käyttäjiä eri suodattimilla
- näyttää käyttäjälista taulukossa
- poistaa käyttäjiä hallitusti
- lisätä käyttäjille rooleja
- poistaa käyttäjiltä rooleja
- resetoida käyttäjän salasana
- näyttää onnistumis- ja virheilmoitukset selkeästi

Käyttäjänhallinta sijaitsee frontendissä AdminUsersPage-sivulla, ja se käyttää backendin AuthController/AuthService-toimintoja.

## Nykyinen toteutus

### Frontendin pääosat

Keskeiset tiedostot:

```text
src/pages/AdminUsersPage.jsx
src/components/admin/UserSearchBar.jsx
src/components/admin/UsersTable.jsx
src/components/admin/ResetPasswordModal.jsx
src/auth/AuthContext.jsx
```

### AdminUsersPage

`AdminUsersPage` toimii käyttäjänhallinnan pääsivuna. Sen vastuulla on:

- käyttäjähaun suorittaminen `searchUsers`-funktion kautta
- hakusuodattimien ylläpito
- käyttäjälistan tilan ylläpito
- roolilistan lataaminen `listRolePermissions`-funktion kautta
- roolin lisääminen käyttäjälle
- roolin poistaminen käyttäjältä
- käyttäjän poistaminen
- salasanan resetointimodaalin avaaminen ja sulkeminen
- onnistumis- ja virheilmoitusten näyttäminen

Käyttäjät haetaan `searchUsers`-funktion kautta myös alkulatauksessa, jotta sama hakumekanismi toimii sekä oletuslistauksessa että suodatetuissa hauissa.

### UserSearchBar

`UserSearchBar` on erillinen hakulomakekomponentti. Se saa hakuehdot ja handlerit propsien kautta.

Hakusuodattimia ovat esimerkiksi:

- UserId
- UserName
- Email
- Role
- Permission

### UsersTable

`UsersTable` näyttää käyttäjät taulukossa. Taulukosta voidaan:

- tarkastella käyttäjän perustietoja
- nähdä käyttäjän nykyiset roolit
- lisätä käyttäjälle uusi rooli valikosta
- poistaa käyttäjältä olemassa oleva rooli
- avata salasanan resetointimodaali
- poistaa käyttäjä

Roolien lisäämistä varten taulukossa käytetään rivikohtaista valintaa. Jokaisella käyttäjärivillä on oma valittu rooli, jotta eri rivit eivät jaa samaa select-tilaa.

### ResetPasswordModal

`ResetPasswordModal` on oma komponenttinsa salasanan resetointia varten.

Modaalissa:

- näytetään käyttäjä, jonka salasanaa ollaan resetoimassa
- syötetään uusi salasana
- näytetään resetointiin liittyvät virheet modaalin sisällä
- estetään tyhjän salasanan lähetys
- käytetään Bootstrapin modal-rakennetta ja backdropia

Salasanakentässä on huomioitu selaimen autofill ja vahvan salasanan ehdotukset. Kentän arvo normalisoidaan merkkijonoksi, jotta stateen ei päädy vahingossa event-objektia tai muuta objektia.

## Backend-yhteensopivuus

Backendissä käyttäjänhallinnan admin-toiminnot on yhtenäistetty käyttämään `UserId`-tunnistetta.

Tärkeät DTO-mallit:

```text
UserRoleDto
- userId
- roleName

ResetPasswordDto
- userId
- newPassword
```

Frontendissä roolin lisääminen ja poistaminen lähettävät backendille payload-objektin, esimerkiksi:

```js
const payload = {
  userId,
  roleName: role,
};

const response = await assignRole(payload);
```

Sama periaate koskee salasanan resetointia:

```js
const payload = {
  userId,
  newPassword: passwordValue,
};

const response = await resetPassword(payload);
```

## Backend-suojaukset

Backendissä on lisätty tärkeitä suojauksia:

- käyttäjä ei voi poistaa itseään
- oletus `admin` -käyttäjää ei voi poistaa
- oletus `admin` -käyttäjältä ei voi poistaa `Admin`-roolia
- liian heikot salasanat palauttavat virheen Identityn validoinnin kautta
- olemattoman käyttäjän salasanan resetointi palauttaa virheen

Lisäksi `IdentitySeeder` toimii viimeisenä kehitysympäristön turvaverkkona: jos oletus `admin` -käyttäjä puuttuu, se voidaan luoda uudelleen backendin käynnistyksen yhteydessä.

Huomio: `IdentitySeeder` vaikuttaa vasta backendin uudelleenkäynnistyksen yhteydessä.

## AuthContext-muutokset

`AuthContext.jsx`-tiedostossa on tehty käyttäjänhallinnan kannalta tärkeitä muutoksia:

- käyttäjän roolit muodostetaan `RolePermissions`-listan pohjalta, jos suora roles-lista ei ole käytettävissä
- käyttäjän permissionit muodostetaan joko suoraan permissions-listasta tai roolien permissioneista
- AuthContextin funktiot on memoisoitu `useCallback`-hookilla
- AuthContextin `value` on memoisoitu `useMemo`-hookilla

Tämä vähentää turhia renderöintejä ja helpottaa komponenttien dependency-listojen hallintaa.

## React-hookkeihin liittyvät havainnot

`AdminUsersPage` käyttää `loadUsers`-funktiota, joka on memoisoitu `useCallback`-hookilla. Tämä oli tarpeen, jotta käyttäjälistan lataaminen `useEffect`issä ei aiheuta loputonta renderöintisilmukkaa.

Tärkeä rakenne:

```js
const loadUsers = useCallback(async (activeFilters) => {
  // käyttäjien haku
}, [searchUsers]);

useEffect(() => {
  loadUsers(defaultFilters);
}, [loadUsers]);
```

Koska `searchUsers` tulee AuthContextista, myös AuthContextin funktioiden memoisaatio on tärkeää.

## CSS ja tyylit

CSS-importit on siirretty Vite/React-projektille sopivampaan muotoon JavaScript-importtien kautta.

Suositeltu järjestys:

```js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/bootstrap-theme.css";
import "./styles/style.css";
```

Tärkeä havainto: jos CSS-tiedostoja lisätään sekä `index.html`-tiedostossa että JavaScript-importteina, latausjärjestys voi aiheuttaa yllättäviä prioriteettiongelmia. Tässä projektissa Bootstrapin importatut säännöt ohittivat aiemmin `index.html`-tiedostossa lisätyn teeman.

## Selaimen autofill-havainto

Firefoxin vahvan salasanan automaattitäyttö aiheutti kehitysvaiheessa tilanteen, jossa salasanakenttään päätyi `[object Object]`-arvo. Koodia suojattiin normalisoimalla input-arvo aina merkkijonoksi, mutta lopullinen korjaus vaati Firefoxin sulkemisen ja välimuistin tyhjentämisen.

Debug-muistiin:

```text
Jos password/autofill käyttäytyy oudosti:
1. tarkista onChange ja event.target.value
2. varmista, että value on aina string
3. lisää tarvittaessa onInput
4. testaa private window -tilassa
5. testaa toisessa selaimessa
6. tyhjennä selaimen välimuisti
7. sulje selain kokonaan ja käynnistä uudelleen
```

## Valmis toiminnallisuus

Tämän haaran lopussa toimivaksi on varmistettu:

- käyttäjien haku suodattimilla
- käyttäjälistan näyttäminen taulukossa
- tyhjän hakutuloksen käsittely erillisenä normaalina tilanteena
- onnistumis- ja virheilmoitukset ajastimilla
- käyttäjän poistaminen vahvistuksen jälkeen
- käyttäjän itsepoiston esto backendissä
- oletus-adminin poiston esto backendissä
- roolin lisääminen käyttäjälle
- roolin poistaminen käyttäjältä
- oletus-adminilta Admin-roolin poistamisen esto backendissä
- salasanan resetointi modaalin kautta
- liian heikkojen salasanojen virhekäsittely
- olemattoman käyttäjän virhekäsittely
- AuthContextin funktioiden ja valuen memoisaatio
- CSS-importtien siistiminen

## Mahdolliset jatkokehityskohteet

Seuraavia asioita voi parantaa myöhemmin:

- korvaa `window.confirm` omilla Bootstrap/React-modaaleilla
- lisää erillinen vahvistusmodaali käyttäjän poistolle
- lisää erillinen vahvistusmodaali roolin poistolle
- lisää salasanan generointipainike resetointimodaaliin
- lisää frontend-validointi salasanan minimivaatimuksille
- lisää paremmat loading-tilat roolien lisäykseen ja poistoon
- lisää käyttäjäkohtainen toiminnon disable-tila, jotta samaa toimintoa ei voi klikata useasti nopeasti
- tarkista saavutettavuus: focus trap, Escape-sulkeminen ja modalin focus-palautus
- lisää testikäyttäjät ja käyttöohje README-tiedostoon

## Seuraava suositeltu haara

Tämän haaran jälkeen luontevia seuraavia branch-keskusteluja ovat:

### 1. permissions-and-roles

Tavoite: tarkistaa backendin `Permissions`, `RolePermissions`, authorization policyt ja frontendin `PermissionGate` yhtenäiseksi kokonaisuudeksi.

Tässä haarassa varmistetaan, että:

- permission-nimet ovat yhdenmukaisia
- roolien permissionit vastaavat tarkoitusta
- navbar näyttää oikeat linkit oikeille käyttäjille
- CRUD-painikkeet näkyvät vain oikeilla oikeuksilla
- backend estää samat toiminnot, jotka frontend piilottaa

### 2. api-client-cleanup

Tavoite: siistiä frontendin API-kerros.

Tässä haarassa voidaan keskittää:

- base URL
- auth-headerit
- virheenkäsittely
- success/message/users fallbackit
- request/response-apufunktiot

### 3. products-reference-page

Tavoite: viimeistellä ProductsPage mallisivuksi, jonka rakenteella muut entiteettisivut voidaan yhtenäistää.

## Yhteenveto

`auth-user-management`-haara tuotti toimivan ensimmäisen version Admin-käyttäjähallinnasta. Toteutus on nyt siinä kunnossa, että sitä voidaan käyttää pohjana sekä rooli- ja permission-mallin jatkokehitykselle että muiden admin-toimintojen rakentamiselle.

Tärkein arkkitehtuuripäätös tässä haarassa oli, että Admin-käyttöliittymä hallitsee käyttäjien rooleja, kun taas yksittäiset permissionit pysyvät backendin määrittämän roolimallin vastuulla.
