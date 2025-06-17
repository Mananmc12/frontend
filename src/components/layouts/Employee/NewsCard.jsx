import React from "react";
import "../../../assets/newsCard.css";

const NewsCard = ({ data }) => {
  const onGetTitle = (title) => {
    return title.split("-")[0];
  };

  const { article_url, title, image_url } = data;
  return (
    <div className="newsContainer">
      <h6 className="titleText">{onGetTitle(title)}</h6>

      <hr />

      <img src={image_url} alt="" className="newsImg" />

      <a
        href={article_url}
        target="_blank"
        style={{
          color: "#FF4500",
          textDecoration: "none",
        }}
      >
        <h6 className="mt-5 text-right">Link to full article</h6>
      </a>
    </div>
  );
};

export default NewsCard;
