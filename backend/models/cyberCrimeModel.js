import mongoose from "mongoose";
import validator from "validator";

// Define an enum for different cyber crime types
const crimeTypes = [
  "Phishing",
  "Identity Theft",
  "Online Harassment",
  "Hacking",
  "Ransomware Attack",
  "Credit Card Fraud",
  "Data Breach",
  "Online Scam",
  "Cyber Stalking",
  "Unauthorized Access",
  "Child Exploitation",
  "Intellectual Property Theft",
  "Cryptocurrency Fraud",
  "Social Media Impersonation",
  "Other"
];

// Schema for file attachments
const fileAttachmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  }
});

// Main cyber crime case schema
const cyberCrimeSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true,
    required: true
  },
  complainant: {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name should contain at least 3 characters"],
      maxLength: [50, "Name should not exceed 50 characters"]
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function(value) {
          return /^\d{10}$/.test(value);
        },
        message: "Not a valid mobile number. Must be 10 digits"
      }
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Enter a valid email"]
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"]
      },
      city: {
        type: String,
        required: [true, "City is required"]
      },
      state: {
        type: String,
        required: [true, "State is required"]
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"]
      },
      country: {
        type: String,
        required: [true, "Country is required"]
      }
    },
    idProofType: {
      type: String,
      enum: ["Passport", "Driver's License", "Aadhaar ID", "Other"],
      required: [true, "ID proof type is required"]
    },
    idProofNumber: {
      type: String,
      required: [true, "ID proof number is required"]
    }
  },
  crimeDetails: {
    crimeType: {
      type: String,
      enum: crimeTypes,
      required: [true, "Crime type is required"]
    },
    subCategory: {
      type: String
    },
    crimeDateTime: {
      type: Date,
      required: [true, "Crime date and time is required"]
    },
    location: {
      type: String,
      required: [true, "Location of crime is required"]
    },
    platformOrWebsite: {
      type: String
    },
    suspectInfo: {
      name: String,
      contactInfo: String,
      ipAddress: String,
      otherDetails: String
    },
    description: {
      type: String,
      required: [true, "Description of the crime is required"],
      minLength: [50, "Description should contain at least 50 characters"]
    },
    monetaryLoss: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: "INR"
      }
    },
    evidenceDescription: {
      type: String
    }
  },
  fileAttachments: [fileAttachmentSchema],
  caseStatus: {
    type: String,
    enum: ["Submitted", "Under Review", "Investigation", "Resolved", "Closed", "Rejected"],
    default: "Submitted"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium"
  },
  assignedTo: {
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    assignedAt: {
      type: Date
    }
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});


// Update lastUpdatedAt timestamp on each update
cyberCrimeSchema.pre('findOneAndUpdate', function() {
  this.set({ lastUpdatedAt: new Date() });
});

const CyberCrimeCase = mongoose.model("CyberCrimeCase", cyberCrimeSchema);

export default CyberCrimeCase;