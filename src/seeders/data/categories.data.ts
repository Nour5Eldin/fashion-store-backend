/**
 * @description Categories data
 * SRS: isActive controls seasonal visibility (admin toggles)
 * 
 * الـ Admin بيتحكم في الـ seasonal categories من الـ Dashboard
 * لما يجي الصيف → يشغّل "Summer Collection"
 * لما يجي الشتاء → يطفيها ويشغّل "Winter Collection"
 */
export const categoriesData = [
  // ─── الـ categories الأساسية — دايماً active ───────────────────────────
  { title: "T-Shirts",  isActive: true,  isDeleted: false },
  { title: "Jeans",     isActive: true,  isDeleted: false },
  { title: "Dresses",   isActive: true,  isDeleted: false },
  { title: "Jackets",   isActive: true,  isDeleted: false },
  { title: "Formal",    isActive: true,  isDeleted: false },
  { title: "Shorts",    isActive: true,  isDeleted: false },
  { title: "Sweaters",  isActive: true,  isDeleted: false },
  { title: "Coats",     isActive: true,  isDeleted: false },
  { title: "Activewear",isActive: true,  isDeleted: false },

  // ─── الـ seasonal categories — Admin بيتحكم فيهم ───────────────────────
  // دلوقتي في الـ demo: Summer active والباقي inactive
  { title: "Summer Collection", isActive: true,  isDeleted: false },
  { title: "Winter Collection", isActive: false, isDeleted: false },
  { title: "Spring Collection", isActive: false, isDeleted: false },
  { title: "Autumn Collection", isActive: false, isDeleted: false },
];