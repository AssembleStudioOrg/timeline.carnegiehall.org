import { GRID_GAP } from '$src/lib/consts';

interface Props {
  stats: any;
  width: number;
}

const ViewName = ({ stats, width }: Props) => {
  const views = [...stats.traditions].sort();

  const viewNames = views.map((view: any, i) => (
    <div className="flex justify-center" key={view}>
      <span
        className="text-white rounded-xl py-[2px] shadow-card text-sm w-[175px] text-center"
        style={{
          backgroundColor: stats.colors.get(view)
        }}
      >
        {view}
      </span>
    </div>
  ));

  return (
    <div
      className="fixed grid grid-cols-3 gap-20 bottom-10"
      style={{ width: width * 1.05 }}
    >
      {viewNames}
    </div>
  );
};

export default ViewName;
