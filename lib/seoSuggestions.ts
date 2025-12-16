export function keywordSuggestions(base: string) {
  if (!base) return [];

  const keywords = base.toLowerCase().split(" ");
  return [
    `${base} online`,
    `buy ${base}`,
    `${base} price`,
    `${base} india`,
    `${base} shop`,
  ];
}

export function seoAdvice(title?: string, desc?: string) {
  const advice = [];
  if (!title) advice.push("Add a meta title");
  if (title && title.length < 30) advice.push("Title is too short");
  if (title && title.length > 60) advice.push("Title is too long");
  if (!desc) advice.push("Add a meta description");
  if (desc && desc.length < 70) advice.push("Description is too short");
  return advice;
}
