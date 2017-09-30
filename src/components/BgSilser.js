import React, {
	Component
} from 'react';
import './BgSilser.css';
import './swiper.min.css';
import s1 from '../img/s1.png';
import s2 from '../img/s2.png';
import s3 from '../img/s3.png';

var Swiper = window.Swiper;

class BgSilser extends Component {
	render() {
		return (
			<div className="swiper-container">
		        <div className="parallax-bg" data-swiper-parallax="-23%"></div>
		        <div className="swiper-wrapper">
		            <div className="swiper-slide">
		                <div className="title" data-swiper-parallax="0">
		                	<img src={s1} alt="" />
		                </div>
		                <div className="subtitle" data-swiper-parallax="-200">业务系统移动化</div>
		                <div className="text" data-swiper-parallax="-400">
		                    <p>为企业提供安全、可控、可扩展的</p>
		                    <p>HTML5应用容器，有效保证企业网络和数据安全</p>
		                </div>
		            </div>
		            <div className="swiper-slide">
		                <div className="title" data-swiper-parallax="0">
		                	<img src={s2} alt="" />
		                </div>
		                <div className="subtitle" data-swiper-parallax="-200">网站移动化</div>
		                <div className="text" data-swiper-parallax="-400">
		                    <p>帮助企业快速、安全、高效地</p>
		                    <p>将现有PC版网页应用适配成HTML5移动应用</p>
		                </div>
		            </div>
		            <div className="swiper-slide">
		                <div className="title" data-swiper-parallax="0">
		                	<img src={s3} alt="" />
		                </div>
		                <div className="subtitle" data-swiper-parallax="-200">Amaze UI 前端开发框架</div>
		                <div className="text" data-swiper-parallax="-400">
		                    <p>国产最流行的开源HTML5前端框架</p>
		                    <p>组件丰富、社区庞大，为HTML5开发加速</p>
		                </div>
		            </div>
		        </div>
		        <div className="swiper-pagination swiper-pagination-white"></div>
		        <div className="swiper-button-prev swiper-button-white"></div>
		        <div className="swiper-button-next swiper-button-white"></div>
		    </div>
		);
	}
	componentDidMount() {
		new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			parallax: true,
			speed: 800,
			autoplay: 1800
		});
	}
}

export default BgSilser;