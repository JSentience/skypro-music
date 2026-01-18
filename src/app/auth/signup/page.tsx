'use client';
import { getToken, registrationUser } from '@/sevices/auth/authApi';
import { setToken, setUser } from '@/store/features/authSlice';
import { useAppDispatch } from '@/store/store';
import { saveTokens, saveUser } from '@/utils/authTokens';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import styles from './SignUp.module.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !username || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      const signUpResponse = await registrationUser({
        email,
        password,
        username,
      });

      const tokensResponse = await getToken({ email, password });

      dispatch(setUser(signUpResponse.result));
      dispatch(setToken(tokensResponse));

      saveTokens(tokensResponse.access, tokensResponse.refresh);
      saveUser(signUpResponse.result);

      router.push('/music/main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image src="/img/logo_modal.png" alt="logo" width={240} height={21} />
        </div>
      </Link>
      <input
        onChange={onChangeEmail}
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Почта"
      />
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Логин"
        onChange={onChangeUsername}
      />
      <input
        onChange={onChangePassword}
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
      />
      <input
        onChange={onChangeConfirmPassword}
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Повторите пароль"
      />
      <div className={styles.errorContainer}>{error}</div>
      <button
        disabled={loading}
        onClick={handleSubmit}
        className={styles.modal__btnSignupEnt}
      >
        Зарегистрироваться
      </button>
    </>
  );
}
