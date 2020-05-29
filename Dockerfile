FROM node:14
RUN git clone https://github.com/CuriouslyCory/ProductWatcher.git /app/
RUN apt update
RUN apt install -y gconf-service \
                   libasound2 \
                   libatk1.0-0 \
                   libc6 \
                   libcairo2 \
                   libcups2 \
                   libdbus-1-3 \
                   libexpat1 \
                   libfontconfig1 \
                   libgcc1 \
                   libgconf-2-4 \
                   libgdk-pixbuf2.0-0 \
                   libglib2.0-0 \
                   libgtk-3-0 \
                   libnspr4 \
                   libpango-1.0-0 \
                   libpangocairo-1.0-0 \
                   libstdc++6 \
                   libx11-6 \
                   libx11-xcb1 \
                   libxcb1 \
                   libxcomposite1 \
                   libxcursor1 \
                   libxdamage1 \
                   libxext6 \
                   libxfixes3 \
                   libxi6 \
                   libxrandr2 \
                   libxrender1 \
                   libxss1 \
                   libxtst6 \
                   ca-certificates\
                   fonts-liberation\
                   libappindicator1\
                   libnss3\
                   lsb-release\
                   xdg-utils wget
RUN npm i --prefix /app/
ENV TWILIO_SID=$TWILIO_SID
ENV TWILIO_TOKEN=$TWILIO_TOKEN
ENV TWILIO_NUMBER=$TWILIO_NUMBER
ENV RECIPIENT_NUMBER=$RECEIPIENT_NUMBER
VOLUME /app/pages.js
ENTRYPOINT npm run start --prefix /app/
