export const tags = [
  "MLF", "RERT", "BESS", "REZ", "commissioning", "security services",
  "revenue determination", "rule change", "connection standards", "system security",
  "market operations", "network planning", "transmission", "distribution",
  "generation", "storage", "hydrogen", "DER", "frequency control", "settlements",
  "pricing", "consumer", "retail", "gas", "cyber security", "governance",
  "consultation", "compliance", "offshore wind", "renewable energy",
].map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
}));
