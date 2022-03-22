function getDocumentPreview(doc) {
  return doc.text.substring(0, 50) + (doc.text.length > 50 ? "..." : "");
}

module.exports = {
  getDocumentPreview,
};
