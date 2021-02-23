import React, { Component } from "react";
import { connect } from "react-redux";
import util from "../util";
import { addToCart } from "../actions/cartActions";
import { fetchProducts } from "../actions/productActions";
import ReactPaginate from 'react-paginate';
import axios from 'axios';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
        offset: 0,
        data: [],
        perPage: 10,
        currentPage: 0
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    // this.receivedData = this.receivedData.bind(this);

}
  componentDidMount() {
    this.props.fetchProducts();
    this.receivedData();
  }

  receivedData() {
    axios
        .get(`http://localhost:8000/products`)
        .then(res => {

            const data = res.data;
            data.slice(this.state.offset, this.state.offset + this.state.perPage)
            this.setState({
                pageCount: Math.ceil(data.length / this.state.perPage),
               
                // postData
            })
        });
}
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset
    }, () => {
      this.receivedData()
    });

  };
  render() {
    
    const productItems = this.props.products.map((product) => (
      <div className="col-md-4" key={product.id}>
        <div className="thumbnail text-center">
          <a
            href={`#${product.id}`}
            // onClick={(e) => this.props.addToCart(this.props.cartItems, product)}
          >
            <img src={`products/${product.sku}_2.jpg`} alt={product.title} />
            <p>{product.title}</p>
          </a>
          <b>{util.formatCurrency(product.price)}</b>
          <button
            className="btn btn-primary"
            onClick={(e) => this.props.addToCart(this.props.cartItems, product)}          >
            Add to cart
          </button>
        </div>
      </div>
    ));
    

    return( 
      <div>
      <div>
      <ReactPaginate
                   previousLabel={"prev"}
                   nextLabel={"next"}
                   breakLabel={"..."}
                   breakClassName={"break-me"}
                   pageCount={this.state.pageCount}
                   marginPagesDisplayed={2}
                   pageRangeDisplayed={5}
                   onPageChange={this.handlePageClick}
                   containerClassName={"pagination"}
                   subContainerClassName={"pages pagination"}
                   activeClassName={"active"}/>
      </div> 
    <div className="row">{productItems}</div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({
  products: state.products.filteredItems,
  cartItems: state.cart.items,
});
export default connect(mapStateToProps, { fetchProducts, addToCart })(Products);
