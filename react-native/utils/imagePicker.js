import * as ImagePicker from "expo-image-picker"; // Import Image Picker
import * as ImageManipulator from "expo-image-manipulator"; // Import Image Manipulator

// Function to take an image using the camera
export const takeImage = async (setImage) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera permissions to make this work!");
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1, // Best quality for initial capture
  });

  if (!result.canceled) {
    const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
    setImage(resizedImage); // Set the resized image
  }
};

// Function to pick an image from the library
export const pickImage = async (setImage) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    const resizedImage = await manipulateImage(result.assets[0]); // Resize and compress the image
    setImage(resizedImage); // Set the resized image
  }
};

// Function to resize and compress image using ImageManipulator
const manipulateImage = async (image) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ resize: { width: 1000 } }], // Resize to a width of 1000px, adjust as necessary
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }, // Compress to 60% quality
  );
  return manipResult;
};

// // Function to resize and compress image using ImageManipulator
// const manipulateImage = async (image) => {
//   const manipResult = await ImageManipulator.manipulateAsync(
//       image.uri,
//       [{ resize: { width: 1000 } }], // Resize to a width of 1000px, adjust as necessary
//       { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }, // Compress to 60% quality
//   );
//   return manipResult;
//
// };
