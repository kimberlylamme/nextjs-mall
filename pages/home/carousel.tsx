import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import { Banner } from '../../interfaces/banner'

const Carousel = ({ ads = [] }: { ads: Banner[] }) => {
  return (
    <>
      {ads?.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
        >
          {ads.map((ad: any) => {
            return (
              <SwiperSlide key={ad.id}>
                <div className="h-40 w-full">
                  <Image src={ad.image} alt={ad.title} layout="fill" />
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </>
  )
}
export default Carousel
