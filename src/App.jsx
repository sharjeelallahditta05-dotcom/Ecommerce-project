import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, Trash2, Plus, Minus, ArrowRight, Star, ShieldCheck, Truck, Headphones, CheckCircle2 } from "lucide-react";
import products from "./data/products.js";

const money = (amount) => new Intl.NumberFormat("en-PK", {
  style: "currency", currency: "PKR", maximumFractionDigits: 0
}).format(amount);

function Navbar({ cartCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="top-note">Welcome to ShopEase — simple shopping, made easy</div>
      <div className="nav-wrap container">
        <Link className="brand" to="/" aria-label="ShopEase home"><span className="brand-mark"><ShoppingBag size={21}/></span>Shop<span>Ease</span></Link>
        <form className="search-box" onSubmit={submitSearch}>
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/>
          <button type="submit">Search</button>
        </form>
        <button className="icon-button mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMobileOpen(false)}>Products</NavLink>
          <NavLink className="cart-link" to="/cart" onClick={() => setMobileOpen(false)}><ShoppingBag size={18}/> Cart <span className="cart-count">{cartCount}</span></NavLink>
        </nav>
      </div>
    </header>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy"/>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-name">{product.name}</Link>
        <div className="rating"><Star size={14} fill="currentColor"/><span>{product.rating}</span><span className="rating-count">(customer rating)</span></div>
        <div className="product-bottom"><strong>{money(product.price)}</strong><button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><Plus size={17}/></button></div>
      </div>
    </article>
  );
}

function ProductGrid({ items, onAdd }) {
  if (!items.length) return <div className="empty-state"><ShoppingBag size={38}/><h3>No products found</h3><p>Try another search or choose a different category.</p><Link className="button button-primary" to="/products">View all products</Link></div>;
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd}/>)}</div>;
}

function Home({ onAdd }) {
  const featured = products.slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot"/> YOUR EVERYDAY ONLINE STORE</span>
            <h1>Find your next <span>favourite</span> thing.</h1>
            <p>Discover thoughtful picks for your lifestyle, from everyday essentials to tech and accessories — all in one place.</p>
            <div className="hero-actions"><Link to="/products" className="button button-primary">Explore products <ArrowRight size={18}/></Link><span className="hero-note">Easy. Convenient. ShopEase.</span></div>
            <div className="hero-stats"><div><strong>8+</strong><span>Demo products</span></div><div><strong>4</strong><span>Categories</span></div><div><strong>100%</strong><span>Student project</span></div></div>
          </div>
          <div className="hero-visual"><div className="hero-image-main"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85" alt="Fashion and lifestyle products"/></div><div className="floating-card"><span className="floating-icon"><ShoppingBag size={20}/></span><div><strong>Your next find</strong><span>Just a click away</span></div><CheckCircle2 className="floating-check" size={19}/></div><div className="hero-orb"/></div>
        </div>
      </section>
      <section className="benefits container">
        <div className="benefit"><span><Truck size={21}/></span><div><strong>Convenient shopping</strong><p>Browse from anywhere</p></div></div>
        <div className="benefit"><span><ShieldCheck size={21}/></span><div><strong>Simple checkout</strong><p>Easy demo order flow</p></div></div>
        <div className="benefit"><span><Headphones size={21}/></span><div><strong>Helpful experience</strong><p>Designed for customers</p></div></div>
      </section>
      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Featured products</h2><p>Some popular picks to get you started.</p></div><Link className="text-link" to="/products">View all products <ArrowRight size={17}/></Link></div>
        <ProductGrid items={featured} onAdd={onAdd}/>
      </section>
      <section className="promo-section container"><div><span className="eyebrow">A BETTER WAY TO SHOP</span><h2>Good finds.<br/>No fuss.</h2><p>Explore our demo collection and find something that suits your everyday needs.</p><Link to="/products" className="button button-light">Start exploring <ArrowRight size={18}/></Link></div><div className="promo-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85" alt="Modern retail store"/></div></section>
    </>
  );
}

function ProductsPage({ onAdd }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("search") || "");
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const update = () => setSearch(new URLSearchParams(window.location.search).get("search") || "");
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter((p) => (category === "All" || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") result = [...result].sort((a,b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a,b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a,b) => b.rating - a.rating);
    return result;
  }, [category, search, sort]);

  return <main className="container page-main"><div className="page-title"><div><span className="eyebrow">OUR COLLECTION</span><h1>All products</h1><p>Browse our demo collection and find your next favourite.</p></div><div className="results-count">{filtered.length} products</div></div>
    <div className="catalog-toolbar"><div className="category-filters">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`filter-chip ${category === item ? "active" : ""}`}>{item}</button>)}</div><label className="sort-select">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>
    {search && <p className="search-result-note">Search results for <strong>“{search}”</strong> <button onClick={() => {setSearch(""); window.history.replaceState({}, "", "/products");}}>Clear</button></p>}
    <ProductGrid items={filtered} onAdd={onAdd}/>
  </main>;
}

