export function getFormData(formData) {
    // const formData = new FormData(e.target)
    return Object.fromEntries(formData.entries())
}