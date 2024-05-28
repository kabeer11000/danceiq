//
// Created by Kabeer Jaffri on 5/28/24.
//

#ifndef DANCEIQ_SOCKET_HANDLERS_H
#define DANCEIQ_SOCKET_HANDLERS_H

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <nlohmann/json.hpp>
#include <iostream>
#include <tensorflow/lite/interpreter.h>
#include <tensorflow/lite/kernels/register.h>
#include <tensorflow/lite/model.h>

typedef websocketpp::server<websocketpp::config::asio> server;
using json = nlohmann::json;

class socket_handlers {
public:
    socket_handlers();

    void handle_async_frame_data(const websocketpp::connection_hdl &, const std::vector<uint8_t>&);

    static void handle_get_remote_info(server *, const websocketpp::connection_hdl &);

    static void handle_get_library_info(server *, const websocketpp::connection_hdl &);

    static void handle_unknown_event(server *, const websocketpp::connection_hdl &);

private:
    server *m_server{};
    std::unique_ptr<tflite::FlatBufferModel> model;
    std::unique_ptr<tflite::Interpreter> interpreter;
};

#endif //DANCEIQ_SOCKET_HANDLERS_H
