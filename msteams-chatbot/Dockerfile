FROM node:20

# Set the working directory
WORKDIR /msteams-chatbot

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]