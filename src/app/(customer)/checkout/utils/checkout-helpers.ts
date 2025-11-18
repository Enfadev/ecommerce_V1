export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function calculateOrderTotals(subtotal: number) {
  const shippingFee = subtotal >= 250 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  return {
    subtotal,
    shippingFee,
    tax,
    total,
  };
}

export function getFormCompletionPercentage(formData: { nama: string; email: string; phone: string; alamat: string; paymentMethod: string }): number {
  const requiredFields = [formData.nama.trim() !== "", formData.email.trim() !== "" && isValidEmail(formData.email), formData.phone.trim() !== "", formData.alamat.trim() !== "", formData.paymentMethod.trim() !== ""];
  const completedFields = requiredFields.filter(Boolean).length;
  return Math.round((completedFields / requiredFields.length) * 100);
}

export function isCheckoutFormValid(formData: { nama: string; email: string; phone: string; alamat: string; paymentMethod: string }): boolean {
  return formData.nama.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "" && formData.alamat.trim() !== "" && formData.paymentMethod.trim() !== "" && isValidEmail(formData.email);
}
