import { ReplayData } from "../models/ReplayData"

const getFrame = (replayData: ReplayData, frameNumber: number) =>
  replayData.frames[frameNumber]

export const getDelta = (replayData: ReplayData, frameNumber: number) =>
  getFrame(replayData, frameNumber)[0]
export const getGameTime = (replayData: ReplayData, frameNumber: number) =>
  getFrame(replayData, frameNumber)[1]
export const getElapsedTime = (replayData: ReplayData, frameNumber: number) =>
  getFrame(replayData, frameNumber)[2]
