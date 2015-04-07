/** @jsx React.DOM */
(function() {

var instaCtn = document.querySelector('.js-insta-ctn');

var InstagramFeed = React.createClass({
	getInitialState: function() {
		return {images: []};
	},
	fetchData: function() {
		$.ajax({
    	url: this.props.source,
      type: "GET",
      dataType: "jsonp",
    }).done(function(response) {

			// Make data object
			var responseData = response.data.map(function(img){
//				console.log('img', img);

					return {
							id: img.id,
							url: img.link,
							src: img.images.standard_resolution.url,
							desc: img.caption ? img.caption.text : '',
							likes: img.likes.count,
							user: img.user.full_name,
							created: new Date(parseInt(img.caption.created_time) * 1000)
					};

			});

	 		this.setState({
				images: responseData
			});
    }.bind(this));
	},
	componentDidMount: function() {
		this.fetchData();
		setInterval(this.fetchData, this.props.polling);
	},
	render: function() {
		var instaImages = this.state.images.map(function(img) {
			//console.log('instaImages', img);
 				return <InstagramPost
									url={img.url}
									src={img.src}
									desc={img.desc}
									likes={img.likes}
									user={img.user}
							 />
		});

		return (
			<div>
				{instaImages}
			</div>
		)
	},
	componentDidUpdate: function() {
		//console.log('running masonry');
		console.log('instraCtn',instaCtn);
		var masonryCtn = new Masonry( instaCtn.querySelector('div'), {
			//transitionDuration: 0.4
		});
	}
});

var InstagramPost = React.createClass({
	getInitialState: function() {
		return {};
	},
	render: function() {
		return (
			<a key={this.props.id} href={this.props.url} className="m-insta js-insta" target="_blank">
				<div className="insta-img-ctn">
					<img src={this.props.src} alt="" className="insta-img" />
					<span className="insta-likes">{this.props.likes}</span>
				</div>
				<div className="insta-content">
					<p className="insta-text">{this.props.desc}</p>
					<p className="insta-user">{this.props.user}</p>
				</div>
			</a>
		)
	}
});

React.renderComponent(
	<InstagramFeed source="https://api.instagram.com/v1/tags/melaniemus/media/recent?access_token=206227214.3f45faf.3f30a5f9f8fb4818a376b168db5d720e" polling="10000" />,
	instaCtn
);

})();
