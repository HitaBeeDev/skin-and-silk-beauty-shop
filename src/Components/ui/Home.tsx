import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import grid from '@/assets/grid1.jpg';
import home from '@/assets/home4.jpg';

function Home(): JSX.Element {
  return (
    <div>
      <div>
        <img
          src={home}
          alt="home"
        />

        <div>
          <Link to={ROUTES.PRODUCTS}>
            <button>Start Shopping</button>
          </Link>

          <Link to={`${ROUTES.HOME}#contact`}>
            <button>Get in Touch</button>
          </Link>
        </div>
      </div>

      <div>
        <div>
          <div>
            <p>
              About
            </p>
            <p>
              Skin & Silk
            </p>
            <p>
              Where Luxury Meets Excellence
            </p>
          </div>

          <div>
            <p>
              <span>Skin & Silk</span> embodies luxury,
              offering an exclusive selection of high-end beauty, skincare, and
              wellness essentials. Partnering with the world’s most prestigious
              brands and visionary innovators, we curate an unparalleled
              collection of transformative products that exude sophistication,
              performance, and indulgence. With an uncompromising dedication to
              quality, every detail is meticulously crafted to redefine the art
              of self-care.
            </p>
          </div>
        </div>

        <div>
          <div>
            <img src={grid} alt="beauty collage" />

            <div>
              <p>
                Stay vibrant, stay{" "}
                <span>
                  Skin & Silk
                </span>
                .
              </p>

              <p>
                Elevate your beauty routine with products designed for
                effortless glow and everyday confidence.
              </p>
            </div>
          </div>

          <div
          >
            Join&nbsp;<span>+25K</span>&nbsp;happy users!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
