#!/bin/bash

# build-caprover.sh
# מייצר קובץ TAR מוכן להעלאה ל-Caprover

OUTPUT="voting-bridge-deploy.tar"

echo "🏗️  בונה TAR לפריסה ב-Caprover..."

# מחיקת קובץ ישן אם קיים
rm -f $OUTPUT

# יצירת TAR - ללא node_modules, ללא קבצי dev
tar --exclude='./node_modules' \
    --exclude='./.git' \
    --exclude='./.env' \
    --exclude='./*.tar' \
    --exclude='./*.zip' \
    --exclude='./build-caprover.sh' \
    -czf $OUTPUT .

echo "✅  נוצר: $OUTPUT"
echo "📦  גודל: $(du -sh $OUTPUT | cut -f1)"
echo ""
echo "📋  להעלאה ב-Caprover:"
echo "    Apps → [שם האפליקציה] → Deployment → Deploy from tarball"
echo "    או דרך CLI:"
echo "    caprover deploy -t $OUTPUT"
