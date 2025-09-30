
export interface ProductData {
  productName: string;
  productDescription: string;
  distinguishingFeature: string;
  businessModel: 'b2b-subscription' | 'b2b-one-time';
}

export function buildICPGenerationPrompt(productData: ProductData): string {
  const { productName, productDescription, distinguishingFeature, businessModel } = productData;
  
  const businessModelText = businessModel === 'b2b-subscription' 
    ? 'B2B subscription-based' 
    : 'B2B one-time purchase';

  return `You are an expert B2B market research analyst specializing in Ideal Customer Profile (ICP) development. 

Generate a comprehensive ICP analysis for the following product:

* Product Information:* - Product Name: ${productName}
- Description: ${productDescription}
- Distinguishing Feature: ${distinguishingFeature}
- Business Model: ${businessModelText}

* Required ICP Analysis Structure:* Please provide a detailed ICP analysis in the following JSON format:

{
  "id": "icp-[timestamp]",
  "userId": "[user-id]",
  "companyName": "[representative company name]",
  "industry": "[primary industry]",
  "generatedAt": "[ISO timestamp]",
  "confidence": 85,
  "lastUpdated": "[ISO timestamp]",
  "sections": {
    "firmographics": "Detailed company size, revenue, employee count, location, and organizational structure analysis",
    "pain_points": "Specific business challenges and pain points this product addresses",
    "value_proposition": "Clear value proposition and ROI for this customer segment",
    "buying_process": "Decision-making process, stakeholders involved, and typical sales cycle",
    "tech_stack": "Current technology stack and integration requirements",
    "decision_criteria": "Key factors that influence purchase decisions"
  }
}

* Analysis Guidelines:* 1. Focus on realistic, data-driven insights
2. Consider the business model implications (subscription vs one-time)
3. Identify specific pain points the product solves
4. Include relevant firmographic details
5. Consider the buying process complexity
6. Suggest realistic decision criteria

* Output Requirements:* - Return ONLY valid JSON
- Ensure all required fields are present
- Use realistic but specific examples
- Maintain professional tone
- Focus on actionable insights

Generate the ICP analysis now:`;
}

