import React from "react";
import CategoryCard from "./CategoryCard";
import CategoryInfos from "./CategoryFullInfos";
import classes from "./Category.module.css"; // CSS module import

function Category() {
  return (
    <section className={classes.grid}>
      {CategoryInfos.map(({ title, image,category }) => (
        <CategoryCard title={title} image={image} category={category} key={title} />
      ))}
    </section>
  );
}

export default Category;
