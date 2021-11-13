const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

'use strict';


const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute('href');

  // /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(href);

  // /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log(targetArticle);
}

// const links = document.querySelectorAll(".titles a");
// console.log(links);

// for (let link of links) {
//   link.addEventListener("click", titleClickHandler);
// }

// const optArticleSelector = '.post';
// const optTitleSelector = '.post-title';
// const optTitleListSelector = '.titles';
// const optArticleTagsSelector = '.post-tags .list';
// const optArticleAuthorSelector = '.post-author';
// const optTagsListSelector = '.tags.list';
// const optCloudClassCount = 5;
// const optCloudClassPrefix = 'tag-size-';
// const optAuthorsListSelector = '.author.list';


function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  let html = '';
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */
    // const linkHTML = `<li><a href="#${ articleId }"><span>${ articleTitle }</span></a></li>`;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* insert link into titleList */
    html += linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = { max : 0, min : 999999 };

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }

    if (tags[tag] < params.min){
      params.min = tags[tag];
    }
    console.log(`${tag} 'is used' ${tags[tag]} 'times'`);
  }
  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1 );

  return opts.cloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);

    /* make html variable with empty string */
    let html = ' ';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      // const linkHTML = `<li><a href="#tag-${ tag }">${ tag }</a></li>`;
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log(linkHTML);


      /* add generated code to html variable */
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    // const tagLinkHTML = `<li><a class="${ calculateTagClass(allTags[tag], tagsParams) }" href="#tag-${ tag }">${ tag }</a></li>`;
    // console.log('taglinkHTML:', tagLinkHTML);
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  /* [NEW] END LOOP: for each tag in allTags */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let tagLink of tagLinks) {
  /* remove class active */
    tagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksHref = document.querySelectorAll(`a[href="${ href }"]`);
  /* START LOOP: for each found tag link */
  for(let tagLinkHref of tagLinksHref) {
  /* add class active */
    tagLinkHref.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-tags~="${ tag }"]`);
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
  /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
/* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    /* make html variable with empty string */
    let html = ' ';
    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    // const linkHTML = `<li><a href="#author-${ articleAuthor }">${ articleAuthor }</a></li>`;
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log(linkHTMLData);
    /* add generated code to html variable */
    html += linkHTML;
    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[articleAuthor]){
      /* [NEW] add author to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /* insert HTML of all the links into the authors wrapper */
    authorWrapper.innerHTML = html;
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector('.authors');
  console.log(authorList);


  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {authors: []};
  /* [NEW] START LOOP: for each author in allAuthors: */
  for(let author in allAuthors){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    // const authorLinkHTML = `<li><a href="#author-${ author }">${ author } (${allAuthors[author]})</a></li>`;
    // console.log('authorLinkHTML:', authorLinkHTML);
    // allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  /* [NEW] END LOOP: for each tag in allAuthors */
  }
  /* [NEW] add html from allAuthorsHTML to authorList */
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}


generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks) {
  /* remove class active */
    activeAuthorLink.classList.remove('active');
  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinksHref = document.querySelectorAll(`a[href="${ href }" ]`);
  /* START LOOP: for each found author link */
  for(let authorLinkHref of authorLinksHref){
  /* add class active */
    authorLinkHref.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-author="${ author }"]`);
}

function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for(let authorLink of authorLinks){
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();

