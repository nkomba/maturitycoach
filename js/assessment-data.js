/**
 * assessment-data.js
 * Leadership Maturity Self-Assessment — Question definitions, dimensions, and scoring config.
 * Data is consumed by assessment-ui.js for dynamic rendering and score calculation.
 */

const ASSESSMENT_DATA = {

    // -------------------------------------------------------
    // META
    // -------------------------------------------------------
    meta: {
        totalQuestions: 15,
        estimatedMinutes: 10,
        scaleLabels: [
            "Emerging",
            "Developing",
            "Practicing",
            "Mastery"
        ],
        scoreBands: [
            { min: 15, max: 24,  band: "Emerging Leader",
              summary: "You're at the beginning of a deliberate leadership journey. You have raw potential and genuine willingness to grow. Structured coaching can accelerate your development significantly.",
              recommendation: "Start with our Foundation Coaching Program — designed to build core leadership muscles." },
            { min: 25, max: 34,  band: "Developing Leader",
              summary: "You've built a foundation and are growing in self-awareness and capability. You handle many situations well but may struggle under pressure or in unfamiliar territory.",
              recommendation: "Consider our Growth Coaching Program — focused on deepening emotional intelligence and strategic thinking." },
            { min: 35, max: 44,  band: "Practicing Leader",
              summary: "You demonstrate consistent leadership maturity across most dimensions. You're skilled at facilitating, adapting, and developing others. The next edge is systems-level impact.",
              recommendation: "Explore our Advanced Leadership Coaching — aimed at scaling your influence and building organizational capability." },
            { min: 45, max: 60,  band: "Mastery-Level Leader",
              summary: "You operate from a place of deep integration — wisdom, presence, and systemic awareness guide your leadership. You're ready to mentor others and shape culture.",
              recommendation: "Engage with our Executive Mastery Coaching — for seasoned leaders refining their legacy and impact." }
        ]
    },

    // -------------------------------------------------------
    // QUESTIONS
    // Each question maps to a leadership maturity dimension.
    // Options are scored 1–4, where higher = more mature response.
    // i18n keys are provided for EN/FR locale files.
    // -------------------------------------------------------
    questions: [

        // --- Q1: Conflict Resolution ---
        {
            id: 1,
            dimension: "Conflict Resolution",
            i18nKey: "assessment.q1",
            text: "How do you typically approach conflict within your team?",
            options: [
                { value: 1, i18nKey: "assessment.q1.opt1",
                  text: "I avoid it and hope it resolves itself." },
                { value: 2, i18nKey: "assessment.q1.opt2",
                  text: "I address it directly but sometimes react emotionally." },
                { value: 3, i18nKey: "assessment.q1.opt3",
                  text: "I facilitate structured dialogue to find resolution." },
                { value: 4, i18nKey: "assessment.q1.opt4",
                  text: "I use conflict as a catalyst for deeper team learning." }
            ]
        },

        // --- Q2: Decision-Making ---
        {
            id: 2,
            dimension: "Decision-Making",
            i18nKey: "assessment.q2",
            text: "How would you describe your decision-making process?",
            options: [
                { value: 1, i18nKey: "assessment.q2.opt1",
                  text: "I rely primarily on intuition or past experience." },
                { value: 2, i18nKey: "assessment.q2.opt2",
                  text: "I consult a few trusted colleagues before deciding." },
                { value: 3, i18nKey: "assessment.q2.opt3",
                  text: "I use structured frameworks and seek diverse input." },
                { value: 4, i18nKey: "assessment.q2.opt4",
                  text: "I balance data, intuition, stakeholder needs, and long-term impact." }
            ]
        },

        // --- Q3: Receptivity to Feedback ---
        {
            id: 3,
            dimension: "Receptivity to Feedback",
            i18nKey: "assessment.q3",
            text: "How do you handle feedback from your team?",
            options: [
                { value: 1, i18nKey: "assessment.q3.opt1",
                  text: "I feel defensive or take it personally." },
                { value: 2, i18nKey: "assessment.q3.opt2",
                  text: "I listen but often dismiss what doesn't align with my self-image." },
                { value: 3, i18nKey: "assessment.q3.opt3",
                  text: "I actively seek feedback and reflect on it before acting." },
                { value: 4, i18nKey: "assessment.q3.opt4",
                  text: "I create regular feedback channels and visibly act on what I learn." }
            ]
        },

        // --- Q4: Emotional Intelligence ---
        {
            id: 4,
            dimension: "Emotional Intelligence",
            i18nKey: "assessment.q4",
            text: "When you experience strong emotions at work, what happens?",
            options: [
                { value: 1, i18nKey: "assessment.q4.opt1",
                  text: "They spill over and affect my behavior before I notice." },
                { value: 2, i18nKey: "assessment.q4.opt2",
                  text: "I notice them but struggle to regulate in the moment." },
                { value: 3, i18nKey: "assessment.q4.opt3",
                  text: "I recognize, name, and manage my emotions effectively." },
                { value: 4, i18nKey: "assessment.q4.opt4",
                  text: "I use my emotional awareness to coach others through theirs." }
            ]
        },

        // --- Q5: Delegation ---
        {
            id: 5,
            dimension: "Delegation & Trust",
            i18nKey: "assessment.q5",
            text: "How do you approach delegating important work?",
            options: [
                { value: 1, i18nKey: "assessment.q5.opt1",
                  text: "I keep critical tasks because others might not do them right." },
                { value: 2, i18nKey: "assessment.q5.opt2",
                  text: "I delegate tasks but micromanage the execution." },
                { value: 3, i18nKey: "assessment.q5.opt3",
                  text: "I delegate outcomes with clear expectations and check-ins." },
                { value: 4, i18nKey: "assessment.q5.opt4",
                  text: "I delegate authority, not just tasks, and grow others' capabilities." }
            ]
        },

        // --- Q6: Strategic Thinking ---
        {
            id: 6,
            dimension: "Strategic Thinking",
            i18nKey: "assessment.q6",
            text: "How far ahead do you typically plan and think?",
            options: [
                { value: 1, i18nKey: "assessment.q6.opt1",
                  text: "I focus mostly on the current week or sprint." },
                { value: 2, i18nKey: "assessment.q6.opt2",
                  text: "I plan quarterly but rarely revisit the bigger picture." },
                { value: 3, i18nKey: "assessment.q6.opt3",
                  text: "I hold a 1–2 year horizon aligned with organizational goals." },
                { value: 4, i18nKey: "assessment.q6.opt4",
                  text: "I connect daily decisions to a multi-year vision and industry trends." }
            ]
        },

        // --- Q7: Adaptability ---
        {
            id: 7,
            dimension: "Adaptability",
            i18nKey: "assessment.q7",
            text: "When faced with unexpected change or disruption, how do you respond?",
            options: [
                { value: 1, i18nKey: "assessment.q7.opt1",
                  text: "I resist or freeze, waiting for clarity before acting." },
                { value: 2, i18nKey: "assessment.q7.opt2",
                  text: "I adapt eventually but feel stressed and reactive." },
                { value: 3, i18nKey: "assessment.q7.opt3",
                  text: "I adjust plans quickly and help others navigate change." },
                { value: 4, i18nKey: "assessment.q7.opt4",
                  text: "I anticipate disruption and create conditions for the team to thrive in ambiguity." }
            ]
        },

        // --- Q8: Team Development ---
        {
            id: 8,
            dimension: "Team Development",
            i18nKey: "assessment.q8",
            text: "What is your approach to developing your team members?",
            options: [
                { value: 1, i18nKey: "assessment.q8.opt1",
                  text: "Development happens informally — I expect people to learn on the job." },
                { value: 2, i18nKey: "assessment.q8.opt2",
                  text: "I point people to training resources when issues arise." },
                { value: 3, i18nKey: "assessment.q8.opt3",
                  text: "I have regular development conversations and create growth plans." },
                { value: 4, i18nKey: "assessment.q8.opt4",
                  text: "I build a culture of continuous learning where everyone coaches and mentors." }
            ]
        },

        // --- Q9: Ethical Leadership ---
        {
            id: 9,
            dimension: "Ethical Leadership",
            i18nKey: "assessment.q9",
            text: "How do you handle ethical dilemmas in your leadership role?",
            options: [
                { value: 1, i18nKey: "assessment.q9.opt1",
                  text: "I follow the rules but haven't deeply examined my ethical framework." },
                { value: 2, i18nKey: "assessment.q9.opt2",
                  text: "I try to do the right thing but sometimes compromise under pressure." },
                { value: 3, i18nKey: "assessment.q9.opt3",
                  text: "I have clear principles and voice concerns even when it's costly." },
                { value: 4, i18nKey: "assessment.q9.opt4",
                  text: "I actively shape ethical culture, creating space for moral courage at all levels." }
            ]
        },

        // --- Q10: Resilience ---
        {
            id: 10,
            dimension: "Resilience",
            i18nKey: "assessment.q10",
            text: "After a significant setback or failure, what is your pattern?",
            options: [
                { value: 1, i18nKey: "assessment.q10.opt1",
                  text: "I spiral into self-doubt and struggle to recover momentum." },
                { value: 2, i18nKey: "assessment.q10.opt2",
                  text: "I bounce back eventually but avoid reflecting on what happened." },
                { value: 3, i18nKey: "assessment.q10.opt3",
                  text: "I reflect, extract lessons, and apply them going forward." },
                { value: 4, i18nKey: "assessment.q10.opt4",
                  text: "I model vulnerability about failure and create psychological safety for others to fail and learn." }
            ]
        },

        // --- Q11: Communication ---
        {
            id: 11,
            dimension: "Communication",
            i18nKey: "assessment.q11",
            text: "How would you describe your communication style as a leader?",
            options: [
                { value: 1, i18nKey: "assessment.q11.opt1",
                  text: "I communicate on a need-to-know basis, mostly giving directives." },
                { value: 2, i18nKey: "assessment.q11.opt2",
                  text: "I share information regularly but mostly one-way." },
                { value: 3, i18nKey: "assessment.q11.opt3",
                  text: "I communicate with purpose, tailoring messages to my audience." },
                { value: 4, i18nKey: "assessment.q11.opt4",
                  text: "I cultivate open dialogue, actively listen, and ensure all voices are heard." }
            ]
        },

        // --- Q12: Vision-Building ---
        {
            id: 12,
            dimension: "Vision-Building",
            i18nKey: "assessment.q12",
            text: "How do you approach creating and sharing a vision for your team or organization?",
            options: [
                { value: 1, i18nKey: "assessment.q12.opt1",
                  text: "I haven't articulated a vision — we focus on day-to-day execution." },
                { value: 2, i18nKey: "assessment.q12.opt2",
                  text: "I have a vision in my head but haven't communicated it widely." },
                { value: 3, i18nKey: "assessment.q12.opt3",
                  text: "I've shared a clear vision and connect work to it regularly." },
                { value: 4, i18nKey: "assessment.q12.opt4",
                  text: "I co-create vision with stakeholders and it evolves through collective ownership." }
            ]
        },

        // --- Q13: Self-Awareness ---
        {
            id: 13,
            dimension: "Self-Awareness",
            i18nKey: "assessment.q13",
            text: "How well do you understand your own leadership patterns and blind spots?",
            options: [
                { value: 1, i18nKey: "assessment.q13.opt1",
                  text: "I haven't spent much time reflecting on this." },
                { value: 2, i18nKey: "assessment.q13.opt2",
                  text: "I know my strengths but am less clear on my blind spots." },
                { value: 3, i18nKey: "assessment.q13.opt3",
                  text: "I actively seek to understand my patterns through reflection and feedback." },
                { value: 4, i18nKey: "assessment.q13.opt4",
                  text: "I have deep, ongoing self-inquiry practices and visibly work on my edges." }
            ]
        },

        // --- Q14: Cultural Competence ---
        {
            id: 14,
            dimension: "Cultural Competence",
            i18nKey: "assessment.q14",
            text: "How do you lead across cultural, generational, and cognitive differences?",
            options: [
                { value: 1, i18nKey: "assessment.q14.opt1",
                  text: "I treat everyone the same and expect them to adapt to the norm." },
                { value: 2, i18nKey: "assessment.q14.opt2",
                  text: "I'm aware of differences but unsure how to leverage them." },
                { value: 3, i18nKey: "assessment.q14.opt3",
                  text: "I adapt my approach and actively include diverse perspectives." },
                { value: 4, i18nKey: "assessment.q14.opt4",
                  text: "I design inclusive systems and make diversity a strategic advantage." }
            ]
        },

        // --- Q15: Systems Thinking ---
        {
            id: 15,
            dimension: "Systems Thinking",
            i18nKey: "assessment.q15",
            text: "When solving problems, how do you consider broader systems and interconnections?",
            options: [
                { value: 1, i18nKey: "assessment.q15.opt1",
                  text: "I solve the immediate problem in front of me." },
                { value: 2, i18nKey: "assessment.q15.opt2",
                  text: "I look at adjacent areas but may miss downstream effects." },
                { value: 3, i18nKey: "assessment.q15.opt3",
                  text: "I map stakeholders, dependencies, and unintended consequences." },
                { value: 4, i18nKey: "assessment.q15.opt4",
                  text: "I redesign systems themselves, addressing root causes and feedback loops." }
            ]
        }

    ] // end questions

};

// Export for use by other scripts
if (typeof window !== 'undefined') {
    window.ASSESSMENT_DATA = ASSESSMENT_DATA;
}