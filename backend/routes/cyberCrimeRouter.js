import express from "express"
const router = express.Router();
import CyberCrimeCase from "../models/cyberCrimeModel.js";
import { isAuthenticated, authorizeRoles, isAuthorized } from "../middlewares/auth.js";
import {v4 as uuidv4} from "uuid";
import cloudinary from "cloudinary";
import multer from "multer";
import fs from "fs";

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
  isAuthorized,
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {fileSize: 10 * 1024 * 1024, // 10MB per file
    fieldSize: 15 * 1024 * 1024, // 15MB for the entire form
    files: 5 // Max 5 files}// 10MB
}});

router.post('/submit', isAuthorized, upload.array('attachments', 5), async (req, res) => {
  try {
    // Parse JSON strings from form data
    const address = JSON.parse(req.body.address || '{}');
    const suspectInfo = JSON.parse(req.body.suspectInfo || '{}');
    const monetaryLoss = JSON.parse(req.body.monetaryLoss || '{}');

    // Create new cybercrime case with basic info
    const newCaseData = {
      caseId: uuidv4().substring(0,8),
      complainant: {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country
        },
        idProofType: req.body.idProofType,
        idProofNumber: req.body.idProofNumber
      },
      crimeDetails: {
        crimeType: req.body.crimeType,
        subCategory: req.body.subCategory,
        crimeDateTime: req.body.crimeDateTime,
        location: req.body.location,
        platformOrWebsite: req.body.platformOrWebsite,
        suspectInfo: {
          name: suspectInfo.name,
          contactInfo: suspectInfo.contactInfo,
          ipAddress: suspectInfo.ipAddress,
          otherDetails: suspectInfo.otherDetails
        },
        description: req.body.description,
        monetaryLoss: {
          amount: parseFloat(monetaryLoss.amount) || 0,
          currency: monetaryLoss.currency || 'INR'
        },
        evidenceDescription: req.body.evidenceDescription
      },
      caseStatus: 'Submitted',
      priority: 'Medium',
      submittedBy: req.user._id // Assuming authentication middleware sets req.user
    };

    // Process multiple file attachments from Cloudinary if they exist
    console.log("Req files: ", req.files); // Changed from req.body.attachments
    
// Check if there are files uploaded
if (req.files && req.files.length > 0) { // Changed from req.body.attachments
  // Initialize an array to hold file attachment data
  const fileAttachmentsArray = [];
  
  // Process each file with Cloudinary
  for (const file of req.files) { // Changed from req.body.attachments
    const response = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto"
    });
    
    // Add file to the attachments array
    fileAttachmentsArray.push({
      fileName: file.originalname,
      fileType: file.mimetype,
      filePath: response.secure_url,
      publicId: response.public_id
    });
    
    // Clean up the temporary file
    fs.unlinkSync(file.path);
  }
  
  // Add file attachments to the case data
  newCaseData.fileAttachments = fileAttachmentsArray;
}

    // Create and save the new case
    const newCase = new CyberCrimeCase(newCaseData);
    await newCase.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Cybercrime case submitted successfully',
      caseId: newCase.caseId
    });

  } catch (error) {
    console.error('Error submitting cybercrime case:', error);
  
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your case',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
});

export default router;