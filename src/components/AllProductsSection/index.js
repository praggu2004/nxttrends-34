import React, {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const categoryOptions = [
  {name: 'Clothing', categoryId: '1'},
  {name: 'Electronics', categoryId: '2'},
  {name: 'Appliances', categoryId: '3'},
  {name: 'Grocery', categoryId: '4'},
  {name: 'Toys', categoryId: '5'},
]
const views = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}
const sortbyOptions = [
  {optionId: 'PRICE_HIGH', displayText: 'Price (High-Low)'},
  {optionId: 'PRICE_LOW', displayText: 'Price (Low-High)'},
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    view: views.initial,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({view: views.loading})
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeOptionId,
      searchInput,
      activeCategoryId,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        view: views.success,
      })
      console.log(updatedData.length)
    } else {
      this.setState({view: views.failure})
      // Handle error response
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  searchInputChange = inputValue => {
    this.setState({searchInput: inputValue}, this.getProducts)
  }

  activeCategory = catId => {
    this.setState({activeCategoryId: catId}, this.getProducts)
  }

  activeRating = ratId => {
    this.setState({activeRatingId: ratId}, this.getProducts)
  }

  onClickClearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeOptionId: sortbyOptions[0].optionId,
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {view} = this.state
    switch (view) {
      case views.success:
        return this.successView()
      case views.failure:
        return this.failureView()
      case views.loading:
        return this.loadingView()
      default:
        return null
    }
  }

  successView = () => {
    const {productsList, activeOptionId, searchInput} = this.state
    let renderProducts=true;
    if(productsList.length===0){
        renderProducts=false
    }
    return (
      <div>        
      {renderProducts?<div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
          searchInputChange={this.searchInputChange}
          searchInput={searchInput}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>:<div>
            <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png" alt="no products"/>
            <h1>No Products found</h1>
            <p>we couldn't find any products</p>
      </div>}
     </div> 
    )
  }

  failureView = () => {
    return (
      <div>
        <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png" alt="products failure" />
        <h1>Oops!! something went wrong</h1>
        <p>we are having trouble in loading products</p>
      </div>
    )
  }

  loadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          ratingList={ratingsList}
          categoryOptions={categoryOptions}
          activeCategory={this.activeCategory}
          activeRating={this.activeRating}
          onClickClearFilters={this.onClickClearFilters}
        />
        {this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
