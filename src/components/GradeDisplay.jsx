import "./styles/gradeDisplay.css";

export default function GradeDisplay({
  classGrade = null,
}) {
  const getGradeColor = (percentage) => {
    if (percentage === null || isNaN(percentage)) return "#9ca3af";
    if (percentage >= 90) return "#22c55e";
    if (percentage >= 80) return "#3b82f6";
    if (percentage >= 70) return "#f59e0b";
    if (percentage >= 60) return "#ef4444";
    return "#dc2626";
  };

  const getLetterGrade = (percentage) => {
    if (percentage === null || isNaN(percentage)) return "—";
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const formatPercentage = (grade) => {
    if (grade === null || isNaN(grade)) return "—";
    return `${Math.round(grade)}%`;
  };

  return (
    <>
      {classGrade !== null && (
        <h2 className="grade-display">
          Class Average: <span style={{ color: getGradeColor(classGrade) }}>{formatPercentage(classGrade)} ({getLetterGrade(classGrade)})</span>
        </h2>
      )}
    </>
  );
}
