import { YouFoundPageLink as YouFoundPageLinkModel } from 'models/api/you-found-page-link';
import React from 'react';
import YouFoundPageLink from './you-found-page-link';
import styles from './you-found-page.module.scss';

export interface Props {
  userFullName: string;
  message: string;
  itemName: string;
  links: YouFoundPageLinkModel[];
}

export type YouFoundPageProps = Props;

export default function YouFoundPage({
  userFullName,
  itemName,
  message,
  links,
}: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p>
          Hi, I'm <mark>{userFullName}</mark> and you have found my{' '}
          <mark>{itemName}</mark>
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.cta}>{message}</div>
        {links.map((link, index) => (
          <YouFoundPageLink key={index} link={link} />
        ))}
      </main>
    </div>
  );
}
