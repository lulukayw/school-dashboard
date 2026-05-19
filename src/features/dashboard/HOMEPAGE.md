# Dashboard / Homepage — Developer Docs
**Branch:** `homepage`
**Route:** `/` (index)
**Main file:** `src/pages/Home.jsx`
## File Map
| File | Purpose |
|---|---|
| `src/pages/Home.jsx` | Main dashboard page |
| `src/features/dashboard/components/StatCard.jsx` | Summary card component |
| `src/features/dashboard/components/ClassRow.jsx` | Class list row component |
| `src/constants/mockData.js` | Placeholder data (replace with Firestore) |
| `src/styles/dashboard.css` | Dashboard styles (won't affect other pages) |
## Connecting Firebase
All mock data is in `src/constants/mockData.js`.
Search for `// TODO (Firebase)` in `Home.jsx` for every spot that needs a real Firestore call.
## Firestore Data Shapes
```js
students:  { id, name, birthday }
teachers:  { id, name }
classes:   { id, name, subject, room, teacherId, students: { [studentId]: grade } }
events:    { id, title, date }