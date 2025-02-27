import ProjectSection from '@/components/ProjectSection';
import HeroSection from '@/components/HeroSection';
import ContactSection from '@/components/ContactSection';
import { getBasePath } from '@/utils/paths';

export default function Home() {
  const washLoftImages = [
    `${getBasePath()}/washloft/screenshot1.png?v=2`,
    `${getBasePath()}/washloft/screenshot2.png?v=2`,
    `${getBasePath()}/washloft/screenshot3.png?v=2`,
    `${getBasePath()}/washloft/screenshot4.png?v=2`
  ];

  const projectTwoImages = [
    `${getBasePath()}/capone/screenshot1.png`,
    `${getBasePath()}/capone/screenshot2.png`,
    `${getBasePath()}/capone/screenshot3.png`,
    `${getBasePath()}/capone/screenshot4.png`,
    `${getBasePath()}/capone/screenshot5.png`,
    `${getBasePath()}/capone/screenshot6.png`,
    `${getBasePath()}/capone/screenshot7.png`,
    `${getBasePath()}/capone/screenshot8.png`,
  ];

  const chewyImages = [
    `${getBasePath()}/chewy/screenshot1.png`,
    `${getBasePath()}/chewy/screenshot2.png`,
    `${getBasePath()}/chewy/screenshot3.png`,
    `${getBasePath()}/chewy/screenshot4.png`,
    `${getBasePath()}/chewy/screenshot5.png`,
  ];

  return (
    <main>
      <HeroSection />

      <section className="relative bg-black">
        <div className="space-y-24 pb-24">
          <div id="project-one">
            <ProjectSection
              title="WashLoft"
              description="Uber for laundry. An on demand, full-service laundry app that allows users to book pickup for their dirty laundry and schedule delivery of clean and folded clothes."
              extendedDescription={`
                Solo developer for the mobile app using **Swift**, **Firebase**, and **Stripe**
                Worked closely with designer to implement the **UI and UX**
                Serves **100s of orders per month** in the greater Boston area
                Developed **companion apps** for drivers and washers to streamline the laundry process
                Designed a **shared SPM package** to streamline the codebase and reduce redundancy
              `}
              images={washLoftImages}
              appStoreLink="https://apps.apple.com/us/app/washloft/id1290033575"
            />
          </div>
          <div id="project-two">
            <ProjectSection
              title="Capital One"
              description="A nationally recognized banking app that allows users to manage their finances and make payments."
              extendedDescription={`
                **Technical lead** for the Small Business Banking team
                Increased parity with web and consumer functionality by **over 70% in the first year**
                Implemented features that served **over 10k unique users** daily
                Increased code coverage to **over 90%** on all supported features
                Drove development via **several cross-functional teams**
              `}
              images={projectTwoImages}
              isReversed
              appStoreLink="https://apps.apple.com/us/app/capital-one-mobile/id407558537"
            />
          </div>
          <div id="project-three">
            <ProjectSection
              title="Chewy PracticeHub"
              description="A platform for veterinarians to manage their practice and patients as well as approve prescription requests from pet owners."
              extendedDescription={`
                **Lead Mobile Engineer** on the PracticeHub team
                **Built a team of iOS and Android engineers** to support the PracticeHub product
                Reduced customer service workload **by 99%** by implementing a **self-service portal** for veterinarians to approve prescription requests
                Designed the **core architecture** of the PracticeHub mobile app
                Delivered the app in **10 months** supporting **1000s of veterinarians**
              `}
              images={chewyImages}
            />
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
