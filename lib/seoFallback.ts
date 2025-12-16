export function pageSeoFallback(path: string) {
  switch (path) {
    case "/":
      return {
        title: "Acossa Enterprise – Premium Sarees Online",
        description: "Buy premium sarees online at best price with fast delivery.",
      };
    case "/shop":
      return {
        title: "Shop Sarees Online | Acossa Enterprise",
        description: "Explore premium saree collections for all occasions.",
      };
    case "/about":
      return {
        title: "About Acossa Enterprise",
        description: "Learn more about Acossa Enterprise and our saree craftsmanship.",
      };
    default:
      return {
        title: "Acossa Enterprise",
        description: "Premium sarees online.",
      };
  }
}
