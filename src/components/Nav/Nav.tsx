'use client';

import { useLogout } from '@/hooks/useLogout';
import { useAppSelector } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import styles from './Nav.module.css';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const handleOut = useLogout();
  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={'logo'}
        />
      </div>
      <div
        ref={burgerRef}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
        className={styles.nav__burger}
      >
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>

      <div
        ref={menuRef}
        className={`${styles.nav__menu} ${isMenuOpen ? styles.active : ''}`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/" className={styles.menu__link}>
              Главная
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href={'/music/favorite'} className={styles.menu__link}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            {isAuthenticated ? (
              <button
                onClick={handleOut}
                className={styles.menu__link}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Выйти
              </button>
            ) : (
              <Link href="/auth/signin" className={styles.menu__link}>
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
