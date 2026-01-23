import Bar from '@/components/Bar/Bar';
import Nav from '@/components/Nav/Nav';
import Sidebar from '@/components/Sidebar/Sidebar';
import React from 'react';
import styles from './main/page.module.css';

type MusicLayout = {
  children: React.ReactNode;
};

export default function mainLayout({ children }: MusicLayout) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Nav />
          {children}
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
