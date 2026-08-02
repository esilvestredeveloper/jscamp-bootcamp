import { NavLink as RouterNavLink } from 'react-router'
import styles from './NavLink.module.css'

export function NavLink({ href, children, end = false, ...restOfProps }) {
  return (
    <RouterNavLink
      to={href}
      end={end}
      {...restOfProps}
      className={({ isActive }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link
      }
    >
      {children}
    </RouterNavLink>
  )
}
