import styles from './DashBoard.module.scss';
import { useNavigate } from "react-router-dom";
export const DashBoard = () => {
  const navigate = useNavigate();
  return (

    <div className={styles.landing}>
    <h1 className={styles.mainHeading}>Quality Control Tools</h1>
    <div className={styles.dashBoard}>
      <div className={styles.card} onClick={() => navigate("/filetodb")}>
        <button className={styles.card__btn}  >File To DB</button>
        <span className={styles.text}>start now</span>
      </div>
      <div className={styles.card} onClick={() => navigate("/csvtocsv")}>
        <button className={styles.card__btn} >CSV to CSV</button>
        <span className={styles.text}>start now</span>

      </div>
      <div className={styles.card} onClick={() => navigate("/dbtodb")}>
        <button className={styles.card__btn} >DB to DB</button>
        <span className={styles.text}>start now</span>

      </div>
    </div>
    </div>
  );
};
