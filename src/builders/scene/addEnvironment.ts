import { Scene, WebGLRenderer, WebGLRenderTargetCube } from "three"

import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator"
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker"
import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"

export const addEnvironment = (scene: Scene, renderer: WebGLRenderer) => {
  const { environment } = GameFieldAssets.getAssets()

  const cubeMap = new WebGLRenderTargetCube(2048, 2048).fromEquirectangularTexture(renderer, environment)

  const pmremGenerator = new PMREMGenerator( cubeMap.texture );
  pmremGenerator.update( renderer );

  const pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
  pmremCubeUVPacker.update( renderer );
  
  // @ts-ignore
  scene.background = cubeMap;

  pmremGenerator.dispose();
  pmremCubeUVPacker.dispose();
  
  const envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;
  return envMap
}
