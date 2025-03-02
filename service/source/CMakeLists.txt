cmake_minimum_required(VERSION 3.28)
project(DanceIQ)

set(CMAKE_CXX_STANDARD 14)
set(OpenCV_DIR "/usr/local/Cellar/opencv/4.x.x/share/OpenCV")

find_package(OpenCV REQUIRED)
find_package(Boost REQUIRED COMPONENTS system filesystem thread)
find_package(gflags REQUIRED)
find_package(glog CONFIG REQUIRED)
find_package(Boost 1.58.0 REQUIRED COMPONENTS system)
find_package(Threads)
# lib has 1 file: libtensorflowlite.dylib
add_library(tensorflowlite SHARED IMPORTED)

include(FetchContent)

FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz)
FetchContent_MakeAvailable(json)

if (APPLE)
    SET(OPENSSL_ROOT_DIR /usr/local/opt/openssl/)
    set_property(TARGET tensorflowlite PROPERTY IMPORTED_LOCATION ${CMAKE_CURRENT_SOURCE_DIR}/deps/tflite-dist/libs/mac/libtensorflowlite.dylib)
endif (APPLE)
if (WIN32)
#    set_property(TARGET tensorflowlite PROPERTY IMPORTED_LOCATION ${CMAKE_CURRENT_SOURCE_DIR}/deps/tflite-dist/libs/windows_x64/libtensorflowlite.dylib)
endif (WIN32)
find_package(OpenSSL)
include_directories(${Boost_INCLUDE_DIRS} ${OPENSSL_INCLUDE_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/deps/tflite-dist/include/ ${CMAKE_CURRENT_SOURCE_DIR}/deps/websocketpp/)
file(GLOB DanceIQSrcs CONFIGURE_DEPENDS "includes/*.h" "includes/*.cpp")
add_executable(DanceIQ main.cpp ${DanceIQSrcs}
        includes/socket_handlers.cpp
        includes/socket_handlers.h
        includes/bounded_vector.cpp
        includes/bounded_vector.h
        includes/utils.h)
target_link_libraries(DanceIQ ${OPENSSL_LIBRARIES} ${OpenCV_LIBS} ${Boost_LIBRARIES} gflags glog::glog tensorflowlite nlohmann_json::nlohmann_json)


#cmake_minimum_required(VERSION 3.28)
#project(DanceIQ)
#
#set(CMAKE_CXX_STANDARD 20)
#set(CMAKE_PREFIX_PATH "./openpose")
#set(OpenCV_DIR "/usr/local/Cellar/opencv/4.x.x/share/OpenCV")
#
#find_package(OpenCV REQUIRED)
#find_package(Boost REQUIRED COMPONENTS system filesystem thread)
#find_package(gflags REQUIRED)
#
#find_package(glog CONFIG REQUIRED)
#find_package(websocketpp CONFIG REQUIRED)
#
#find_package(Boost 1.58.0 REQUIRED COMPONENTS system)
#find_package (Threads)
#
#if (APPLE)
#    SET(OPENSSL_ROOT_DIR /usr/local/opt/openssl/)
#endif (APPLE)
#find_package(OpenSSL)
#
#include_directories(${Boost_INCLUDE_DIRS} ${OPENSSL_INCLUDE_DIR} ./openpose/include/)
#link_directories(./openpose/build/src/openpose)
#add_executable(DanceIQ main.cpp)
#target_link_libraries(DanceIQ ${OPENSSL_LIBRARIES} ${OpenCV_LIBS} ${Boost_LIBRARIES} gflags glog::glog websocketpp::websocketpp openpose)


#

#target_link_libraries(DanceIQ ${OpenCV_LIBS} ${Boost_LIBRARIES} gflags glog glog::glog openpose_lib)

#

#cmake_minimum_required(VERSION 3.28)
#project(generated)
#
#set(CMAKE_CXX_STANDARD 23)
#
#add_executable(generated main.cpp)
