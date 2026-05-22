// controllers/sisterEvent.js
const SisterEvent = require('../models/sisterEvent');
const User = require('../models/users');

// Create Event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, cohort, meetingLink } = req.body;

    const event = await SisterEvent.create({
      title,
      description,
      date,
      cohort,
      meetingLink,
      hostedBy: req.senderId
    });

    res.status(201).json({ 
      message: 'Event created successfully', 
      data: event 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await SisterEvent.find({ isActive: true })
      .populate('hostedBy', 'name avatar cohort')
      .sort({ date: 1 }); // upcoming first

    res.status(200).json({ data: events });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// RSVP to Event
const rsvpEvent = async (req, res) => {
  try {
    const event = await SisterEvent.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already RSVPd
    if (event.rsvps.includes(req.senderId)) {
      return res.status(400).json({ 
        message: 'You have already RSVPd to this event' 
      });
    }

    // Add to rsvps
    event.rsvps.push(req.senderId);
    event.rsvpCount += 1;
    await event.save();

    // Reward karma
    await User.findByIdAndUpdate(req.senderId, 
      { $inc: { karma: 5 } }
    );

    res.status(200).json({ 
      message: 'RSVP successful! +5 Karma', 
      data: event 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Cancel RSVP
const cancelRsvp = async (req, res) => {
  try {
    const event = await SisterEvent.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.rsvps = event.rsvps.filter(
      id => id.toString() !== req.senderId
    );
    event.rsvpCount -= 1;
    await event.save();

    // Deduct karma back
    await User.findByIdAndUpdate(req.senderId, 
      { $inc: { karma: -5 } }
    );

    res.status(200).json({ message: 'RSVP cancelled' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await SisterEvent.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.hostedBy.toString() !== req.senderId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.isActive = false;
    await event.save();

    res.status(200).json({ message: 'Event cancelled' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  createEvent, 
  getAllEvents, 
  rsvpEvent, 
  cancelRsvp, 
  deleteEvent 
};