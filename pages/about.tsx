import { NextPage } from 'next';
import Navbar from '../components/Navbar';

const About: NextPage<{ userAgent?: string }> = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-xl m-5 mx-auto flex mx-auto flex-col">
        <h2 className="text-center m-5 text-lg">Why another ranking site?</h2>
        <p className="m-2">
          The idea behind RelativeRank is to solve the problem of most people
          rating the majority of shows in the 6-8 and distribute rankings evenly
          from 1-10.
        </p>
        <p className="m-2">
          The ranking system also aims to force shows to only be ranked relative
          to an individuals frame of reference to other shows they have seen.
          This is done by forcing people to maintain a sequencial list of all
          shows they have seen, with no ties allowed.
        </p>
        <p className="m-2">
          Each show in the ranked list is then assigned a rank in between 0 and
          1 representing it&apos;s position in the users list. It is this final
          relative ranking that is used to calculate the global average, with
          shows ranking closer to 1 being the best and shows ranking closer to 0
          being worse.
        </p>
      </main>
    </>
  );
};

export default About;
