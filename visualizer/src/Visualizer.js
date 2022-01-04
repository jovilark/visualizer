import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from 'react';
import BoxArray from "./BoxArray.js";
import song from './song.mp3'
import { useFrame } from "@react-three/fiber";
import GUI from 'lil-gui';


function Visualizer() {
    const raf = useRef();
    const data = useRef();

    const [controls, setControls] = useState({
        play: pause
    });

    const [started, setStarted] = useState();
    const [audio, setAudio] = useState();
    const [context, setContext] = useState();
    const [source, setSource] = useState();
    const [analyser, setAnalyser] = useState();
    
    const [frame, setFrame] = useState(0);

    useFrame((state, delta) => {
        if (analyser) {
            raf.current = requestAnimationFrame(draw);
            setFrame(frame + 1);
        }
    });

    function draw() {
        const prevData = data.current;
        analyser.getByteTimeDomainData(data.current);

        // Smooth values
        const increment = .1;
        data.current.map((x, i) => { return x < prevData[i] ? prevData[i]-increment : x })
    }

    function prepareAPIs() {
        // fix browser vender for AudioContext and requestAnimationFrame
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        setContext(new window.AudioContext());
    }

    function initializeGUI() {
        const gui = new GUI();
        gui.add(controls, 'play');
    }

    useEffect(() => {
        initializeGUI();
    }, []);

    useEffect(() => {
        if (started) setAudio(new Audio(song));
    }, [started]);

    useEffect(() => {
        console.log(audio);
        if (started) prepareAPIs();
    }, [audio]);

    useEffect(() => {
        if (audio) {
            setSource(context.createMediaElementSource(audio));
            setAnalyser(context.createAnalyser());
        }
    }, [context]);

    useEffect(() => {
        if (context) {
            analyser.connect(context.destination);
            analyser.fftSize = 256;
            data.current = new Uint8Array(analyser.frequencyBinCount);
        }
    }, [analyser]);

    useEffect(() => {
        if (context) {
            if (!analyser) {
                setTimeout(() => { source.connect(analyser); }, 2000)
            }
            else source.connect(analyser);

            pause();
        }
    }, [source]);

    function pause() {
        console.log(audio);

        if (!started) setStarted(true);
        else {
            if (audio.paused) {
                audio.play();
                raf.current = requestAnimationFrame(draw);
            }
            else {
                audio.pause();
                cancelAnimationFrame(raf.current);
            }
        }
    }

    return (
      <>
        <OrbitControls/>
        <Stars/>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <BoxArray scales={data.current} max={5} />
      </>
    )
  }
  
  export default Visualizer;