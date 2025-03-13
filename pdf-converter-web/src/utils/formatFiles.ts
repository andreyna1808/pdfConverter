export const getFormatRequest = (value: string) => {
  switch (value) {
    case "pdf/pdf-to-jpg":
    case "pdf/compress":
    case "pdf/pdf-to-word":
      return { body: ["file"], type: ".pdf" };
    case "converter/img-to-pdf":
      return { body: ["file"], type: "image/*" };
    case "format/abnt":
      return { body: ["file"], type: ".doc,.docx" };
    case "pdf/merge":
      return { body: ["files"], type: ".pdf" };
    case "pdf/remove-pages":
      return { body: ["pages", "file"], type: ".pdf" };
    case "classification/get-result":
      return { body: ["file", "requestJson"], type: ".pdf" };
    default:
      return { body: null, type: "" };
  }
};
