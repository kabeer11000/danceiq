brew install cmake boost glog gflags opencv
cd openpose && ./scripts/getModels.sh
git clone https://github.com/google/glog.git
mkdir build
# shellcheck disable=SC2164
cd build
cmake ..
# build openpose
# shellcheck disable=SC2046
make -j`sysctl -n hw.ncpu`
