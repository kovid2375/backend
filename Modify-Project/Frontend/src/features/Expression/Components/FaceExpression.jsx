import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";


export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        const mood = detect({ landmarkerRef, videoRef, setExpression })

        if (mood) {
            onClick(mood)
        }
    }


    return (
        <div className="expression-card">
            <div className="expression-video-wrap">
                <video
                    ref={videoRef}
                    className="expression-video"
                    playsInline
                />
            </div>
            <div className="expression-result">
                <h2>{expression}</h2>
                <button onClick={handleClick} className="detect-button" type="button">
                    Detect mood
                </button>
            </div>
        </div>
    );
}
