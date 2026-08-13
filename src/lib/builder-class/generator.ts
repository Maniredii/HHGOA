export function generateBuilderClass(stack: string): string {
  const s = stack.toLowerCase();
  
  if (s.includes("ai") || s.includes("ml") || s.includes("machine learning")) {
    return "MODEL WHISPERER";
  }
  if (s.includes("full") || s.includes("fullstack")) {
    return "SYSTEMS ALCHEMIST";
  }
  if (s.includes("web3") || s.includes("crypto") || s.includes("blockchain")) {
    return "PROTOCOL ARCHITECT";
  }
  if (s.includes("front") || s.includes("ui") || s.includes("ux")) {
    return "INTERFACE ARCHITECT";
  }
  if (s.includes("back") || s.includes("api")) {
    return "INFRASTRUCTURE BUILDER";
  }
  if (s.includes("security") || s.includes("cyber")) {
    return "DIGITAL GUARDIAN";
  }
  if (s.includes("data")) {
    return "SIGNAL HUNTER";
  }
  if (s.includes("devops") || s.includes("cloud") || s.includes("aws")) {
    return "DEPLOYMENT FORGEMASTER";
  }
  if (s.includes("hardware") || s.includes("embedded") || s.includes("iot")) {
    return "REALITY HACKER";
  }
  if (s.includes("product") || s.includes("pm")) {
    return "PRODUCT CATALYST";
  }
  if (s.includes("design")) {
    return "AESTHETIC ENGINEER";
  }
  if (s.includes("mobile") || s.includes("ios") || s.includes("android")) {
    return "POCKET DIMENSION CRAFTER";
  }
  
  // Default fallback if not empty
  if (s.trim().length > 0) {
    return "PRIME BUILDER";
  }
  
  return "";
}