function ProductDetails({ onAdd }) {
  const navigate = useNavigate();
  const id = Number(window.location.pathname.split("/").pop());
  const product = products.find((p) => p.id === id);
  if (!product) return <main className="container page-main"><div className="empty-state"><h2>Product not found</h2><Link className="button button-primary" to="/products">Back to products</Link></div></main>;
  return <main className="container page-main"><button className="back-link" onClick={() => navigate(-1)}>← Back</button><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name}/></div><div className="detail-copy"><span className="product-category">{product.category}</span><h1>{product.name}</h1><div className="rating"><Star size={15} fill="currentColor"/>{product.rating}<span className="rating-count">Demo rating</span></div><strong className="detail-price">{money(product.price)}</strong><p>{product.description}</p><p className="stock-note"><CheckCircle2 size={17}/> Available in demo store</p><button className="button button-primary full-button" onClick={() => onAdd(product)}><ShoppingBag size={18}/> Add to cart</button><p className="small-note">This is a student demo store. No real payment is processed.</p></div></div></main>;
}

function Cart({ cart, onQuantity, onRemove }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  return <main className="container page-main"><div className="page-title"><div><span className="eyebrow">YOUR SELECTION</span><h1>Shopping cart</h1><p>Review your items before checkout.</p></div></div>
    {!cart.length ? <div className="empty-state"><span className="empty-icon"><ShoppingBag size={30}/></span><h2>Your cart is empty</h2><p>Looks like you haven't added anything yet.</p><Link to="/products" className="button button-primary">Browse products <ArrowRight size={18}/></Link></div> :
    <div className="cart-layout"><div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-details"><span className="product-category">{item.category}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong><div className="quantity-control"><button onClick={() => onQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.quantity}</span><button onClick={() => onQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14}/></button></div></div><button className="remove-button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={18}/></button></article>)}</div><aside className="order-summary"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="summary-line"><span>Delivery</span><span className="free-text">Free</span></div><div className="summary-line total-line"><strong>Total</strong><strong>{money(subtotal)}</strong></div><button className="button button-primary full-button" onClick={() => navigate("/checkout")}>Proceed to checkout <ArrowRight size={18}/></button><Link to="/products" className="continue-link">Continue shopping</Link><p className="small-note">Demo project only — no real payment is taken.</p></aside></div>}
  </main>;
}

function Checkout({ cart, onClear }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function placeOrder(event) { event.preventDefault(); setSubmitted(true); onClear(); }
  if (submitted) return <main className="container page-main"><div className="success-card"><span className="success-icon"><CheckCircle2 size={38}/></span><h1>Order confirmed!</h1><p>Thank you, {form.name}. Your demo order has been placed successfully.</p><p className="small-note">This confirmation is for your student project only. No payment or delivery has been arranged.</p><button className="button button-primary" onClick={() => navigate("/")}>Back to home <ArrowRight size={18}/></button></div></main>;
  if (!cart.length) return <main className="container page-main"><div className="empty-state"><h2>Your cart is empty</h2><p>Add some products before checking out.</p><Link to="/products" className="button button-primary">Browse products</Link></div></main>;
  return <main className="container page-main"><div className="page-title"><div><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1><p>Enter your details to place a demo order.</p></div></div><div className="checkout-layout"><form className="checkout-form" onSubmit={placeOrder}><h2>Customer details</h2><label>Full name<input name="name" value={form.name} onChange={update} required placeholder="Your full name"/></label><label>Email address<input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com"/></label><label>Phone number<input type="tel" name="phone" value={form.phone} onChange={update} required placeholder="03XX XXXXXXX"/></label><label>Delivery address<textarea name="address" value={form.address} onChange={update} required rows="3" placeholder="House, street, city"/></label><button className="button button-primary full-button" type="submit">Place demo order <ArrowRight size={18}/></button><p className="small-note">Demo only. Do not enter sensitive or real payment details.</p></form><aside className="order-summary"><h2>Your order</h2>{cart.map((item) => <div className="checkout-product" key={item.id}><img src={item.image} alt=""/><div><strong>{item.name}</strong><span>Qty: {item.quantity}</span></div><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="summary-line total-line"><strong>Total</strong><strong>{money(total)}</strong></div></aside></div></main>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-inner"><Link className="brand footer-brand" to="/"><span className="brand-mark"><ShoppingBag size={19}/></span>Shop<span>Ease</span></Link><p>A simple e-commerce website built with React.js for an academic project.</p><span className="copyright">© {new Date().getFullYear()} ShopEase · Demo store</span></div></footer>;
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shopease-cart") || "[]"); }
    catch { return []; }
  });
  const [toast, setToast] = useState("");
  useEffect(() => { localStorage.setItem("shopease-cart", JSON.stringify(cart)); }, [cart]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to cart`);
    window.setTimeout(() => setToast(""), 2300);
  }
  function quantityChange(id, change) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0));
  }
  function removeFromCart(id) { setCart((current) => current.filter((item) => item.id !== id)); }
  return <><Navbar cartCount={cartCount}/><Routes>
    <Route path="/" element={<Home onAdd={addToCart}/>}/>
    <Route path="/products" element={<ProductsPage onAdd={addToCart}/>}/>
    <Route path="/products/:id" element={<ProductDetails onAdd={addToCart}/>}/>
    <Route path="/cart" element={<Cart cart={cart} onQuantity={quantityChange} onRemove={removeFromCart}/>}/>
    <Route path="/checkout" element={<Checkout cart={cart} onClear={() => setCart([])}/>}/>
    <Route path="*" element={<main className="container page-main"><div className="empty-state"><h1>Page not found</h1><Link className="button button-primary" to="/">Go home</Link></div></main>}/>
  </Routes><Footer/>{toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}</>;
}