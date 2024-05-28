// Request access to the user's camera
export async function getWebcamFeed(): Promise<MediaStream> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        return stream;
    } catch (err) {
        console.error('Error accessing media devices.', err);
    }
}