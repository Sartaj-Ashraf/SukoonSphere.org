export const questions = [
  {
    id: 1,
    question: "How can I manage anxiety in stressful situations?",
    details:
      "I'm looking for practical tips to stay calm during high-pressure situations.",
    tags: ["Anxiety", "Stress Management", "Mental Health"],
    askedBy: {
      name: "Alice Johnson",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-30",
    },
    answers: [
      {
        id: 1,
        answerText:
          "One effective technique is deep breathing exercises. Practice inhaling slowly through your nose, holding your breath for a few seconds, and then exhaling slowly through your mouth.",
        answeredBy: {
          name: "Dr. Emily Smith",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-31",
        },
        upvotes: 15,
        comments: [
          {
            id: 1,
            commentText: "This really helps me! Thanks for the tip.",
            commentedBy: "John Doe",
            dateCommented: "2024-09-01",
            replies: [
              {
                id: 1,
                replyText:
                  "Glad you found it helpful! Deep breathing is a great tool for calming nerves.",
                repliedBy: "Dr. Emily Smith",
                dateReplied: "2024-09-02",
              },
            ],
          },
          {
            id: 2,
            commentText:
              "I find that mindfulness meditation also helps reduce my anxiety.",
            commentedBy: "Lisa Brown",
            dateCommented: "2024-09-02",
            replies: [
              {
                id: 1,
                replyText:
                  "Yes, mindfulness is excellent for managing anxiety. Combining it with breathing exercises can be very effective.",
                repliedBy: "Dr. Emily Smith",
                dateReplied: "2024-09-03",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Consider practicing progressive muscle relaxation. Tense and then relax each muscle group in your body to release built-up tension.",
        answeredBy: {
          name: "Dr. Michael Green",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-09-01",
        },
        upvotes: 12,
        comments: [
          {
            id: 1,
            commentText: "This is a great addition to my routine. Thanks!",
            commentedBy: "Ella Johnson",
            dateCommented: "2024-09-03",
            replies: [
              {
                id: 1,
                replyText:
                  "You're welcome! I’m glad to hear that it's working for you.",
                repliedBy: "Dr. Michael Green",
                dateReplied: "2024-09-04",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    question: "What are the signs of burnout?",
    details:
      "I'm concerned that I might be experiencing burnout, but I'm not sure about the symptoms.",
    tags: ["Burnout", "Symptoms", "Mental Health"],
    askedBy: {
      name: "Michael Williams",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-28",
    },
    answers: [
      {
        id: 1,
        answerText:
          "Common signs of burnout include chronic fatigue, irritability, and a lack of motivation. It can also manifest as physical symptoms like headaches or digestive issues.",
        answeredBy: {
          name: "Dr. James Miller",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-29",
        },
        upvotes: 20,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve been experiencing these symptoms lately. Thanks for the insight.",
            commentedBy: "Anna Lee",
            dateCommented: "2024-08-30",
            replies: [
              {
                id: 1,
                replyText:
                  "If you’re feeling these symptoms, it might be a good idea to seek professional help.",
                repliedBy: "Dr. James Miller",
                dateReplied: "2024-08-31",
                replies: [
                  {
                    id: 1,
                    replyText: "yeah you are right",
                    repliedBy: "Anna Lee",
                    dateReplied: "2024-09-01",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            commentText:
              "It’s helpful to know what to look for. Time to evaluate my work-life balance.",
            commentedBy: "Tom Wilson",
            dateCommented: "2024-09-01",
            replies: [
              {
                id: 1,
                replyText:
                  "Evaluating work-life balance is a great start. Remember, taking small steps can make a big difference.",
                repliedBy: "Dr. James Miller",
                dateReplied: "2024-09-02",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Burnout can also lead to feelings of cynicism and detachment from your job. If you're feeling disengaged, it might be a sign.",
        answeredBy: {
          name: "Dr. Karen Mitchell",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-30",
        },
        upvotes: 18,
        comments: [
          {
            id: 1,
            commentText:
              "I didn’t realize detachment could be a symptom. I’ll pay more attention to how I’m feeling.",
            commentedBy: "Steve Carter",
            dateCommented: "2024-09-02",
            replies: [
              {
                id: 1,
                replyText:
                  "Paying attention to these feelings can help you address them early. Consider talking to a counselor.",
                repliedBy: "Dr. Karen Mitchell",
                dateReplied: "2024-09-03",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    question: "How do I cope with the loss of a loved one?",
    details:
      "I recently lost someone close to me and I'm struggling to cope with the grief.",
    tags: ["Grief", "Loss", "Mental Health"],
    askedBy: {
      name: "Sarah Thompson",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-25",
    },
    answers: [
      {
        id: 1,
        answerText:
          "It's important to allow yourself to grieve and not rush the process. Talking to someone you trust or a therapist can also be helpful.",
        answeredBy: {
          name: "Dr. Robert Brown",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-26",
        },
        upvotes: 30,
        comments: [
          {
            id: 1,
            commentText: "Thank you, this advice really resonated with me.",
            commentedBy: "Jessica Lee",
            dateCommented: "2024-08-27",
            replies: [
              {
                id: 1,
                replyText:
                  "I’m glad it helped. Grieving is a personal journey and taking it one step at a time is okay.",
                repliedBy: "Dr. Robert Brown",
                dateReplied: "2024-08-28",
              },
            ],
          },
          {
            id: 2,
            commentText:
              "Joining a support group has also been helpful for me.",
            commentedBy: "Emily Nguyen",
            dateCommented: "2024-08-28",
            replies: [
              {
                id: 1,
                replyText:
                  "Support groups can offer comfort and understanding from those who have experienced similar losses.",
                repliedBy: "Dr. Robert Brown",
                dateReplied: "2024-08-29",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Try to honor their memory by engaging in activities they enjoyed or creating a personal ritual that celebrates their life.",
        answeredBy: {
          name: "Dr. Susan Clark",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-27",
        },
        upvotes: 22,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve started a memory book, and it’s helping me feel closer to my loved one.",
            commentedBy: "Rachel Adams",
            dateCommented: "2024-08-29",
            replies: [
              {
                id: 1,
                replyText:
                  "That sounds like a beautiful way to keep their memory alive. Thank you for sharing.",
                repliedBy: "Dr. Susan Clark",
                dateReplied: "2024-08-30",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    question: "What are some tips for improving sleep quality?",
    details:
      "I've been having trouble sleeping lately. What can I do to improve my sleep?",
    tags: ["Sleep", "Insomnia", "Mental Health"],
    askedBy: {
      name: "David Wilson",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-22",
    },
    answers: [
      {
        id: 1,
        answerText:
          "Establishing a regular sleep schedule, reducing screen time before bed, and creating a calming bedtime routine can significantly improve sleep quality.",
        answeredBy: {
          name: "Dr. Laura White",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-23",
        },
        upvotes: 45,
        comments: [
          {
            id: 1,
            commentText:
              "These tips helped me a lot. I’m finally sleeping better!",
            commentedBy: "Mark Taylor",
            dateCommented: "2024-08-24",
            replies: [
              {
                id: 1,
                replyText:
                  "That’s great to hear! A consistent routine really does make a difference.",
                repliedBy: "Dr. Laura White",
                dateReplied: "2024-08-25",
              },
            ],
          },
          {
            id: 2,
            commentText:
              "I’ve also started using a white noise machine, and it’s been beneficial.",
            commentedBy: "Hannah Scott",
            dateCommented: "2024-08-25",
            replies: [
              {
                id: 1,
                replyText:
                  "White noise can be very helpful for masking disruptive sounds. Glad it’s working for you!",
                repliedBy: "Dr. Laura White",
                dateReplied: "2024-08-26",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Avoid caffeine and heavy meals close to bedtime, and ensure your sleep environment is dark and cool.",
        answeredBy: {
          name: "Dr. Julia Green",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-24",
        },
        upvotes: 32,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve cut down on caffeine and it’s made a huge difference in my sleep quality.",
            commentedBy: "Jake Lewis",
            dateCommented: "2024-08-26",
            replies: [
              {
                id: 1,
                replyText:
                  "Reducing caffeine can definitely help. It’s good to hear you’re seeing improvements!",
                repliedBy: "Dr. Julia Green",
                dateReplied: "2024-08-27",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    question: "How can I build self-esteem?",
    details:
      "I've always struggled with low self-esteem and I want to know how to improve it.",
    tags: ["Self-Esteem", "Personal Development", "Mental Health"],
    askedBy: {
      name: "Emma Davis",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-20",
    },
    answers: [
      {
        id: 1,
        answerText:
          "Start by setting small, achievable goals and celebrating your successes. Positive self-talk and surrounding yourself with supportive people can also help.",
        answeredBy: {
          name: "Dr. William Harris",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-21",
        },
        upvotes: 25,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve started implementing these suggestions and already feel better about myself.",
            commentedBy: "Olivia Martinez",
            dateCommented: "2024-08-22",
            replies: [
              {
                id: 1,
                replyText:
                  "That’s wonderful to hear! Keep celebrating your progress.",
                repliedBy: "Dr. William Harris",
                dateReplied: "2024-08-23",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Engage in activities you enjoy and that make you feel good about yourself. Accomplishing tasks you're passionate about can boost your self-esteem.",
        answeredBy: {
          name: "Dr. Linda Evans",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-22",
        },
        upvotes: 20,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve picked up a new hobby, and it’s really helping with my self-esteem.",
            commentedBy: "Mia White",
            dateCommented: "2024-08-24",
            replies: [
              {
                id: 1,
                replyText:
                  "That’s great to hear! Hobbies can be a wonderful way to boost self-esteem.",
                repliedBy: "Dr. Linda Evans",
                dateReplied: "2024-08-25",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    question: "What are the best ways to manage workplace stress?",
    details:
      "I'm finding it hard to cope with stress at work. Any advice would be appreciated.",
    tags: ["Workplace Stress", "Stress Management", "Mental Health"],
    askedBy: {
      name: "Chris Evans",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-18",
    },
    answers: [
      {
        id: 1,
        answerText:
          "It's important to take regular breaks, stay organized, and communicate with your manager about your workload. Mindfulness practices can also reduce stress.",
        answeredBy: {
          name: "Dr. Rachel Green",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-19",
        },
        upvotes: 35,
        comments: [
          {
            id: 1,
            commentText:
              "Great advice, I’ll definitely try to implement these at work.",
            commentedBy: "Daniel King",
            dateCommented: "2024-08-20",
            replies: [
              {
                id: 1,
                replyText:
                  "I hope they make a difference for you! Let me know how it goes.",
                repliedBy: "Dr. Rachel Green",
                dateReplied: "2024-08-21",
              },
            ],
          },
          {
            id: 2,
            commentText:
              "I've also started using a stress management app to help keep track of my stress levels.",
            commentedBy: "Nina Brooks",
            dateCommented: "2024-08-21",
            replies: [
              {
                id: 1,
                replyText:
                  "Stress management apps can be very useful. It’s great that you’re finding tools that work for you.",
                repliedBy: "Dr. Rachel Green",
                dateReplied: "2024-08-22",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Setting realistic goals and learning to say no when you're overwhelmed can prevent burnout and manage stress better.",
        answeredBy: {
          name: "Dr. Michael Lewis",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-20",
        },
        upvotes: 28,
        comments: [
          {
            id: 1,
            commentText:
              "I struggle with saying no. This advice is really helpful.",
            commentedBy: "Sara Lee",
            dateCommented: "2024-08-22",
            replies: [
              {
                id: 1,
                replyText:
                  "Setting boundaries can be tough but is essential for managing stress effectively. Keep practicing!",
                repliedBy: "Dr. Michael Lewis",
                dateReplied: "2024-08-23",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    question: "How do I maintain a work-life balance?",
    whatisuestionrelated:
      "I often feel like I'm spending too much time working and not enough time on personal activities.",
    tags: ["Work-Life Balance", "Time Management", "Mental Health"],
    askedBy: {
      name: "Sophia Roberts",
      avatar: "url-to-avatar-image",
      dateAsked: "2024-08-15",
    },
    answers: [
      {
        id: 1,
        answerText:
          "Set clear boundaries between work and personal time. Make sure to schedule activities that you enjoy outside of work and stick to your schedule.",
        answeredBy: {
          name: "Dr. Kevin Scott",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-16",
        },
        upvotes: 50,
        comments: [
          {
            id: 1,
            commentText:
              "I needed this advice. I’ll start setting boundaries right away.",
            commentedBy: "Laura Carter",
            dateCommented: "2024-08-17",
            replies: [
              {
                id: 1,
                replyText:
                  "Setting boundaries can be challenging but rewarding. Good luck!",
                repliedBy: "Dr. Kevin Scott",
                dateReplied: "2024-08-18",
              },
            ],
          },
          {
            id: 2,
            commentText:
              "Implementing a strict no-work policy after hours has really helped me disconnect.",
            commentedBy: "James Moore",
            dateCommented: "2024-08-18",
            replies: [
              {
                id: 1,
                replyText:
                  "That’s an excellent strategy for disconnecting. Glad to hear it's working for you!",
                repliedBy: "Dr. Kevin Scott",
                dateReplied: "2024-08-19",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        answerText:
          "Consider using time management tools to organize both your work and personal life. Efficient scheduling can help you find more time for personal activities.",
        answeredBy: {
          name: "Dr. Jennifer White",
          avatar: "url-to-avatar-image",
          dateAnswered: "2024-08-17",
        },
        upvotes: 40,
        comments: [
          {
            id: 1,
            commentText:
              "I’ve started using a time management app and it’s made a big difference.",
            commentedBy: "Michael Adams",
            dateCommented: "2024-08-19",
            replies: [
              {
                id: 1,
                replyText:
                  "Time management apps can be very effective for balancing tasks. Keep using it to stay on track!",
                repliedBy: "Dr. Jennifer White",
                dateReplied: "2024-08-20",
              },
            ],
          },
        ],
      },
    ],
  },
];
