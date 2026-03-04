import { GradientButton } from "@/components/ui/gradient-button"

function GradientButtonDemo() {
  return (
    <div className="flex gap-8 items-center justify-center p-12">
      <GradientButton>Get Started</GradientButton>
      <GradientButton>Learn More</GradientButton>
    </div>
  )
}

export { GradientButtonDemo }
