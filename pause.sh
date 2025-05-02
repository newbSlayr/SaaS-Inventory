#!/bin/bash

SERVICE_NAME="nextjs-app"
REGION="europe-west1"

echo "🔍 Checking instance scaling settings for '$SERVICE_NAME'..."

gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --format="table(spec.template.metadata.annotations.autoscaling\.knative\.dev/minScale, spec.template.metadata.annotations.autoscaling\.knative\.dev/maxScale, status.url)"

echo ""
echo "✅ If minScale is 0 and maxScale is 1, your service is effectively paused when idle."
