import { useEffect } from "react";

export const useDataConverter = () => {
  const imageDataToBlob = (imageData: ImageData): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Failed to convert imageData to blob");
        }

        resolve(blob);
      });
    });
  };

  const stringToFile = (input: string, filename: string) => {
    if (!input) return;

    const blob = new Blob([JSON.stringify({ input }, null, 2)], {
      type: "application/json",
    });
    const file = new File([blob], filename);
    return file;
  };

  const fileToBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const blobToJson = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const fetchJsonFromUrl = async (url: string) => {
    if (!url) return;
    return await fetch(url).then(async (response) => {
      const blob = await response.blob();
      const json = await blobToJson(blob);
      const jsonParsed = JSON.parse(json as string);
      return jsonParsed;
    });
  };

  const base64ToFile = (base64String: string): File => {
    const byteString = atob(base64String.split(",")[1]);
    const mimeTypeFromString = base64String.match(/data:(.*?);base64/)?.[1];
    const mimeTypeFinal = mimeTypeFromString;

    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: mimeTypeFinal });
    const file = new File([blob], "image.png", { type: mimeTypeFinal });

    return file;
  };

  const convertSvgToBase64 = (src: string) => {
    return fetch(src)
      .then((response) => response.text())
      .then((svgContent) => {
        const base64Svg = btoa(svgContent);
        const base64Image = `data:image/svg+xml;base64,${base64Svg}`;
        return base64Image;
      })
      .catch((error) => {
        console.error("Error fetching the SVG:", error);
        return "";
      });
  };

  const convertImageToFile = async (imageUrl: string) => {
    // Fetch the image data as a Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Convert the Blob to a File object
    const file = new File([blob], "image.png", { type: "image/png" });

    return file;
  };

  return {
    imageDataToBlob,
    stringToFile,
    fileToBase64,
    blobToJson,
    fetchJsonFromUrl,
    base64ToFile,
    convertSvgToBase64,
    convertImageToFile,
  };
};
