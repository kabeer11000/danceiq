Using Machine Learning to Teach People How to Dance
Authors: Kabeer Jaffri (kabeer11000@gmail.com), Eesha Ali (eeshaali85@gmail.com)
Abstract
This paper presents a novel approach for real-time dance performance evaluation 
that emphasizes robust pose matching despite temporal and spatial challenges. A 
custom dynamic window technique is employed to compare a sequence of frames, 
enabling adaptive difficulty adjustments while accounting for processing 
constraints. To address the sensitivity of traditional loss functions to global 
translations of key points, we introduce a translation-invariant metric that 
centers both reference and input poses using a pseudo-average of tracked points 
before computing pairwise losses. Additionally, our framework leverages temporal
offsets by comparing input frames with multiple nearby reference frames, thereby
enhancing the system’s resilience to minor misalignments. The integrated 
approach delivers reliable real-time feedback, advancing the precision of 
automated dance performance assessments.

1. Introduction
The development of real-time interactive systems demands a delicate balance 
between high-performance backend processing and a responsive, intuitive frontend
design. In the realm of dance tutoring, where precise movement tracking and 
immediate feedback are paramount, our project delivers an end-to-end solution 
that integrates advanced backend technologies with a dynamic web interface.
At its core, the system utilizes a C++ backend to manage data communication, 
real-time processing, and custom event handling. This robust backend leverages 
efficient WebSocket communication to facilitate the rapid exchange of pose data,
while a Next.js frontend visualizes the results by overlaying model predictions 
on reference data. This integration not only ensures that users receive timely 
feedback but also maintains an interactive and engaging user experience.
A significant challenge addressed during development was the initialization of 
the video pipeline. The system needed a reliable method to detect when the user 
was correctly positioned, preventing premature processing that could result from
a quick click followed by an out-of-position pose. To overcome this, we 
implemented a custom starting pose mechanism. Once the starting pose is 
detected, a countdown is triggered, ensuring that the dancer is properly aligned
before the system begins the pose evaluation process.
This paper details our implementation strategy, system architecture, and the 
performance challenges encountered. In particular, we explore how our custom 
event handling, dynamic window techniques, and translation-invariant loss 
function collectively contribute to a robust real-time feedback mechanism. The 
discussion focuses on the technical nuances of synchronizing multi-modal data 
streams and ensuring that the system can reliably guide users through their 
dance practice, even in the face of inherent real-world variations.

2. Backend Service Implementation
2.1. Architectural Overview
The backend service is developed in C++ to ensure high-performance and efficient
handling of real-time data. Core libraries include:

websocketpp: Facilitates robust WebSocket communication, ensuring low-latency, 
bidirectional data transfer between the client and server.
nlohmann/json: Provides a user-friendly interface for JSON parsing and 
generation, essential for interpreting incoming messages and constructing 
responses.

In addition to these C++-based tools, the overall system architecture integrates
several state-of-the-art machine learning and computer vision frameworks, such 
as TensorFlow, PyTorch, and MediaPipe. These frameworks support model training, 
inference, and advanced pose detection, contributing to the robustness and 
versatility of the dance tutoring application.
2.2. Core Functionality
At the heart of the backend lies a modular event processing system, designed to 
handle multiple custom event types with precision and resilience. The primary 
responsibilities include:

JSON Message Reception: The service continuously listens for incoming JSON 
messages over a persistent WebSocket connection.
Event Type Identification: Each incoming message is examined for a custom __type
field, which directs the subsequent action.

A representative snippet of the event handler is provided below:
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
} else {
socket_handlers::handle_unknown_event(s, hdl);
}
}

This modular approach not only ensures that the backend can effectively manage 
real-time data streams but also facilitates the integration of advanced 
analytical models and computer vision techniques provided by frameworks like 
TensorFlow, PyTorch, and MediaPipe. Collectively, these components create a 
robust foundation for delivering precise and timely feedback in our dance 
tutoring application.
2.2.1. Event Types
In our system, all communication events are encapsulated under a unified event 
name ("message") and distinguished by the __type property within the JSON 
payload. The main events include:

get-remote-info:

