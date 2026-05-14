FROM node:20-alpine

# תיקיית עבודה
WORKDIR /app

# העתקת package files תחילה (cache optimization)
COPY package*.json ./

# התקנת dependencies בלבד (ללא devDependencies)
RUN npm install --omit=dev

# העתקת שאר הקוד
COPY . .

# פורט החשיפה
EXPOSE 3000

# הרצה
CMD ["node", "-r", "dotenv/config", "server/server.js"]
