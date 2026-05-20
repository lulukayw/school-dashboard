import { fetchAssignments } from "./AssignmentServices";
import { studentsFromClass } from "./ClassServices";

const calculateStudentGrade = async (classId, studentId, assignments) => {
    let quizScores = 0;
    let quizTotal = 0;

    let parScores = 0;
    let parTotal = 0;

    let testScores = 0;
    let testTotal = 0;

    let projScores = 0;
    let projTotal = 0;

    for (const assignment of assignments) {
        const category = assignment.category;
        const score = assignment.scores?.[studentId] ?? 0;

        switch (category) {
            case "quiz":
                quizScores += score;
                quizTotal += assignment.max_score;
                break;

            case "participation":
                parScores += score;
                parTotal += assignment.max_score;
                break;

            case "test":
                testScores += score;
                testTotal += assignment.max_score;
                break;

            case "project":
                projScores += score;
                projTotal += assignment.max_score;
                break;
        }
    }

    const quizAvg = quizTotal ? quizScores / quizTotal : 0;
    const testAvg = testTotal ? testScores / testTotal : 0;
    const projAvg = projTotal ? projScores / projTotal : 0;
    const parAvg = parTotal ? parScores / parTotal : 0;

    return Math.round(
        (0.2 * quizAvg +
         0.3 * testAvg +
         0.25 * parAvg +
         0.25 * projAvg) * 100
    );
};

const calculateAvgGrade = async (classId) => {
    const students = await studentsFromClass(classId);
    if (students.length === 0) return 0;

    const assignments = await fetchAssignments(classId);

    const grades = await Promise.all(
        students.map(s =>
            calculateStudentGrade(classId, s.id, assignments)
        )
    );

    const total = grades.reduce((sum, g) => sum + g, 0);

    return Math.round(total / students.length);
};

export { calculateAvgGrade, calculateStudentGrade }