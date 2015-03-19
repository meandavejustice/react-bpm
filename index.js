/*
 * USAGE:
 *
 *   <BPMTap onChange={func: called on bpm update}
 *           bpm={int: initial bpm(optional) Default 120}
 *           keyTrigger={string: key to trigger tick event (optional) Default '<space>'}
 *           width={int or string: canvas width(optional)}
 *           height={int or string: canvas height(optional)} />
 *
 * */

var React = require('react');
var BPM = require('bpm');
var vkey = require('vkey');
var b = new BPM();
var style = {border: "1px solid black", backgroundColor: "#2C2C2C"};

var BPMTap = React.createClass({
  getInitialState: function() {
    return {bpm: 120.89, resetCounter: 0};
  },
  componentDidMount: function() {
    document.body.addEventListener('keydown', this.onKeyDown);
    this.keyTrigger = this.props.keyTrigger || '<space>';

    if (this.props.bpm) this.setState({bpm: this.props.bpm});

    this.context = this.refs.canvas.getDOMNode().getContext('2d');
    this.context.font="350px Georgia";
    this.width = this.refs.canvas.getDOMNode().width;
    this.height = this.refs.canvas.getDOMNode().height;
    // Create gradient
    var gradient = this.context.createLinearGradient(0,0,this.width,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","orange");
    // Fill with gradient
    this.context.fillStyle = gradient;
    this.context.fillText(this.state.bpm, -20, this.height / 1.25);
  },
  onKeyDown: function(ev) {
    if (vkey[ev.keyCode].toLowerCase() === this.keyTrigger) {
      this.tick();
    }
  },
  tick: function() {
    if (this.state.resetCounter === 4) {
      b.reset();
      this.setState({resetCounter: 0});
    }
    this.setState({resetCounter: this.state.resetCounter + 1});

    this.context.clearRect(0, 0, this.width, this.height);
    var bpm = b.tap().avg;
    if (bpm === undefined) bpm = 120;
    this.setState({bpm: bpm.toFixed(2)});
    this.context.fillText(this.state.bpm, -20, this.height / 1.25);

    if (this.props.onChange) {
      this.props.onChange(this.state.bpm);
    }
  },
  render: function() {
    return (
        <div>
          <canvas ref="canvas" style={style}
                  height={this.props.height || "300px"} width={this.props.width || "500px"}
                  onClick={this.tick}></canvas>
        </div>
    )
  }
});

module.exports = BPMTap;
