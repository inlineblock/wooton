define(function () {

	var Component = Backbone.View.extend({
		defaults: {},

		constructor: function Component () {
			Backbone.View.apply(this, arguments);

			this.el.setAttribute('data-xe-component-cid', this.cid);
		}

	}, {
		kPinning: {
			start: 0,
			middle: 1,
			end: 2
		},

		kEdge: {
			// clockwise, like in CSS
			top: 0,
			right: 1,
			bottom: 2,
			left: 3
		},

		kRegistration: {
			// Values correspond to the positions of the number
			// keys on a standard keyboard numpad.
			//
			// [7] [8] [9]
			// [4] [5] [6]  <-- Perfectly drawn ASCII numpad
			// [1] [2] [3]
			// 
			// To calculate the row:
			//
			//     row = ((val - 1) / 3) | 0;
			//
			//     0 == bottom
			//     1 == middle
			//     2 == top
			//
			// To calculate the column:
			//
			//     col = val % 3;
			//
			//     0 == right
			//     1 == left
			//     2 == middle
			//
			// Yay math!

			bottomLeft: 1,
			bottomMiddle: 2,
			bottomRight: 3,
			leftMiddle: 4,
			center: 5,
			rightMiddle: 6,
			topLeft: 7,
			topMiddle: 8,
			topRight: 9
		}
	});

	return Component;
});

