import mongoose, { Schema } from "mongoose";

const webhookLogSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true },
    provider: { type: String, default: "stripe" },
    type: { type: String },
    payload: { type: Schema.Types.Mixed },
    signature: { type: String },
    verified: { type: Boolean, default: false },
    processedAt: { type: Date },
    processingResult: { type: String },
  },
  { timestamps: true }
);

webhookLogSchema.index({ eventId: 1, provider: 1 });

const WebhookLog = mongoose.model("WebhookLog", webhookLogSchema);
export default WebhookLog;
