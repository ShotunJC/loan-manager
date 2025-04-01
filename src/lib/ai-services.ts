"use server"

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function assessLoanRisk(loan: any) {
    const prompt = `
      Analyze this loan application and provide a risk assessment:
      Borrower: ${loan.borrower}
      Amount: $${loan.amount}
      Interest Rate: ${loan.interestRate}%
      Term: ${loan.term} months
      Status: ${loan.status}
      Description: ${loan.description || "No description provided"}
  
      Please provide:
      1. Risk score (1-10)
      2. Key risk factors
      3. Recommendation (approve/decline with reasoning)
      4. Suggested conditions if approved
      
      Format your response in markdown with clear sections.
    `;
  
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
  
    return response.choices[0]?.message?.content || "No response from AI";
  }