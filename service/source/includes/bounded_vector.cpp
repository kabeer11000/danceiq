//
// Created by Kabeer Jaffri on 5/29/24.
//

#include "bounded_vector.h"
#include <vector>

template <typename T>
bounded_vector<T>::bounded_vector(size_t maxSize) : maxSize(maxSize) {}

template <typename T>
void bounded_vector<T>::push(const T& item) {
    if (vec.size() == maxSize) {
        vec.erase(vec.begin());
    }
    vec.push_back(item);
}

template <typename T>
const T& bounded_vector<T>::operator[](size_t index) const {
    return vec[index];
}

template <typename T>
size_t bounded_vector<T>::size() const {
    return vec.size();
}
