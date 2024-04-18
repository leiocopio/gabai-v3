import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParticipant,  useMeeting } from "@videosdk.live/react-sdk"; // Importing a custom hook to manage participant streams
import ReactPlayer from "react-player"; // Importing ReactPlayer component for video playback

function ParticipantView(props) {
  const micRef = useRef(null); // Creating a ref to hold reference to audio element
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
    props.participantId
  ); // Destructuring properties from the useParticipant custom hook

  // Memoized video stream based on webcam status
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {

      // If webcam is on and stream exists
      const mediaStream = new MediaStream(); // Creating a new MediaStream object
      mediaStream.addTrack(webcamStream.track); // Adding webcam track to the stream
      return mediaStream; // Returning the constructed stream
    }
  }, [webcamStream, webcamOn]); // Dependency array for memoization

  // Effect to handle mic stream and playback
  useEffect(() => {
    if (micRef.current) {

      // Checking if the micRef has been initialized
      if (micOn && micStream) {
        
        // If mic is on and micStream exists
        const mediaStream = new MediaStream(); // Creating a new MediaStream object
        mediaStream.addTrack(micStream.track); // Adding mic track to the stream

        micRef.current.srcObject = mediaStream; // Setting audio element's srcObject to the constructed stream
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          ); // Attempting to play the audio element, catching any errors
      } else {
        micRef.current.srcObject = null; // Setting audio element's srcObject to null if mic is off or micStream is null
      }
    }
  }, [micStream, micOn]); // Dependency array for mic effect

  // Effect to ensure re-render when webcamOn changes
  useEffect(() => {
    // This effect will run whenever webcamOn changes, ensuring the component re-renders
  }, [webcamOn]);

  //Active Speaker Indication
  const {
    /** Methods */
  } = useMeeting({
    onSpeakerChanged: (activeSpeakerId) => {
      console.log("Active Speaker participantId", activeSpeakerId);
    },
  });

  

  return (
    <div className="flex flex-row justify-center items-center w-full h-full">
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />{" "}
      {/* Audio element for mic playback */}
      <div className="flex justify-center items-center w-full h-full">
        {/* Conditionally render ReactPlayer or gray background based on webcam status */}
        {webcamOn ? ( // If webcam is on
          <div
            className="relative py-5 bg-gray-700 rounded-xl overflow-clip z-0"
          >
            <ReactPlayer
              style={{ zIndex: "999" }}
              className="rounded-xl flex h-full justify-center items-center"
              playsinline
              pip={false}
              light={false}
              controls={false}
              muted={true}
              playing={true}
              url={videoStream} // Passing the constructed video stream as URL
              onError={(err) => {
                console.log(err, "participant video error");
              }} // Handling ReactPlayer errors
            />
          </div>
        ) : (
          // If webcam is off
          <div className=" relative w-full h-full bg-gray-700 rounded-xl overflow-clip z-0" /> // Displaying a gray background
        )}
      </div>
    </div>
  );
}

export default ParticipantView; // Exporting the ParticipantView component
