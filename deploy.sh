#!/bin/bash

PROJECT_ID="your_project_id"
IMAGE_NAME="nextjs-app"
REGION="europe-west1"

echo "Building and pushing Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME

echo "Deploying to Cloud Run..."
gcloud run deploy $IMAGE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --min-instances 0 \
  --max-instances 1 \
  --allow-unauthenticated

echo "Deployment complete."
