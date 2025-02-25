import ProjectSection from '@/components/ProjectSection';
import HeroSection from '@/components/HeroSection';

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section className="relative bg-white dark:bg-black">
        <div className="space-y-24 pb-24">
          <div id="project-one">
            <ProjectSection
              title="WashLoft"
              description="A modern laundry management system that helps users track their laundry status and receive notifications when their clothes are ready."
              isWashLoft={true}
            />
          </div>
          <div id="project-two">
            <ProjectSection
              title="Project Two"
              description={loremIpsum}
              imageUrl="/project2.svg"
              isReversed
            />
          </div>
          <div id="project-three">
            <ProjectSection
              title="Project Three"
              description={loremIpsum}
              imageUrl="/project3.svg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
