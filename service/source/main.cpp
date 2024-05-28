#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <nlohmann/json.hpp>
#include "includes/socket_handlers.h"
#include "includes/utils.h"
#include <iostream>

typedef websocketpp::server<websocketpp::config::asio> server;
using json = nlohmann::json;

void on_message(server* s, const websocketpp::connection_hdl &hdl, const server::message_ptr &msg, socket_handlers& handler) {
    // Parse incoming JSON message
    json received = json::parse(msg->get_payload());
    std::cout << "Received: " << received.dump() << std::endl;

    // Check for custom event types
    if (received.contains("__type")) {
        std::string event_type = received["__type"];

        if (event_type == "get-remote-info") {
            socket_handlers::handle_get_remote_info(s, hdl);
        } else if (event_type == "async-frame-data") {
            const abstract_image data = received["data"];
            handler.handle_async_frame_data(hdl, data);
        } else if (event_type == "get-library-info") {
            socket_handlers::handle_get_library_info(s, hdl);
        } else if (event_type == "get-library-info") {
            socket_handlers::handle_get_library_info(s, hdl);
        } else {
            socket_handlers::handle_unknown_event(s, hdl);
        }
    }
}

int main() {
    server print_server;
    socket_handlers handler{};

    print_server.set_message_handler([capture0 = &print_server, &handler](auto &&PH1, auto &&PH2) {
        on_message(capture0, std::forward<decltype(PH1)>(PH1), std::forward<decltype(PH2)>(PH2), handler);
    });

    print_server.init_asio();
    print_server.listen(9001);
    print_server.start_accept();

    std::cout << "WebSocket server started at ws://localhost:9001" << std::endl;

    print_server.run();
    return 0;
}