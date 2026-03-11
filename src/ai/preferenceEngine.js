export const getPreferredUnitType = (preference) => {
  const weights = [
    { type: "read", value: preference.readWeight },
    { type: "quiz", value: preference.quizWeight },
    { type: "video", value: preference.videoWeight },
    { type: "task", value: preference.taskWeight }
  ];

  weights.sort((a, b) => b.value - a.value);

  return weights[0].type;
};