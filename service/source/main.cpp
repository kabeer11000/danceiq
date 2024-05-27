//#include <websocketpp/config/asio_no_tls.hpp>
//#include <websocketpp/server.hpp>
//
//typedef websocketpp::server<websocketpp::config::asio> server;
//
//int main() {
//    server print_server;
//
//    print_server.set_message_handler([](websocketpp::connection_hdl hdl, server::message_ptr msg) {
//        std::cout << msg->get_payload() << std::endl;
//    });
//
//    print_server.init_asio();
//    print_server.listen(9002);
//    print_server.start_accept();
//
//    print_server.run();
//    return 0;
//}

#include <iostream>
#include <fstream>
#include <vector>
#include "tensorflow/lite/interpreter.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"

int main() {
    const char* model_path = "/Users/asadrizvi/Documents/assignments/danceiq/service/source/model/singlepose-thunder.tflite";

    // Load the model
    std::unique_ptr<tflite::FlatBufferModel> model = tflite::FlatBufferModel::BuildFromFile(model_path);
    if (!model) {
        std::cerr << "Failed to load model" << std::endl;
        return -1;
    }

    // Build the interpreter
    tflite::ops::builtin::BuiltinOpResolver resolver;
    std::unique_ptr<tflite::Interpreter> interpreter;
    tflite::InterpreterBuilder(*model, resolver)(&interpreter);
    if (!interpreter) {
        std::cerr << "Failed to construct interpreter" << std::endl;
        return -1;
    }

    // Allocate tensor buffers.
    if (interpreter->AllocateTensors() != kTfLiteOk) {
        std::cerr << "Failed to allocate tensors!" << std::endl;
        return -1;
    }

    // Get input tensor
    TfLiteTensor* input_tensor = interpreter->tensor(interpreter->inputs()[0]);

    // Resize input tensor to appropriate size (256x256x3)
    if (interpreter->ResizeInputTensor(interpreter->inputs()[0], {1, 256, 256, 3}) != kTfLiteOk) {
        std::cerr << "Failed to resize input tensor" << std::endl;
        return -1;
    }

    // Reallocate tensors after resizing
    if (interpreter->AllocateTensors() != kTfLiteOk) {
        std::cerr << "Failed to allocate tensors after resize!" << std::endl;
        return -1;
    }

    // Load and preprocess image
    // (For simplicity, this is left as an exercise. You'll need to load an image and fill input_tensor->data.f)

    // Run inference
    if (interpreter->Invoke() != kTfLiteOk) {
        std::cerr << "Failed to invoke interpreter" << std::endl;
        return -1;
    }

    // Extract output
    TfLiteTensor* output_tensor = interpreter->tensor(interpreter->outputs()[0]);
    float* output_data = output_tensor->data.f;

    // Print the output (for demonstration purposes)
    for (int i = 0; i < output_tensor->bytes / sizeof(float); ++i) {
        std::cout << output_data[i] << " ";
    }
    std::cout << std::endl;

    return 0;
}
