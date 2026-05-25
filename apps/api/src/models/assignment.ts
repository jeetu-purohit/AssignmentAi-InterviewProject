import mongoose, { Schema, Document } from 'mongoose';

// We store the status of the background job alongside the form data
const AssignmentModelSchema = new Schema({
  dueDate: { type: String, required: true },
  questionTypes: { type: [String], required: true },
  numQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  additionalInstructions: { type: String },
  
  // Tracking the AI Generation state
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING' 
  },
  
  // The final generated paper is saved here once BullMQ finishes
  generatedPaper: {
    type: Schema.Types.Mixed, // Stores the JSON output
    default: null
  }
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', AssignmentModelSchema);