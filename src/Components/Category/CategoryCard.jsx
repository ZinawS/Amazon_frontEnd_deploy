import React from "react";
import classes from "./category.module.css";
import { Link } from "react-router-dom";

function CategoryCard({title,image,category}) {

  return (
    <div className={classes.category}>
      <Link to={`/category/${category}`} className={classes.category_link}>
        <span>
          <h2 className={classes.title}>{title}</h2>
        </span>
        <img src={image} alt={title} />
        <p className={classes.shop_now}>Shop now</p>
      </Link>
    </div>
  );
}

export default CategoryCard;
