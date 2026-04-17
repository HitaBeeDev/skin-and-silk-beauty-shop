import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

function Footer(): JSX.Element {
  return (
    <footer id="contact">
      <div>
        <p>Skin & Silk</p>
        <p>Luxury beauty, skincare, and wellness essentials.</p>
      </div>

      <div>
        <Link to={ROUTES.HOME}>Home</Link>
        <Link to={ROUTES.PRODUCTS}>Products</Link>
        <Link to={ROUTES.CART}>Cart</Link>
      </div>

      <p>Contact: concierge@skinandsilk.com</p>
    </footer>
  );
}

export default Footer;
