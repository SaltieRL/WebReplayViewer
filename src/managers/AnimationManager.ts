import { AnimationAction, AnimationClip, AnimationMixer } from "three"

interface AnimationManagerOptions {
  playerClips: AnimationClip[]
  playerMixers: AnimationMixer[]
  ballClip: AnimationClip
  ballMixer: AnimationMixer
}

interface AnimationMixers {
  players: AnimationMixer[]
  ball: AnimationMixer
}

interface AnimationActions {
  players: AnimationAction[]
  ball: AnimationAction
}

export default class AnimationManager {
  private readonly mixers: AnimationMixers
  private readonly actions: AnimationActions

  private constructor({
    playerClips,
    playerMixers,
    ballClip,
    ballMixer,
  }: AnimationManagerOptions) {
    this.actions = {} as any

    this.mixers = {
      players: playerMixers,
      ball: ballMixer,
    }

    // Build the player actions
    this.actions.players = []
    for (let player = 0; player < playerClips.length; player++) {
      const clip = playerClips[player]
      const mixer = this.mixers.players[player]
      const action = mixer.clipAction(clip)
      this.actions.players[player] = action
    }
    // Build the ball action
    const ballAction = this.mixers.ball.clipAction(ballClip)
    this.actions.ball = ballAction
  }

  public playAnimationClips() {
    const { players, ball } = this.actions
    players.forEach(action => action.play())
    ball.play()
  }

  public updateAnimationClips(delta: number) {
    const { players, ball } = this.mixers
    players.forEach(player => player.update(delta))
    ball.update(delta)
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: AnimationManager
  static getInstance() {
    if (!AnimationManager.instance) {
      throw new Error("AnimationManager not initialized with call to `init`")
    }
    return AnimationManager.instance
  }
  static init(options: AnimationManagerOptions) {
    AnimationManager.instance = new AnimationManager(options)
    return AnimationManager.instance
  }
}
