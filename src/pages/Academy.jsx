import ComingSoon from '../components/ComingSoon';
import { getEngineById } from '../data/engines';

export default function Academy() {
  const engine = getEngineById(2);
  return <ComingSoon engine={engine} />;
}
