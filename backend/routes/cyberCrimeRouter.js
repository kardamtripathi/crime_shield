import express from "express"
import { getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getSingleJob } from "../controllers/jobController.js";
const router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs";
import CyberCrimeCase from "../models/cyberCrimeModel.js";
import { isAuthenticated, authorizeRoles, isAuthorized } from "../middlewares/auth.js";
import {v4 as uuidv4} from "uuid";
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/cases/';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept images, documents, and PDFs
  const allowedFileTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 5 // Maximum 5 files
  }
});

// Submit a new cyber crime case
router.post(
  "/submit",
  isAuthorized,
  async (req, res) => {
    console.log("here1");
    try {
      const {
        name,
        mobile,
        email,
        address,
        idProofType,
        idProofNumber,
        crimeType,
        subCategory,
        crimeDateTime,
        location,
        platformOrWebsite,
        suspectInfo,
        description,
        monetaryLoss,
        evidenceDescription
      } = req.body;

      // Prepare file attachments data
      const fileAttachments = req?.files?.map(file => ({
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: file.path,
        fileSize: file.size
      }));

      // Parse the address object
      let addressObj;
      try {
        addressObj = JSON.parse(address);
      } catch (error) {
        // If address isn't a JSON string, assume it's already an object
        addressObj = address;
      }

      // Parse suspect info if provided as string
      let suspectInfoObj;
      try {
        suspectInfoObj = suspectInfo ? JSON.parse(suspectInfo) : {};
      } catch (error) {
        suspectInfoObj = suspectInfo || {};
      }

      // Parse monetary loss if provided
      let monetaryLossObj = { amount: 0, currency: "USD" };
      if (monetaryLoss) {
        try {
          monetaryLossObj = JSON.parse(monetaryLoss);
        } catch (error) {
          monetaryLossObj.amount = parseFloat(monetaryLoss) || 0;
        }
      }

      // Create new case
      const caseId = uuidv4();
      const newCase = await CyberCrimeCase.create({
        complainant: {
          name,
          mobile,
          email,
          address: addressObj,
          idProofType,
          idProofNumber
        },
        crimeDetails: {
          crimeType,
          subCategory: subCategory || "",
          crimeDateTime: new Date(crimeDateTime),
          location,
          platformOrWebsite: platformOrWebsite || "",
          suspectInfo: suspectInfoObj,
          description,
          monetaryLoss: monetaryLossObj,
          evidenceDescription: evidenceDescription || ""
        },
        fileAttachments,
        submittedBy: req.user._id,
        caseId: caseId,
      });
      console.log("here3");

      res.status(201).json({
        success: true,
        message: "Cyber crime case submitted successfully",
        caseId: newCase.caseId
      });
    } catch (error) {
      // If an error occurs, delete any uploaded files
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get all cyber crime cases (for officials)
router.get(
  "/all", 
  isAuthorized, 
  async (req, res) => {
    try {

      if(req.user.role !== 'Official'){
        return res.status(401).json({
          success: false,
          message: 'You are not authorized!'
        })
      }
      
      const cases = await CyberCrimeCase.find()
        .sort({ submittedAt: -1 })
      
      res.status(200).json({
        success: true,
        cases: cases
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get cases submitted by a specific user
router.get(
  "/my-cases",
  isAuthorized,
  async (req, res) => {
    try {
        console.log("herew1")
      
      const cases = await CyberCrimeCase.find({ submittedBy: req.user._id })
        .sort({ submittedAt: -1 })    
        console.log("herew2")

      res.status(200).json({
        success: true,
        cases: cases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get details of a specific case
router.get(
  "/:caseId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { caseId } = req.params;
      
      const cyberCase = await CyberCrimeCase.findOne({ caseId })
        .populate("submittedBy", "name email")
        .populate("assignedTo.officerId", "name email");
      
      if (!cyberCase) {
        return res.status(404).json({
          success: false,
          message: "Case not found"
        });
      }
      
      // Check if the user has permission to view this case
      if (
        req.user.role !== "Admin" && 
        req.user.role !== "Official" &&
        cyberCase.submittedBy._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view this case"
        });
      }
      
      res.status(200).json({
        success: true,
        case: cyberCase
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Update case status (for officials only)
router.patch(
  "/:caseId/status",
  isAuthenticated,
  authorizeRoles("Official", "Admin"),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { status, note } = req.body;
      
      const cyberCase = await CyberCrimeCase.findOne({ caseId });
      
      if (!cyberCase) {
        return res.status(404).json({
          success: false,
          message: "Case not found"
        });
      }
      
      cyberCase.caseStatus = status;
      
      // Add note if provided
      if (note) {
        cyberCase.notes.push({
          content: note,
          addedBy: req.user._id
        });
      }
      
      await cyberCase.save();
      
      res.status(200).json({
        success: true,
        message: "Case status updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

router.post("/update/:caseId", isAuthorized, async(req, res) => {
  try {
    console.log(req.user);
    if(req.user.role !== 'Official') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to edit'
      });
    }
    
    const { caseId } = req.params;
    const existingCase = await CyberCrimeCase.findOne({ caseId: caseId });
    
    if(!existingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // Update the case with data from request body
    const updatedCase = await CyberCrimeCase.findOneAndUpdate(
      { caseId: caseId },
      { $set: {...req.body,  lastUpdatedAt: new Date()} },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: updatedCase
    });
  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


export default router;