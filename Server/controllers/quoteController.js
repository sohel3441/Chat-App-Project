export const getRandomQuote = (req, res) => {
    const quotes = [
      "Stay strong, your journey has just begun.",
      "You're doing amazing — keep going!",
      "Push through the challenge. Greatness awaits.",
      "Focus. Breathe. Believe.",
      "Success is built one step at a time.",
      "Discipline > motivation.",
      "Confidence comes from consistency.",
    ];
  
    const random = quotes[Math.floor(Math.random() * quotes.length)];
  
    res.json({ content: random });
  };
  