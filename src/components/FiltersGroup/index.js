import React from 'react'

const FiltersGroup = props => {
  const {
    ratingList,
    categoryOptions,
    activeCategory,
    activeRating,
    onClickClearFilters,
  } = props

  return (
    <div className="filters-group-container">
      <h1>Category</h1>
      <ul>
        {categoryOptions.map(eachOption => {
          const {name, categoryId} = eachOption
          const onClickOption = () => {
            activeCategory(categoryId)
          }
          return (
            <li key={categoryId} onClick={onClickOption}>
              <p>{name}</p>
            </li>
          )
        })}
      </ul>
      <ul>
        {ratingList.map(eachRating => {
          const {ratingId, imageUrl} = eachRating
          const onClickRating = () => {
            activeRating(ratingId)
          }
          return (
            <li key={ratingId} onClick={onClickRating}>
              <img src={imageUrl} alt={`rating ${ratingId}`} />
            </li>
          )
        })}
      </ul>
      <button type="button" onClick={onClickClearFilters}>Clear Filters</button>
    </div>
  )
}

export default FiltersGroup
