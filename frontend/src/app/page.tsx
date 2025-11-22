import { GameProvider } from "@/context/GameContext"
import GameContainer from "@/components/game/GameContainer"

export default function Home() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  )
}
