# Voting Bridge 🗳️

שרת bridge שמקבל הצבעות ממערכת טלפון ומעביר אותן בזמן אמת למערכת המשחק דרך Socket.IO.

```
מערכת טלפון → POST /game/voting → שרת → Socket.IO (לפי gameId) → מערכת משחק
```

---

## התקנה

```bash
npm install
cp .env_example .env
npm run dev
```

---

## API - HTTP (מערכת הטלפון שולחת)

### הצטרפות שחקן
```
POST /game/join
{
  "ApiExtension": "1011",   ← gameId (מספר החדר)
  "ApiPhone": "0501234567"
}
```

### שליחת הצבעה
```
POST /game/voting
{
  "ApiExtension": "1011",   ← gameId
  "ApiPhone": "0501234567",
  "vote": "1",
  "playerName": "ישראל",
  "ApiTime": 1234567890
}
```

---

## Socket.IO - (מערכת המשחק מאזינה)

### הצטרפות לחדר (חובה לפני קבלת הצבעות)
```js
socket.emit("join/room", { gameId: "1011" });
```

### האזנה להצבעות
```js
socket.on("voting", ({ phone, vote, playerName, gameId, time }) => {
  // כאן מעדכנים את המשחק
});
```

### האזנה להצטרפות שחקנים
```js
socket.on("player/joined", ({ phone, gameId }) => {
  // שחקן חדש הצטרף
});
```

---

## ארכיטקטורה

```
server/
  server.js              ← נקודת כניסה
  routes/
    gameRoutes.js        ← POST /game/join, POST /game/voting
  controllers/
    GameController.js    ← לוגיקה, שידור ל-io.to(gameId)
  sockets/
    main.js              ← אתחול Socket.IO
    roomSocket.js        ← join/leave חדרים
    gameSocket.js        ← הצבעות ישירות דרך socket
clientDemo/
  index.html             ← דמו לבדיקה
```

---

## ביצועים - עומס גבוה

- `io` מוגדר פעם אחת ומשותף לכל ה-requests (ולא `socket` שמשתנה!)
- `io.to(gameId).emit()` שולח רק לחדר הרלוונטי
- כל חדר מבודד - חדרים שונים לא מפריעים אחד לשני
- לעומס של אלפי הצבעות בשנייה - שקול להוסיף Redis adapter:
  ```bash
  npm install @socket.io/redis-adapter redis
  ```

---

## דמו

פתח http://localhost:3000 לאחר הרצת השרת.
