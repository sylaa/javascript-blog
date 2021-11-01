"use strict";

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log("Link was clicked!");
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll(".titles a.active");

  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add("active");
  console.log("clickedElement:", clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(".posts .post.active");

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute("href");
  const articleSelector = document.querySelector(href);
  console.log(articleSelector);

  // /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(href);
  console.log(targetArticle);

  // /* ]DONE] add class 'active' to the correct article */
  targetArticle.classList.add("active");
  console.log(targetArticle);
}

const links = document.querySelectorAll(".titles a");

for (let link of links) {
  link.addEventListener("click", titleClickHandler);
}

const optArticleSelector = ".post";
const optTitleSelector = ".post-title";
const optTitleListSelector = ".titles";

function generateTitleLinks() {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = '';
  /* for each article */
  // const articles = document.querySelectorAll(optArticleSelector);

  // for (let article of articles) {
  //   article.addEventListener("click", titleClickHandler);
  // }
  /* get the article id */
  // const articleId = clickedElement.getAttribute("id");
  /* find the title element */

  /* get the title from the title element */

  /* create HTML of the link */

  /* insert link into titleList */
}

generateTitleLinks();
