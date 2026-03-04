"use client";

import { GradientButton } from "@/components/ui/gradient-button";

export default function GradientButtonTestPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-syne font-extrabold tracking-tight mb-2 text-white">
          Gradient Button Test
        </h1>
        <p className="text-t2 text-sm md:text-base">
          Testing the new animated gradient buttons
        </p>
      </div>

      <div className="glass-card rounded-2xl p-12">
        <h2 className="text-2xl font-syne font-bold text-white mb-8">Gradient Button</h2>
        
        <div className="space-y-8">
          {/* Blue/Green Gradient */}
          <div>
            <h3 className="text-lg font-syne font-semibold text-t1 mb-4">Blue/Green Gradient</h3>
            <div className="flex gap-6 flex-wrap">
              <GradientButton>Get Started</GradientButton>
              <GradientButton>Learn More</GradientButton>
              <GradientButton>Join Now</GradientButton>
            </div>
          </div>

          {/* Disabled State */}
          <div>
            <h3 className="text-lg font-syne font-semibold text-t1 mb-4">Disabled State</h3>
            <div className="flex gap-6 flex-wrap">
              <GradientButton disabled>Disabled Button</GradientButton>
            </div>
          </div>

          {/* With onClick */}
          <div>
            <h3 className="text-lg font-syne font-semibold text-t1 mb-4">Interactive</h3>
            <div className="flex gap-6 flex-wrap">
              <GradientButton onClick={() => alert('Clicked!')}>
                Click Me
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-card rounded-2xl p-6">
        <h3 className="text-lg font-syne font-semibold text-t1 mb-2">Usage Example</h3>
        <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
          <code className="text-primary text-sm font-mono">
{`import { GradientButton } from "@/components/ui/gradient-button"

// Blue/Green Gradient
<GradientButton>Learn More</GradientButton>

// With onClick
<GradientButton onClick={() => console.log('clicked')}>
  Click Me
</GradientButton>

// Disabled
<GradientButton disabled>Disabled</GradientButton>`}
          </code>
        </pre>
      </div>
    </div>
  );
}
