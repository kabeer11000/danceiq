#include <socketio-serverpp/server.hpp>

/* This example only a draft of the interface that
 * should be implemented.
 */

int main()
{
    socketio-serverpp::server io;

    io.listen(9000);

    //io.sockets.on("connection", [](socketio-serverpp::socket socket)
    io.sockets.on(socketio-serverpp::event::connection, [](socketio-serverpp::socket socket)
    {
        socket.emit('my event', 'some data');
        socket.on('other event', [](const string& data)
        {
            cout << data << endl;
        });
    });

    auto chat = io.of("/chat");
    chat.on("connection", [&](socketio-serverpp::socket socket)
    {
        socket.emit("a message", "only socket will get");
        chat.emit("a message", "all in /chat will get");
    });

    io.run();
}
