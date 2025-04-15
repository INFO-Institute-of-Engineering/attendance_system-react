import mongoose from 'mongoose';

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/attendance_system?retryWrites=true&w=majority';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a cached connection variable
let cachedConnection = null;

/**
 * Connect to MongoDB Atlas
 */
async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('Connected to MongoDB Atlas');
    
    // Cache the connection
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Define schemas and models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['student', 'advisor', 'hod'], required: true },
  department: { type: String, required: true },
  phone: String,
  rollNumber: String,
  semester: Number,
  className: String,
  assignedClass: String,
  attendancePercentage: { type: Number, default: 0 },
  presentDays: { type: Number, default: 0 },
  absentDays: { type: Number, default: 0 }
}, { timestamps: true });

const LeaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromDate: { type: Date, required: true },
  toDate: { type: Date },
  reason: { type: String, required: true },
  leaveType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: String
}, { timestamps: true });

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
  className: { type: String, required: true },
  subject: String
}, { timestamps: true });

// Create models if they don't exist
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Leave = mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

export { connectToDatabase, User, Leave, Attendance };