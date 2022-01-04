import { Canvas } from "@react-three/fiber";
import Visualizer from './Visualizer.js'
import ReactAudioPlayer from 'react-audio-player';

function App() {
  return (
    <>
      <Canvas>
        <Visualizer/>
      </Canvas>
    <ReactAudioPlayer
        src="/song.ogg"
        autoPlay
        controls
      />
    </>
  )
}

export default App;
