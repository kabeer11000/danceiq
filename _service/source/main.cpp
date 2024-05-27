#include "iostream"
#include <openpose/headers.hpp>
#include <opencv2/opencv.hpp>

int main() {
    try {
        // Configure OpenPose wrapper
        op::Wrapper opWrapper{op::ThreadManagerMode::Asynchronous};
        opWrapper.start();

        // Read an image
        cv::Mat inputImage = cv::imread("./sample/man-standing-612x612.jpg");
        if (inputImage.empty()) {
            std::cerr << "Could not read the image" << std::endl;
            return 1;
        }

        // Convert image to OpenPose format
        auto imageToProcess = OP_CV2OPCONSTMAT(inputImage);

        // Process image
        auto datumProcessed = opWrapper.emplaceAndPop(imageToProcess);
        if (datumProcessed != nullptr) {
            // Display results
            const auto outputImage = datumProcessed->at(0)->cvOutputData;
//            saveImage(outputImage,"man-standing-612x612-processed.jpg");
            cv::waitKey(0);
        } else {
            std::cerr << "Image could not be processed" << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return -1;
    }
    return 0;
}
