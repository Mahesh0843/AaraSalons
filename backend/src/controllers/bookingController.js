const Booking = require('../models/Booking');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS 
  }
});

const adminEmail = process.env.ADMIN_EMAIL;

// -------------------------------
// Create a Booking + Send Admin Email
// ---------------------------------------
exports.createBooking = async (req, res) => {
  try {
    const { name, mobile, service, stylist, date, time } = req.body;

    if (!name || !mobile || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, mobile, service, date, time)',
      });
    }

    const booking = new Booking({
      name,
      mobile,
      service,
      stylist: stylist || 'No Preference',
      date: new Date(date),
      time,
      status: 'confirmed'
    });

    // Save booking to DB
    const savedBooking = await booking.save();
    console.log("📦 Booking saved to DB:", savedBooking);

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: '🪞 New Booking Received - AARA Salon',
        html: `
          <h2>New Booking Details</h2>
          <p><strong>Name:</strong> ${savedBooking.name}</p>
          <p><strong>Mobile:</strong> ${savedBooking.mobile}</p>
          <p><strong>Service:</strong> ${savedBooking.service}</p>
          <p><strong>Stylist:</strong> ${savedBooking.stylist}</p>
          <p><strong>Date:</strong> ${new Date(savedBooking.date).toLocaleDateString('en-IN')}</p>
          <p><strong>Time:</strong> ${savedBooking.time}</p>
          <p><strong>Status:</strong> ${savedBooking.status}</p>
        `
      });

      console.log("📧 Email sent to admin:", adminEmail);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: savedBooking,
    });

  } catch (error) {
    console.error('❌ Error in createBooking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking. Please try again.',
    });
  }
};


// ---------------------------------------
// Get All Bookings
// ---------------------------------------
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('❌ Error in getAllBookings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

// ---------------------------------------
// Get Booking By ID
// ---------------------------------------
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('❌ Error in getBookingById:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
    });
  }
};

