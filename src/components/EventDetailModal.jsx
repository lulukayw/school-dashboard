import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { updateEvent, parseDateTime, getLocalDateString } from "../util/EventsServices.js";

const dialogProps = {
  fullWidth: true,
  maxWidth: "sm",
  PaperProps: {
    sx: { borderRadius: 3, p: 1, boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)' }
  }
};

export default function EventDetailModal({ selected, onClose, onDelete, setEvents }) {
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selected) {
      setEditForm({
        name: selected.name,
        location: selected.location || "",
        startDate: getLocalDateString(selected.start),
        startTime: selected.start.toTimeString().slice(0, 5),
        endDate: getLocalDateString(selected.end),
        endTime: selected.end.toTimeString().slice(0, 5),
      });
      setEditMode(false);
      setErrors({});
    }
  }, [selected]);

  if (!selected || !editForm) return null;

  const handleUpdate = async () => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = "Name is required";
    if (!editForm.startDate) newErrors.startDate = "Start Date is required";
    if (!editForm.endDate) newErrors.endDate = "End Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const start = parseDateTime(editForm.startDate, editForm.startTime);
      const end = parseDateTime(editForm.endDate, editForm.endTime);

      await updateEvent(selected.id, {
        name: editForm.name,
        location: editForm.location,
        start,
        end,
      });

      setEvents((prev) =>
        prev.map((e) => e.id === selected.id ? { ...e, ...editForm, start, end, title: editForm.name } : e)
      );
      
      setEditMode(false);
      onClose();
    } catch (err) {
      console.error("Failed to update execution process link:", err);
    }
  };

  return (
    <Dialog open={!!selected} onClose={onClose} {...dialogProps}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary' }}><CloseIcon /></IconButton>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', pb: 1, pr: 6 }}>
        {editMode ? "Edit Event" : "Event Details"}
      </DialogTitle>

      <DialogContent>
        {!editMode ? (
          /* View Mode */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>EVENT NAME</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{selected.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>LOCATION</Typography>
              <Typography color={selected.location ? "text.primary" : "text.secondary"}>{selected.location || "No location specified"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, letterSpacing: '0.05em' }}>WHEN</Typography>
              <Typography>{selected.start.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} – {selected.end.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Typography>
            </Box>
          </Box>
        ) : (
          /* Inline Editing Display */
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Name</Typography>
              <TextField 
                fullWidth 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                error={!!errors.name}
                helperText={errors.name}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Location</Typography>
              <TextField fullWidth value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Start Date</Typography>
                <TextField 
                  type="date" 
                  fullWidth 
                  value={editForm.startDate} 
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} 
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>Start Time</Typography>
                <TextField type="time" fullWidth value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} />
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>End Date</Typography>
                <TextField 
                  type="date" 
                  fullWidth 
                  value={editForm.endDate} 
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} 
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500, color: 'text.secondary' }}>End Time</Typography>
                <TextField type="time" fullWidth value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: editMode ? 'flex-end' : 'space-between' }}>
        {!editMode ? (
          <>
            <Button color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(selected.id)} sx={{ textTransform: 'none' }}>Delete</Button>
            <Button onClick={() => setEditMode(true)} sx={{ textTransform: 'none' }}>Edit</Button>
          </>
        ) : (
          <>
            <Button onClick={() => { setEditMode(false); setErrors({}); }} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
            <Button variant="contained" disableElevation sx={{ borderRadius: 2, px: 3, textTransform: 'none' }} onClick={handleUpdate}>
              Save Changes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
