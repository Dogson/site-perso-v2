import React from "react"
import styles from "./footer.module.scss"
import {Link} from "gatsby"
import logo from "../../../static/assets/logo/CFS.png"
import {SocialIcon} from 'react-social-icons';

const Footer = () => (
    <div className={styles.footerContainer}>
        <div className={styles.firstCol}>
            <div className={styles.logoContainer}>
                <Link className={styles.logoWrapper} to='/'>
                <span className={styles.imageContainer}>
                    <img src={logo} alt="Logo" width={80}/>
                </span>
                    <div className={styles.logoName}>
                        <span className={styles.light}>Campus</span>
                        <span>Franco-</span>
                        <span>Sénégalais</span>
                    </div>
                </Link>
            </div>
            <div className={styles.copyright}>© Campus Franco-Sénégalais, 2019</div>
        </div>

        <div className={styles.menusContainer}>
            <div className={styles.menusWrapper}>
                <div className={styles.menuContainer}>
                    <div className={styles.title}>Nous suivre</div>
                    <div className={styles.item}>
                        <a href="https://twitter.com" target="_blank">Twitter</a>
                    </div>
                    <div className={styles.item}>
                        <a href="https://facebook.com" target="_blank">Facebook</a>
                    </div>
                </div>

                <div className={styles.menuContainer}>
                    <div className={styles.title}>Sites annexes</div>
                    <div className={styles.item}>
                        <a href="https://TODO.com" target="_blank">Plateforme de la coopération
                            universitaire</a>
                    </div>
                    <div className={styles.item}>
                        <a href="https://TODO.com" target="_blank">Plateforme d'offre d'emploi</a>
                    </div>
                </div>

                <div className={styles.menuContainer}>
                    <div className={styles.title}>Aide</div>
                    <div className={styles.item}>
                        <Link to={'/plan-du-site/'}>Plan du site</Link>
                    </div>

                </div>
            </div>
        </div>
    </div>
);

export default Footer