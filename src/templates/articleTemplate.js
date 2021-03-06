import React from "react";
import cx from "classnames";
import moment from "moment";
import 'moment/locale/fr'
import {graphql, Link} from "gatsby"
import PageLayout from "../layouts/pageLayout"
import SectionLayout from "../layouts/sectionLayout"
import styles from "./templates.module.scss";
import NavigationPath from "../components/navigationPath/navigationPath";
import {MEDIA_CATEGORIES} from "../helpers/const";
import {Helmet} from "react-helmet";
import CommentSection from "../components/commentSection/commentSection";
import {isInViewport} from "../helpers/viewportHelper";

class ArticleTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapse: false,
            areCommentsInViewPort: false,
            otherNewsClass: '',
            otherNewsMarginBottom: 0
        }

        this.commentsRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.resize();
        this.setState({
            areCommentsInViewPort: isInViewport(this.commentsRef),
            otherNewsMarginBottom: this.state.collapse ? this.commentsRef.current.clientHeight + 30 : 0
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const isInViewPort = isInViewport(this.commentsRef);
        if (isInViewPort !== this.state.areCommentsInViewPort && this.state.collapse) {
            this.setState({areCommentsInViewPort: isInViewPort});
            if (isInViewPort) {
                this.setState({
                    otherNewsClass: styles.fixed,
                    otherNewsMarginBottom: 0
                });
            } else {
                this.setState({
                    otherNewsClass: '',
                    otherNewsMarginBottom: this.commentsRef.current.clientHeight + 30
                });
            }
        }
    }

    resize() {
        let collapse = (window.innerWidth >= 700);
        if (collapse !== this.state.collapse) {
            this.setState({collapse: collapse});

            if (!collapse) {
                this.setState({
                    otherNewsMarginBottom: 0,
                    otherNewsClass: ''
                });
            }
        }
    }

    renderHeaderNewsImage() {
        const {currentNewsPost} = this.props.data; // data.markdownRemark holds our post data
        const {frontmatter} = currentNewsPost;
        let image;
        image = frontmatter.image ? frontmatter.image : MEDIA_CATEGORIES[frontmatter.category].image;
        return <img className={styles.backgroundImage} src={image}
                    alt={frontmatter.title} height="100%"
                    width="100%"/>
    }

    renderBodyNewsImage() {
        const {currentNewsPost} = this.props.data; // data.markdownRemark holds our post data
        const {frontmatter} = currentNewsPost;
        if (frontmatter.image) {
            return <img className={styles.backgroundImage} src={frontmatter.image}
                        alt={frontmatter.title} height="100%"
                        width="100%"/>
        }
        return null;
    }

    renderOtherNewsPanel() {
        const {otherNews} = this.props.data; // data.markdownRemark holds our post data
        const {edges} = otherNews;
        return <div className={cx(styles.otherNews, this.state.otherNewsClass)}
                    style={{marginBottom: this.state.otherNewsMarginBottom}}>
            <div className={styles.otherNewsTitle}>
                <strong>Un dernier billet</strong>
                <br/>
                pour la route ?
            </div>
            <div className={styles.otherNewsList}>
                {edges.map(({node}, i) => {
                        const linkClassName = cx(styles.item, styles[node.frontmatter.category]);
                        const categoryClassName = cx(styles.category, styles[node.frontmatter.category]);
                        return <div key={i} className={styles.itemContainer}>
                            <Link className={linkClassName}
                                  to={`/posts/${node.fileAbsolutePath.substring(node.fileAbsolutePath.lastIndexOf('/') + 1).slice(0, -3)}`}>
                                <div className={styles.content}>
                                    <div className={categoryClassName}>
                                        <div
                                            className={styles.icon}>{MEDIA_CATEGORIES[node.frontmatter.category].icon}</div>
                                        <div>{MEDIA_CATEGORIES[node.frontmatter.category].name}</div>
                                    </div>
                                    <div className={styles.title}>{node.frontmatter.title}</div>
                                    <div className={styles.readMore}>
                                        <span/>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    }
                )}
            </div>
        </div>
    }

    render() {
        const {currentNewsPost, comments, avatars} = this.props.data; // data.markdownRemark holds our post data
        const {frontmatter, html, fileAbsolutePath} = currentNewsPost;
        const articlePath = fileAbsolutePath.substring(fileAbsolutePath.lastIndexOf('/') + 1).slice(0, -3);
        moment.locale('fr');
        const postClassNames = cx(styles.newsPost, styles[frontmatter.category]);
        const headerClassNames = cx(styles.newsHeader, styles.postHeader, styles[frontmatter.category]);
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
                path: `/posts/${articlePath}`
            }
        ];

        return (
            <PageLayout>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>{frontmatter.title}</title>
                </Helmet>
                <div className={headerClassNames}>
                    <div className={styles.newsSectionTitle}>
                        <span>{frontmatter.title}</span>
                    </div>
                    {this.renderHeaderNewsImage()}
                </div>
                <SectionLayout withBorders noPaddingTop>
                    <div className={styles.newsWrapper}>
                        <NavigationPath navigationItems={navigationItems}/>
                        <div className={styles.newsPostContainer}>
                            <div className={postClassNames}>
                                <div className={styles.newsInfosContainer}>
                                    <div className={styles.newsInfos}>
                                        <div className={styles.dateContainer}>
                                            <div className={styles.category}>
                                                <Link to={MEDIA_CATEGORIES[frontmatter.category].path}>
                                                    <span
                                                        className={styles.icon}>{MEDIA_CATEGORIES[frontmatter.category].icon}</span>
                                                    <span
                                                        className={styles.text}>{MEDIA_CATEGORIES[frontmatter.category].name}</span>
                                                </Link>
                                            </div>
                                            <div className={styles.date}>{moment(frontmatter.date).format('LL')}</div>
                                        </div>
                                        <div className={styles.imgContainer}>
                                            {this.renderBodyNewsImage()}
                                        </div>
                                    </div>
                                    {this.state.collapse ? this.renderOtherNewsPanel() : null}
                                </div>
                                <div>
                                    <div className={styles.newsContent}>
                                        <div className={styles.newsBody} dangerouslySetInnerHTML={{__html: html}}/>
                                    </div>
                                    <div ref={this.commentsRef}>
                                        {
                                            process.env.GATSBY_SHOW_COMMENTS === "show" &&
                                            <CommentSection pageSlug={articlePath}
                                                            comments={comments.edges}
                                                            avatars={avatars.edges}
                                                            category={frontmatter.category}/>
                                        }
                                    </div>
                                </div>
                            </div>

                            {!this.state.collapse ? this.renderOtherNewsPanel() : null}
                        </div>
                    </div>
                </SectionLayout>
            </PageLayout>
        )
    }
}

export default ArticleTemplate;

// noinspection JSUnusedGlobalSymbols
export const pageQuery = graphql`
  query($id: String!, $slug: String!, $category: String!) {
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
      comments: allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, filter: {frontmatter: {slug: {eq: $slug}}}) {
        edges {
            node {
                html
                frontmatter {
                    date,
                    name,
                    _id,
                    avatar {
                      childImageSharp {
                        fixed(width: 60, height: 60) {
                          ...GatsbyImageSharpFixed
                        }
                      }
                    }
                }
            }
        }
      }
      avatars: allFile(filter: {extension: {regex: "/(jpg)|(jpeg)|(png)/"}, sourceInstanceName: { eq: $category }}) {
        edges {
            node {
                id,
                relativePath    
            }
        }
      }
  }
`;