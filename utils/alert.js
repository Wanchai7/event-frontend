// utils/alert.js
import Swal from "sweetalert2";

// Success alert
export const showSuccess = (title, message = "") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: message,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#10b981",
    timerProgressBar: true,
    timer: 3000,
    didOpen: (modal) => {
      modal.addEventListener("mouseenter", Swal.hideLoading);
      modal.addEventListener("mouseleave", Swal.showLoading);
    },
  });
};

// Error alert
export const showError = (title, message = "") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#ef4444",
    timerProgressBar: true,
    timer: 3000,
  });
};

// Warning alert
export const showWarning = (title, message = "") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: message,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#f59e0b",
    timerProgressBar: true,
    timer: 3000,
  });
};

// Info alert
export const showInfo = (title, message = "") => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: message,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#3b82f6",
    timerProgressBar: true,
    timer: 3000,
  });
};

// Confirmation dialog (OK/Cancel)
export const showConfirm = (title, message = "", confirmText = "ตกลง", cancelText = "ยกเลิก") => {
  return Swal.fire({
    icon: "question",
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#ef4444",
  });
};

// Delete confirmation (with warning icon)
export const showDeleteConfirm = (itemName = "รายการนี้") => {
  return Swal.fire({
    icon: "warning",
    title: "ลบรายการ",
    text: `คุณแน่ใจหรือว่าต้องการลบ ${itemName}?`,
    showCancelButton: true,
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });
};

// Approval confirmation
export const showApproveConfirm = (itemName = "การจองนี้") => {
  return Swal.fire({
    icon: "question",
    title: "อนุมัติการจอง",
    text: `คุณต้องการอนุมัติ ${itemName} หรือ?`,
    showCancelButton: true,
    confirmButtonText: "อนุมัติ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
  });
};

// Rejection confirmation
export const showRejectConfirm = (itemName = "การจองนี้") => {
  return Swal.fire({
    icon: "question",
    title: "ปฏิเสธการจอง",
    text: `คุณต้องการปฏิเสธ ${itemName} หรือ?`,
    showCancelButton: true,
    confirmButtonText: "ปฏิเสธ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });
};

// Loading alert
export const showLoading = (title = "กำลังดำเนินการ") => {
  return Swal.fire({
    icon: "info",
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading alert
export const closeAlert = () => {
  return Swal.close();
};
