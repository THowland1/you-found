import styles from './iphone-x.module.scss';

interface Props {
  contents: JSX.Element;
}
export function IPhoneX({ contents }: Props) {
  return (
    <div
      className={styles['device-iphone-x']}
      style={{ transform: 'scale(0.7)' }}
    >
      <div className={styles['device-frame']}>
        <div className={styles['device-screen']}>
          <div className={styles['device-bar']}></div>
          <div className={styles['device-chrome']}>
            <div className={styles['device-address-bar']}></div>
          </div>
          <div className={styles['device-content']}>{contents}</div>
        </div>
      </div>
      <div className={styles['device-stripe']}></div>
      <div className={styles['device-header']}></div>
      <div className={styles['device-sensors']}></div>
      <div className={styles['device-btns']}></div>
      <div className={styles['device-power']}></div>
      <div className={styles['device-home']}></div>
    </div>
  );
}
