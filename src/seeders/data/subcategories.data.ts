/**
 * @description Subcategories data
 * SRS: subcategory isActive cascades from parent category
 * Gender مبيتخزنش — بيجي من اسم الـ subcategory (Men's/Women's/Kids)
 */
export const subcategoriesData = [
  // ─── T-Shirts ─────────────────────────────────────────────────────────────
  { title: "Men's T-Shirts",   category: "T-Shirts", isActive: true },
  { title: "Women's T-Shirts", category: "T-Shirts", isActive: true },
  { title: "Kids T-Shirts",    category: "T-Shirts", isActive: true },

  // ─── Jeans ────────────────────────────────────────────────────────────────
  { title: "Men's Jeans",      category: "Jeans",    isActive: true },
  { title: "Women's Jeans",    category: "Jeans",    isActive: true },
  { title: "Kids Jeans",       category: "Jeans",    isActive: true },

  // ─── Dresses ──────────────────────────────────────────────────────────────
  { title: "Women's Dresses",  category: "Dresses",  isActive: true },
  { title: "Girls Dresses",    category: "Dresses",  isActive: true },

  // ─── Jackets ──────────────────────────────────────────────────────────────
  { title: "Men's Jackets",    category: "Jackets",  isActive: true },
  { title: "Women's Jackets",  category: "Jackets",  isActive: true },
  { title: "Kids Jackets",     category: "Jackets",  isActive: true },

  // ─── Formal ───────────────────────────────────────────────────────────────
  { title: "Men's Formal",     category: "Formal",   isActive: true },
  { title: "Women's Formal",   category: "Formal",   isActive: true },

  // ─── Shorts ───────────────────────────────────────────────────────────────
  { title: "Men's Shorts",     category: "Shorts",   isActive: true },
  { title: "Women's Shorts",   category: "Shorts",   isActive: true },
  { title: "Kids Shorts",      category: "Shorts",   isActive: true },

  // ─── Sweaters ─────────────────────────────────────────────────────────────
  { title: "Men's Sweaters",   category: "Sweaters", isActive: true },
  { title: "Women's Sweaters", category: "Sweaters", isActive: true },
  { title: "Kids Sweaters",    category: "Sweaters", isActive: true },

  // ─── Coats ────────────────────────────────────────────────────────────────
  { title: "Men's Coats",      category: "Coats",    isActive: true },
  { title: "Women's Coats",    category: "Coats",    isActive: true },
  { title: "Kids Coats",       category: "Coats",    isActive: true },

  // ─── Activewear ───────────────────────────────────────────────────────────
  { title: "Men's Activewear",   category: "Activewear", isActive: true },
  { title: "Women's Activewear", category: "Activewear", isActive: true },

  // ─── Summer Collection (active) ───────────────────────────────────────────
  { title: "Men's Summer",     category: "Summer Collection", isActive: true },
  { title: "Women's Summer",   category: "Summer Collection", isActive: true },
  { title: "Kids Summer",      category: "Summer Collection", isActive: true },

  // ─── Winter Collection (inactive — Admin يشغّلها في الشتاء) ───────────────
  { title: "Men's Winter",     category: "Winter Collection", isActive: false },
  { title: "Women's Winter",   category: "Winter Collection", isActive: false },
  { title: "Kids Winter",      category: "Winter Collection", isActive: false },

  // ─── Spring Collection (inactive) ─────────────────────────────────────────
  { title: "Men's Spring",     category: "Spring Collection", isActive: false },
  { title: "Women's Spring",   category: "Spring Collection", isActive: false },

  // ─── Autumn Collection (inactive) ─────────────────────────────────────────
  { title: "Men's Autumn",     category: "Autumn Collection", isActive: false },
  { title: "Women's Autumn",   category: "Autumn Collection", isActive: false },
];