'use client';

import { authUser, getToken } from '@/sevices/auth/authApi';
import { setToken, setUser } from '@/store/features/authSlice';
import { useAppDispatch } from '@/store/store';
import { saveTokens, saveUser } from '@/utils/authTokens';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import styles from './SignIn.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      // Получение данных пользователя
      const userData = await authUser({ email, password });

      // Получение токенов
      const tokensResponse = await getToken({ email, password });

      // Сохранение в store
      dispatch(setUser(userData));
      dispatch(setToken(tokensResponse));

      // Сохранение в localStorage
      saveTokens(tokensResponse.access, tokensResponse.refresh);
      saveUser(userData);

      // Переход на главную
      router.push('/music/main');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image src="/img/logo_modal.png" alt="logo" width={140} height={21} />
        </div>
      </Link>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Почта"
        onChange={onChangeEmail}
      />
      <input
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={onChangePassword}
      />
      <div className={styles.errorContainer}>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className={styles.modal__btnEnter}
        disabled={loading}
      >
        Войти
      </button>
      <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </>
  );
}
