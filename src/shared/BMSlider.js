import { A11y, Navigation, Pagination } from "swiper";
import { Swiper } from "swiper/react";
import "../../node_modules/swiper/swiper-bundle.css";

function BMSlider({ children, ...rest }) {
  return (
    <Swiper modules={[Navigation, Pagination, A11y]} {...rest}>
      {children}
    </Swiper>
  );
}

export default BMSlider;
