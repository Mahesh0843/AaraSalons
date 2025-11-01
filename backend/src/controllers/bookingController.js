const Booking = require('../models/Booking');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

// Initialize MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const adminEmail = process.env.ADMIN_EMAIL;

/**
 * Create booking and send details to admin via email
 */
exports.createBooking = async (req, res) => {
  try {
    const { name, mobile, service, stylist, date, time } = req.body;

    if (!name || !mobile || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, mobile, service, date, time)',
      });
    }

    // Save booking to database
    const booking = new Booking({
      name,
      mobile,
      service,
      stylist: stylist || 'No Preference',
      date: new Date(date),
      time,
      status: 'confirmed'
    });

    const savedBooking = await booking.save();

    // Send email to admin
    try {
      const from = new Sender(process.env.FROM_EMAIL, 'AARA Salon');
      const to = [new Recipient(adminEmail, 'Admin')];

      const emailParams = new EmailParams()
        .setFrom(from)
        .setTo(to)
        .setSubject('🪞 New Booking Received - AARA Salon')
        .setHtml(`
          <h2>New Booking Details</h2>
          <p><strong>Name:</strong> ${savedBooking.name}</p>
          <p><strong>Mobile:</strong> ${savedBooking.mobile}</p>
          <p><strong>Service:</strong> ${savedBooking.service}</p>
          <p><strong>Stylist:</strong> ${savedBooking.stylist}</p>
          <p><strong>Date:</strong> ${new Date(savedBooking.date).toLocaleDateString('en-IN')}</p>
          <p><strong>Time:</strong> ${savedBooking.time}</p>
          <p><strong>Status:</strong> ${savedBooking.status}</p>
          <hr/>
          <p>📩 Sent automatically by AARA Salon Booking System</p>
        `);

      await mailerSend.email.send(emailParams);
      console.log('✅ Booking email sent to admin:', adminEmail);
    } catch (emailError) {
      console.error('❌ Failed to send admin email:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: savedBooking,
    });

  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking. Please try again.',
    });
  }
};

/**
 * Get all bookings
 */
exports.getAllBookings = async (req, res) => {
  try {
    // const bookings = await Booking.find().sort({ createdAt: -1 });
    // res.status(200).json({ success: true, bookings });
    Hi
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

/**
 * Get booking by ID
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Error in getBookingById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
    });
  }
};
