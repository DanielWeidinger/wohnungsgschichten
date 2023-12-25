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

## Data augmentation
COPY fetch_job.sh fetch_job.sh
COPY analytics analytics
RUN pip3 install -r /app/analytics/requirements.txt
# Setup CRON job
RUN apt-get install -y cron
# Add cron job
COPY cron_job /etc/cron.d/fetch_job
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/fetch_job
# Apply cron job
RUN crontab /etc/cron.d/fetch_job

# Expose port (if needed)
EXPOSE 4000
# Start the application
COPY start.sh start.sh
ENTRYPOINT [ "./start.sh" ]
