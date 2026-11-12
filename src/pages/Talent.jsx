import ComingSoon from '../components/ComingSoon';
import { getEngineById } from '../data/engines';

export default function Talent() {
  const engine = getEngineById(3);
  return <ComingSoon engine={engine} />;
}
