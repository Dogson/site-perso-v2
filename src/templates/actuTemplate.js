import React from "react"
import moment from "moment";
import 'moment/locale/fr'
import {graphql, Link} from "gatsby"
import PageLayout from "../layouts/pageLayout"
import SectionLayout from "../layouts/sectionLayout"
import styles from "./templates.module.scss";
import NavigationPath from "../components/navigationPath/navigationPath";
import {MEDIA_CATEGORIES} from "../helpers/const";

export default function ActuTemplate({
                                         data // this prop will be injected by the GraphQL query below.
                                     }) {
    const {currentNewsPost, otherNews} = data; // data.markdownRemark holds our post data
    const {frontmatter, html, fileAbsolutePath} = currentNewsPost;
    const {edges} = otherNews;
    moment.locale('fr');
    const navigationItems = [
        {
            title: "Accueil",
            path: '/'
        },
        {
            title: "Blog",
            path: '/blog/'
        },
        {
            title: MEDIA_CATEGORIES[frontmatter.category].name,
            path: MEDIA_CATEGORIES[frontmatter.category].path
        },
        {
            title: frontmatter.title,
            path: `posts/${fileAbsolutePath.substring(fileAbsolutePath.lastIndexOf('/') + 1).slice(0, -3)}`
        }
    ];

    function NewsImage() {
        let image;
        image = frontmatter.image ? frontmatter.image : '/assets/logo/GG.png';
        return <img className={styles.backgroundImage} src={image}
                    alt={frontmatter.title} height="100%"
                    width="100%"/>
    }

    function OtherNewsPanel() {
        return <div className={styles.otherNewsList}>
            {edges.map(({node, i}) =>
                <Link key={i} className={styles.item}
                      to={`posts/${node.fileAbsolutePath.substring(node.fileAbsolutePath.lastIndexOf('/') + 1).slice(0, -3)}`}>
                    <div className={styles.content}>
                        <div
                            className={styles.date}>{moment(node.frontmatter.date).format('DD/MM/YYYY')}</div>
                        <div className={styles.title}>{node.frontmatter.title}</div>
                        <div className={styles.readMore}>
                            <span/>
                        </div>
                    </div>
                </Link>
            )}
        </div>
    }

    return (
        <PageLayout>
            <div className={styles.newsHeader}>
                <div className={styles.newsSectionTitle}>
                    <span>{frontmatter.title}</span>
                </div>
                <NewsImage/>
            </div>
            <SectionLayout withBorders noPaddingTop>
                <div className={styles.newsWrapper}>
                    <NavigationPath navigationItems={navigationItems}/>
                    <div className={styles.newsPostContainer}>
                        <div className={styles.newsInfos}>
                            <div className={styles.dateContainer}>
                                {moment(frontmatter.date).format('LL')}
                            </div>
                            <div className={styles.imgContainer}>
                                <NewsImage/>
                            </div>
                        </div>
                        <div className={styles.newsContent}>
                            <div className={styles.newsTitle}> {frontmatter.title} </div>
                            <div className={styles.newsBody} dangerouslySetInnerHTML={{__html: html}}/>
                        </div>
                        <div className={styles.otherNews}>
                            <div className={styles.otherNewsTitle}>
                                <strong>Billets</strong>
                                <br/>
                                récents
                            </div>
                            <OtherNewsPanel/>
                        </div>
                    </div>
                </div>
            </SectionLayout>
        </PageLayout>
    )
}

// noinspection JSUnusedGlobalSymbols
export const pageQuery = graphql`
  query($id: String!) {
    currentNewsPost: markdownRemark(id: { eq: $id }) {
      fileAbsolutePath
      html
      frontmatter {
        date
        title
        image,
        category
      }
    }
    otherNews: allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, filter: {id: {ne: $id}, frontmatter: {type: {eq: "post"}}}, limit: 5) {
          edges {
            node {            
              fileAbsolutePath
              frontmatter {
                date
                title,
                category
              }
            }
          }
      }
  }
`;