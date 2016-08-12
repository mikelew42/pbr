;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

console.log('start log.js');
// there is a View module in the view folder... trying something else here
View2 = mod2.clone({
	type: "View2",
	init: function(){
		this.prop('$el');
		this.props.$el.getter = function(){
			if (!this.value)
				return this.mod.render();
			else
				return this.value;
		};
	},
	render: function(){
		return $("<div>").html('DefaultView2');
	},
	appendTo: function($el){
		this.$el.appendTo($el);
		return this;
	}
});

logger = sfn(function(){
	this.log.apply(this, arguments);
}, {
	type: "logger",
	props: {
		activeLogger: 'dnc'
	},
	logs: [],
	// log values
	log: function(){
		var log = LogValues.clone({
			bt: this.getBacktrace()
		});
		for (var i = 0; i < arguments.length; i++){
			log.addValue(arguments[i]);
		}
		this.activeLogger.add(log);
		return log;
	},
	add: function(log){
		this.logs.push(log);
	},
	getBacktrace: function(){
		var stack =
			((new Error).stack + '\n');

			// console.log(stack);

			stack = stack
				.replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
				.replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
				.replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
				.replace(/^(.+) \((.+)\)$/gm, '$1```$2')
				.split('\n')
				.slice(1, -1);

		var backtrace = [];

		for (var i in stack){
			stack[i] = stack[i].split('```');
			var bt = {
				func: stack[i][0],
				fullPathAndLine: stack[i][1],
				// full: stack
			};

			var pathBreakdown = stack[i][1].split(':');
			bt.file = pathBreakdown[1].replace(/^.*[\\\/]/, '');
			bt.line = pathBreakdown[2];
			bt.linePos = pathBreakdown[3];

			backtrace.push(bt);
		}

		return backtrace; //.slice(3);
	},
	view: function(){
		return LogView.clone({
			logger: this,
			props: {
				logger: 'dnc'
			}
		});
	}
});

mod2.copyTo(logger);


LogView = View2.clone({
	type: "LogView",
	render: function(){
		this.$el = $("<div>").addClass('logger').html('logger');
		this.renderLogs();
		return this.$el;
	},
	renderLogs: function(){
		var logs = this.logger.logs, log;
		this.$logs = $("<div>").addClass('logs').appendTo(this.$el);
		for (var i = 0; i < logs.length; i++){
			log = logs[i];
			log.view().appendTo(this.$logs);
		}
	}
});


LogValues = mod2.clone({
	type: "LogValues",
	values: [],
	addValue: function(value){
		if (is.str(value))
			logValue = LogStr.clone();
		else if (is.num(value))
			logValue = LogNum.clone();
		else if (is.bool(value))
			logValue = LogBool.clone();
		else if (is.fn(value))
			logValue = LogFn.clone();
		else if (is.arr(value))
			logValue = LogArr.clone();
		else if (is.obj(value))
			logValue = LogObj.clone();

		logValue.view.logValue = logValue;

		logValue.setValue(value);
		this.values.push(logValue);
	},
	view: function(){
		return LogValuesView.clone({
			logValues: this
		});
	}
});

LogValuesView = View2.clone({
	type: "LogValuesView",
	props: {
		logValues: 'dnc'
	},
	render: function(){
		var self = this;
		this.$el = $("<div>").addClass('log-values');
		this.$bt = $("<pre>").addClass('backtrace').html(this.logValues.bt[4].file + ":" + this.logValues.bt[4].line).appendTo(this.$el);

		this.$values = $("<div>").addClass('values').appendTo(this.$el);
		this.logValues.values.forEach(function(v){
			v.view().appendTo(self.$values);
		});
		return this.$el;
	}
});


LogValueView = View2.clone({
	props: {
		logValue: "dnc"
	},
	type: "LogValueView",
	render: function(){
		return $("<div>").html(this.logValue.value);
	}
});

LogValueViewSfn = sfn();
LogValueViewSfn.main = LogValueViewSfn.clone;
LogValueView.copyTo(LogValueViewSfn);
LogValueViewSfn.type = "LogValueViewSfn";


LogValue = mod2.clone({
	type: "LogValue",
	setValue: function(value){
		this.value = value;
	},
	// view: LogValueViewSfn.clone()
	view: function(){
		return LogValueView.clone({
			logValue: this
		});
	}
});

// LogValue.view.logValue = LogValue;

LogStr = LogValue.clone({
	type: "LogStr"
});
LogNum = LogValue.clone({ type: "LogNum" });
LogBool = LogValue.clone({ type: "LogBool" });

console.log('yo');

log = logger.clone({ type: "rootLogger" });
log.activeLogger = log;

console.log('end of log.js');

})();