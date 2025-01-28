import iconSet from './selection.json';
import IcoMoon from '../Icomoon/index';

type IconProps = {
  color?: string;
  size?: string | number;
  icon: string;
  className?: string;
  onClick?: () => void;
  startId?: string;
};

const Icon = (props: IconProps) => (
  <>
    <IcoMoon
      start-id={props.startId}
      className={props.className}
      iconSet={iconSet}
      color={props.color}
      size={props.size}
      icon={props.icon}
      onClick={props.onClick}
    />
  </>
);

export default Icon;