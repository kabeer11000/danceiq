//
// Created by Kabeer Jaffri on 5/28/24.
//

#include "socket_handlers.h"
#include "bounded_vector.h"
#include "utils.h"
#include <chrono>
#include <vector>
#include <algorithm>
#include <opencv2/opencv.hpp> // Ensure you have OpenCV for image preprocessing

// Constructor to load the model and build the interpreter
socket_handlers::socket_handlers() {
    const char *model_path = "/Users/asadrizvi/Documents/assignments/danceiq/service/source/model/lite-model_movenet_singlepose_lightning_tflite_float16_4.tflite";

    // int:id (assigned randomly)|bounded_vector<abstract_image>
    std::unordered_map<int, bounded_vector<abstract_image>> frame_history{};

    // Load the model
    model = tflite::FlatBufferModel::BuildFromFile(model_path);
    if (!model) {
        std::cerr << "Failed to load model" << std::endl;
        exit(-1);
    }

    // Build the interpreter
    tflite::ops::builtin::BuiltinOpResolver resolver;
    tflite::InterpreterBuilder(*model, resolver)(&interpreter);
    if (!interpreter) {
        std::cerr << "Failed to construct interpreter" << std::endl;
        exit(-1);
    }

    // Allocate tensor buffers
    if (interpreter->AllocateTensors() != kTfLiteOk) {
        std::cerr << "Failed to allocate tensors!" << std::endl;
        exit(-1);
    }

    // Resize input tensor to appropriate size (192x192x3)
    if (interpreter->ResizeInputTensor(interpreter->inputs()[0], {1, 192, 192, 3}) != kTfLiteOk) {
        std::cerr << "Failed to resize input tensor" << std::endl;
        exit(-1);
    }

    // Reallocate tensors after resizing
    if (interpreter->AllocateTensors() != kTfLiteOk) {
        std::cerr << "Failed to allocate tensors after resize!" << std::endl;
        exit(-1);
    }
}

// Handles asynchronous frame data processing
void socket_handlers::handle_async_frame_data(const websocketpp::connection_hdl &hdl, const abstract_image &data) {
    std::cout << "Received async frame data of size: " << data.size() << std::endl;

    // Decode the binary data into an image using OpenCV
    std::vector<unsigned char> image_data(data.begin(), data.end());

    // Automatically identifies mime type, by encoding bytes
    cv::Mat image = cv::imdecode(image_data, cv::IMREAD_COLOR);

    if (image.empty()) {
        std::cerr << "Failed to decode image" << std::endl;
        return;
    }

    // Resize the image to the model's expected input size
    cv::Mat resized_image;
    cv::resize(image, resized_image, cv::Size(192, 192));

    // Convert image to uint8 and normalize (assuming the model expects values in [0, 255])
    resized_image.convertTo(resized_image, CV_8UC3);

    // Check input tensor dimensions
    TfLiteTensor *input_tensor = interpreter->tensor(interpreter->inputs()[0]);
    if (input_tensor->dims->size != 4 || input_tensor->dims->data[0] != 1 ||
        input_tensor->dims->data[1] != 192 || input_tensor->dims->data[2] != 192 ||
        input_tensor->dims->data[3] != 3) {
        std::cerr << "Input tensor dimensions do not match expected model dimensions" << std::endl;
        return;
    }

    // Copy the image data to the input tensor
    std::memcpy(input_tensor->data.uint8, resized_image.data, resized_image.total() * resized_image.elemSize());

    // Run inference
    if (interpreter->Invoke() != kTfLiteOk) {
        std::cerr << "Failed to invoke interpreter" << std::endl;
        return;
    }

    // Extract output
    TfLiteTensor *output_tensor = interpreter->tensor(interpreter->outputs()[0]);
    float *output_data = output_tensor->data.f;

    // Assuming the output tensor requires dequantization
    // For demonstration, let's assume the output is a list of keypoints
    std::vector<nlohmann::json> skeleton;
    for (int i = 0; i < 17; ++i) {
        nlohmann::json keypoint = {
                {"x",     output_data[i * 3 + 1]}, // yx coordinates are stored in this order
                {"y",     output_data[i * 3]},
                {"score", output_data[i * 3 + 2]}
        };
        skeleton.push_back(keypoint);
    }

    nlohmann::json response = {
            {"__type",   "async-frame-data-response"},
            {"skeleton", skeleton}
    };
    m_server->send(hdl, response.dump(),
                   websocketpp::frame::opcode::text); // Assuming the server pointer (m_server) is correctly set in the handler
}

// Handles get user info event
void socket_handlers::handle_get_remote_info(server *s, const websocketpp::connection_hdl &hdl) {
    json response;
    response["__type"] = "get-remote-info-response";
    response["data"] = {{"version", "0.0.3"},
                        {"model",   "TF Lite Single Pose Thunder"}};

    s->send(hdl, response.dump(), websocketpp::frame::opcode::text);
}

// Handles get library info event
void socket_handlers::handle_get_library_info(server *s, const websocketpp::connection_hdl &hdl) {
    nlohmann::json response;
    response["__type"] = "get-library-info-response";
    response["data"] = nlohmann::json::array({
                                                     {{"id", "1"}, {"poster", "poster1.jpg"}, {"title", "Title 1"}},
                                                     {{"id", "2"}, {"poster", "poster2.jpg"}, {"title", "Title 2"}},
                                                     {{"id", "3"}, {"poster", "poster3.jpg"}, {"title", "Title 3"}}
                                             });

    s->send(hdl, response.dump(), websocketpp::frame::opcode::text);
}

// Handles unknown event types
void socket_handlers::handle_unknown_event(server *s, const websocketpp::connection_hdl &hdl) {
    json response;
    response["__type"] = "error";
    response["message"] = "Unknown event type";
}