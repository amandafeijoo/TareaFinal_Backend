const Instructor = require('../models/Instructor');
const { authorizeAdmin } = require('../middleware/auth');


exports.createInstructor = [authorizeAdmin,async (req, res) => {
  try {
    const { nombre, especialidad } = req.body;
    const instructor = new Instructor({ nombre, especialidad });
    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}];

exports.getInstructor = [authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado' });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}];

exports.getInstructors = [authorizeAdmin, async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}];

exports.updateInstructor = [authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findByIdAndUpdate
        (id, req.body, { new: true });
    if (!instructor) {
        return res.status(404).json({ error: 'Instructor no encontrado' });
        }
    res.status(200).json(instructor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
];

exports.deleteInstructor = [authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findByIdAndDelete(id);
        if (!instructor) {
            return res.status(404).json({ error: 'Instructor no encontrado' });
        }
        res.status(200).json({ message: 'Instructor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
];

