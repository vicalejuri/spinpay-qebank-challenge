import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      Header
      <Link to="/">Go to home</Link>
      <Link to="/statement">Go to Statement</Link>
    </header>
  );
}
