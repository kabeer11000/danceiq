//
// Created by Kabeer Jaffri on 5/29/24.
//

#ifndef DANCEIQ_BOUNDED_VECTOR_H
#define DANCEIQ_BOUNDED_VECTOR_H

#include <vector>

template <typename T>
class bounded_vector {
public:
    // Constructor to initialize the bounded_vector with a maximum size
    explicit bounded_vector(size_t maxSize);

    // Method to push a new item to the bounded_vector
    void push(const T& item);

    // Overloaded operator[] to access elements by index
    const T& operator[](size_t index) const;

    // Method to get the current size of the bounded_vector
    size_t size() const;

private:
    std::vector<T> vec;  // Internal vector to store elements
    size_t maxSize;      // Maximum size of the bounded_vector
};

#endif //DANCEIQ_BOUNDED_VECTOR_H
