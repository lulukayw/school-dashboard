import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from "@mui/material";
import { addEvent, parseDateTime } from "../util/EventsServices.js";

const EMPTY_FORM = { name: "", location: "", startDate: "", startTime: "09:00", endDate: "", endTime: "10:00" };

const dialogProps = {
  fullWidth: true,
  maxWidth: "sm",
  PaperProps: {
    sx: { borderRadius: 3, p: 1, boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)' }
  }
};

export default function AddEventModal({ open, onClose, prefillDate, setEvents }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, startDate: prefillDate });
      setErrors({});
    }
  }, [open, prefillDate]);

  const handleSave = async () => {
    const finalStartDate = form.startDate || prefillDate;
    const finalEndDate = form.endDate || finalStartDate;

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event Name is required";
    if (!finalStartDate) newErrors.startDate = "Start Date is required";
    if (!finalEndDate) newErrors.endDate = "End Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const start = parseDateTime(finalStartDate, form.startTime);
      const end = parseDateTime(finalEndDate, form.endTime);

      const id = await addEvent(form.name, form.location, start, end);

      setEvents((prev) => [
        ...prev,
        { id, name: form.name, title: form.name, location: form.location, start, end }
      ]);

      onClose();
    } catch (err) {
      console.error("Failed to write event:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} {...dialogProps}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', pb: 1 }}>New Event</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          
          <Box>
            <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Event Name</Typography>
            <TextField 
              fullWidth 
              placeholder="e.g., Football Game" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Location</Typography>
            <TextField fullWidth placeholder="e.g., Football Field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Start Date</Typography>
              <TextField 
                type="date" 
                fullWidth 
                value={form.startDate || prefillDate} 
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Start Time</Typography>
              <TextField type="time" fullWidth value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>End Date</Typography>
              <TextField 
                type="date" 
                fullWidth 
                value={form.endDate || form.startDate || prefillDate} 
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>End Time</Typography>
              <TextField type="time" fullWidth value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </Box>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="text" sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disableElevation sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}>
          {saving ? "Saving..." : "Save Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
