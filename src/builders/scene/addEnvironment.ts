import { Scene, WebGLRenderer } from "three"

import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator"
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker"
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator"
import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"

export const addEnvironment = (scene: Scene, renderer: WebGLRenderer) => {
  const { environment } = GameFieldAssets.getAssets()

  const cubeGenerator = new EquirectangularToCubeGenerator( environment, { resolution: 2048 } );
  cubeGenerator.update( renderer );

  // @ts-ignore
  const pmremGenerator = new PMREMGenerator( cubeGenerator.renderTarget.texture );
  pmremGenerator.update( renderer );

  const pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
  pmremCubeUVPacker.update( renderer );
  
  // @ts-ignore
  scene.background = cubeGenerator.renderTarget;

  pmremGenerator.dispose();
  pmremCubeUVPacker.dispose();
  
  const envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;
  return envMap
}
