export const getRandomQuote = () => {
    const quotes = [
      "Stay strong, your journey has just begun.",
      "You're doing amazing — keep going!",
      "Push through the challenge. Greatness awaits.",
      "Focus. Breathe. Believe.",
      "Discipline > motivation.",
      "Confidence comes from consistency.",
    ];
  
    return quotes[Math.floor(Math.random() * quotes.length)];
  };