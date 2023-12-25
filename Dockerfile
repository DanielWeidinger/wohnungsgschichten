# Base image
FROM ubuntu:latest
# Update packages and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    npm \
    ca-certificates \
    gnupg

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN NODE_MAJOR=21 && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get remove nodejs libnode-dev -y && apt-get autoremove -y && apt-get clean -y
RUN apt-get update 
RUN apt-get install nodejs -y

# Install Python packages
RUN pip3 install --upgrade pip
RUN pip3 install setuptools
# Set working directory
WORKDIR /app

## Data gathering
# Copy application files
COPY data data
# Install Node.js dependencies
RUN npm install --prefix=/app/data/
# Compile source
RUN npm run --prefix=/app/data/ tsc 


# ## Data augmentation
# COPY analysis analysis
# # Setup CRON job
# RUN apt-get install -y cron
# # Add cron job
# RUN echo "* * * * * curl http://localhost:3000/graphql" >> /etc/crontab
# # Start cron service
# CMD cron -f

# Expose port (if needed)
EXPOSE 4000
# Start the application
CMD [ "npm", "start", "--prefix=/app/data" ]