Upstream (>): The client sends a JSON message with an empty payload ({}) to 
request remote server information.
Downstream ( The server responds with a get-remote-info-response containing 
details such as the server version (e.g., "1.0.0") and the model in use (e.g., 
"sample-model"). This exchange validates the connection and provides basic 
configuration data.
async-frame-data:

Upstream (>): The client transmits binary data (JPEG image) representing a frame
captured from the video feed.
Downstream ( The server processes the frame (recording the current time for 
reference) and sends back an async-frame-data-response. The response is a JSON 
object containing:
A correct boolean indicating whether the pose matches the reference.
A skeleton array with computed coordinates for key points.
An initial flag to mark the first frame or initial state.
get-library-info:

Upstream (>): The client sends an empty JSON request to fetch information about 
the available dance library.
Downstream ( The server returns a get-library-response containing an array of 
objects, where each object includes:
An id (as a string),
A poster (e.g., "sample-poster.png"),
A title representing the dance entry.
Unknown Event Handling:
Any event with an unrecognized __type triggers a dedicated error handler, 
ensuring that unexpected or malformed messages do not disrupt system operation. 
This robust error management strategy preserves overall system stability during 
runtime.    


3. Frontend Integration with Next.js
3.1. Overview
The frontend is built with Next.js, a React framework renowned for its 
server-side rendering capabilities and modular design. It plays a critical role 
in visualizing the output of the backend’s processing pipeline, overlaying 
real-time predictions on pre-defined reference data to offer intuitive feedback 
on user performance.
3.2. Real-Time Data Interaction
The integration between the frontend and the C++ backend is accomplished via a 
persistent WebSocket connection. This connection allows for:

Bi-Directional Communication:
The frontend sends user input and control commands to the backend while 
receiving live updates, such as processed frame data and model predictions.
Dynamic Visualization:
As the backend processes each frame, the frontend updates its display in real 
time. The user interface overlays the predicted pose or movement data on top of 
reference animations or guidelines, making it easier for users to adjust their 
performance accordingly.

4. Performance Considerations
4.1. Target Latency and Observed Performance
One of the primary performance goals was to achieve a processing latency of 
under 150ms to ensure that feedback is effectively real-time. However, our 
testing indicated an average latency of approximately 820ms. The factors 
contributing to this performance gap include:

Computational Overhead:
The use of JSON parsing via nlohmann/json, while convenient, introduces some 
delay in processing the incoming messages.
Frame Synchronization:
Synchronizing the asynchronous frame data, especially in scenarios with high 
data throughput, adds to the overall processing time.
Model Inference Delays:
The inference engine, possibly running on remote servers or sub-optimal local 
hardware, contributes significantly to the latency.

4.2. Lessons Learned
Despite not meeting the sub-150ms target, several valuable insights were gained:

Modular Design Advantages:
Breaking down the functionality into distinct modules (e.g., socket handlers, 
frame processing) allowed for easier identification and isolation of performance
bottlenecks.
Potential of Local Models:
Preliminary tests suggest that running lightweight models (such as MoveNet) 
locally could reduce inference time and thereby lower overall latency.
Future Optimization Opportunities:
Optimizations might include refining the JSON parsing logic, improving thread 
management for concurrent frame processing, and exploring alternative libraries 
or protocols for lower-latency communication.

4.3. Forward-Looking Enhancements
Based on our observations, future work could involve:

Migrating to On-Device Processing:
Reducing dependency on remote servers by deploying efficient, on-device models 
for pose estimation.
Optimizing Data Pipelines:
Implementing more efficient data buffering and synchronization techniques in the
backend to minimize processing delays.
Enhanced Error Handling:
Continuously refining the unknown event handling logic to further bolster system
robustness under varied operational conditions.


5. Technical Implementation Details
5.1. Custom Loss Function for Pose Matching
Traditional loss functions used in pose estimation can be overly sensitive to 
global translations, resulting in high loss values even when the relative pose 
structure is correct. To mitigate this, we developed a custom loss function that
introduces translation invariance through the following steps:

Centroid Calculation:
For both the reference and input feed, a pseudo average point (centroid) is 
computed. This is achieved by averaging the x and y coordinates of all tracked 
key points (e.g., hands, elbows, knees):
Here’s one way to include the same formulas in Obsidian using LaTeX. Just paste 
this into your note:

$$
\text{centroid}x = \frac{1}{N}\sum{i=1}^N xi, 
\quad
\text{centroid}y = \frac{1}{N}\sum{i=1}^N yi
$$
​

Translation Adjustment:
Once the centroids are calculated, the x and y translation for each set of key 
points is subtracted from their respective coordinates. This normalization step 
effectively centers the pose data, ensuring that the loss calculation focuses 
solely on the relative positions of the points.
Pairwise Loss Computation:
With both the reference and input poses centered, the system computes the 
pairwise loss between corresponding key points. This loss function is less 
affected by global translations and better captures the intrinsic similarity of 
the poses. The resulting loss metric is used to generate predictions and assess 
the correctness of the user's movements.

5.2. Temporal Offset in Frame Matching
To further refine the pose matching process, the system incorporates a temporal 
offset strategy. Instead of strictly aligning input frame $K$ with the reference
frame $K_{refrence}$, the algorithm performs comparisons against frames $K+n$ 
and $K−n$. This design accounts for:

Temporal Variability:
Variations in processing speed, network delays, or minor user movement 
discrepancies can lead to slight temporal misalignments. Comparing multiple 
offset frames increases the likelihood of finding an optimal match.
Robust Prediction:
By evaluating a range of frames, the system reduces the impact of any single 
frame’s anomaly, leading to more stable and reliable pose predictions.
Trade-offs:
Increasing the window size enhances the matching accuracy by considering a 
broader temporal context. However, this comes at the cost of higher processing 
demand, which is an important factor in real-time applications.

This temporal offset mechanism, combined with the DWT and custom loss function, 
ensures that the system accurately evaluates pose similarity even in the 
presence of common real-world challenges like translation shifts and timing 
discrepancies.
6. Future Work
Future work will focus on further enhancing both the technical performance and 
user experience of the system:

Optimizing Inference and Model Deployment:
Investigating lightweight models such as MoveNet and further refining 
TensorFlow/PyTorch pipelines to enable on-device inference. This approach aims 
to reduce reliance on external servers, decrease inference delays, and improve 
real-time feedback.
Enhancing Communication Efficiency:
Exploring alternative data serialization formats and optimized WebSocket 
implementations to reduce communication overhead, particularly for binary frame 
data. These improvements could result in more efficient bidirectional data 
transfers and lower overall latency.
Refining the Custom Dynamic Window Technique and Loss Function:
Further tuning the dynamic window technique (DWT) for temporal alignment, 
alongside improving the translation-invariant loss function. Adjustments in 
these areas will better accommodate temporal misalignments and global 
translation variances, enhancing the robustness of pose matching.
User Experience and Calibration Studies:
Conducting comprehensive user studies to evaluate the impact of feedback latency
and the starting pose mechanism on dance performance. Insights from these 
studies will help refine system calibration, ensuring that the timing and 
feedback are optimized for a diverse user base.
Scalability and Robustness Enhancements:
Addressing system scalability to support higher concurrency levels and more 
complex interaction scenarios. This includes enhancing error handling and 
expanding the modular event processing system to accommodate additional 
functionalities as the application evolves.

This work demonstrates the viability of integrating a robust C++ backend with a 
modern web-based frontend for real-time interactive applications, and it lays 
the groundwork for ongoing advancements in AI-assisted dance instruction.
7. Conclusion
In summary, our integrated dance tutoring system successfully combines a 
high-performance C++ backend with a dynamic Next.js frontend to deliver 
real-time feedback on dance performance. Through the development of a custom 
dynamic window technique and a translation-invariant loss function, the system 
addresses challenges inherent in real-time pose matching, including temporal 
misalignments and translation variances. The introduction of a dedicated 
starting pose mechanism further enhances the user experience by ensuring that 
the video pipeline initiates only when the dancer is properly positioned.
The backend's modular event processing—distinguishing events by the __type 
property—provides a robust framework for managing diverse data flows and error 
conditions. Additionally, integration with advanced frameworks such as 
TensorFlow, PyTorch, and MediaPipe has fortified the system's capability to 
perform sophisticated pose detection and analysis.
While some performance targets remain aspirational, the insights gleaned from 
this project pave the way for future enhancements, including optimization of 
data processing pipelines and deployment of on-device inference models. This 
work not only underscores the potential of combining traditional software 
engineering techniques with cutting-edge AI methodologies but also lays a strong
foundation for subsequent iterations in the domain of automated dance 
performance assessment.
