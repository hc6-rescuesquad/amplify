/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function loadWidget(waifuPath, apiPath) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	$("body").append(`<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="180" height="180"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);
	$("#waifu").show().animate({ bottom: 0 }, 3000);

	function registerEventListener() {
		$("#waifu-tool .fa-comment").click(showHitokoto);
		$("#waifu-tool .fa-paper-plane").click(() => {
			if (window.Asteroids) {
				if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
				window.ASTEROIDSPLAYERS.push(new Asteroids());
			} else {
				$.ajax({
					url: "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js",
					dataType: "script",
					cache: true
				});
			}
		});
		$("#waifu-tool .fa-user-circle").click(loadOtherModel);
		$("#waifu-tool .fa-street-view").click(loadRandModel);
		$("#waifu-tool .fa-camera-retro").click(() => {
			showMessage("Is it cute?", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		$("#waifu-tool .fa-info-circle").click(() => {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});
		$("#waifu-tool .fa-times").click(() => {
			localStorage.setItem("waifu-display", new Date().getTime());
			showMessage("You'll meet that special someone someday.", 2000, 11);
			$("#waifu").animate({ bottom: -500 }, 3000, () => {
				$("#waifu").hide();
				$("#waifu-toggle").show().animate({ "margin-left": -50 }, 1000);
			});
		});
		var re = /x/;
		console.log(re);
		re.toString = () => {
			showMessage("You opened the console. Wanna see a secret??", 6000, 9);
			return "";
		};
		$(document).on("copy", () => {
			showMessage("What did you copy?", 6000, 9);
		});
		$(document).on("visibilitychange", () => {
			if (!document.hidden) showMessage("Wow, you are finally back~", 6000, 9);
		});
	}
	registerEventListener();

	function welcomeMessage() {
		var SiteIndexUrl = location.port ? `${location.protocol}//${location.hostname}:${location.port}/` : `${location.protocol}//${location.hostname}/`, text; //自动获取主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now > 5 && now <= 7) text = "Good morning! The good day is about to begin.";
			else if (now > 7 && now <= 11) text = "Good morning! Work well, don't sit for a long time, walk around and move around!";
			else if (now > 11 && now <= 14) text = "Noon, work for one morning, now is lunch time!";
			else if (now > 14 && now <= 17) text = "It's easy to get bored in the afternoon, are today's goal done?";
			else if (now > 17 && now <= 19) text = "It’s late! The scenery of the sunset outside the window is beautiful, the most beautiful sunset red~";
			else if (now > 19 && now <= 21) text = "Good evening, how are you doing today?";
			else if (now > 21 && now <= 23) text = "It’s been so late, rest early, good night~", "Love your eyes in the middle of the night!";
			else text = "You are a night owl? Don't sleep so late. Good night!";
		} else if (document.referrer !== "") {
			var referrer = document.createElement("a");
			referrer.href = document.referrer;
			var domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = `欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else if (domain == "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
			else if (domain == "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else text = `Hello！来自 <span style="color:#0099cc;">${referrer.hostname}</span> 的朋友`;
		} else {
			text = `欢迎阅读<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
		}
		showMessage(text, 7000, 8);
	}
	welcomeMessage();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
		hitokotoTimer = null,
		messageTimer = null,
		messageArray = ["好久不见，日子过得好快呢……", "大坏蛋！你都多久没碰人家了呀，嘤嘤嘤～", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"];
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("记得把小家加入Adblock白名单哦！");
	$(document).mousemove(() => {
		userAction = true;
	}).keydown(() => {
		userAction = true;
	});
	setInterval(() => {
		if (!userAction) {
			if (!hitokotoTimer) hitokotoTimer = setInterval(showHitokoto, 25000);
		} else {
			userAction = false;
			clearInterval(hitokotoTimer);
			hitokotoTimer = null;
		}
	}, 1000);

	function showHitokoto() {
		//增加 hitokoto.cn 的 API
		if (Math.random() < 0.6 && messageArray.length > 0) showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
		else $.getJSON("https://v1.hitokoto.cn", function(result) {
				var text = `这句一言来自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
			showMessage(result.hitokoto, 6000, 9);
			setTimeout(() => {
				showMessage(text, 4000, 9);
			}, 6000);
		});
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}

	function initModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			//首次访问加载 指定模型 的 指定材质
			var modelId = 1, //模型 ID
				modelTexturesId = 53; //材质 ID
		}
		loadModel(modelId, modelTexturesId);
		$.getJSON(waifuPath, function(result) {
			$.each(result.mouseover, function(index, tips) {
				$(document).on("mouseover", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.click, function(index, tips) {
				$(document).on("click", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.seasons, function(index, tips) {
				var now = new Date(),
					after = tips.date.split("-")[0],
					before = tips.date.split("-")[1] || after;
				if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{year}", now.getFullYear());
					//showMessage(text, 7000, true);
					messageArray.push(text);
				}
			});
		});
	}
	initModel();

	function loadModel(modelId, modelTexturesId) {
		localStorage.setItem("modelId", modelId);
		if (modelTexturesId === undefined) modelTexturesId = 0;
		localStorage.setItem("modelTexturesId", modelTexturesId);
		loadlive2d("live2d", `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`));
	}

	function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
			//可选 "rand"(随机), "switch"(顺序)
		$.ajax({
			cache: false,
			url: `${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`,
			dataType: "json",
			success: function(result) {
				if (result.textures["id"] == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
				else showMessage("我的新衣服好看嘛？", 4000, 10);
				loadModel(modelId, result.textures["id"]);
			}
		});
	}

	function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		$.ajax({
			cache: false,
			url: `${apiPath}/switch/?id=${modelId}`,
			dataType: "json",
			success: function(result) {
				loadModel(result.model["id"]);
				showMessage(result.model["message"], 4000, 10);
			}
		});
	}
}

function initWidget(waifuPath = "/waifu-tips.json", apiPath = "") {
	if (screen.width <= 768) return;
	$("body").append(`<div id="waifu-toggle" style="margin-left: -100px;">
			<span>看板娘</span>
		</div>`);
	$("#waifu-toggle").hover(() => {
		$("#waifu-toggle").animate({ "margin-left": -30 }, 500);
	}, () => {
		$("#waifu-toggle").animate({ "margin-left": -50 }, 500);
	}).click(() => {
		$("#waifu-toggle").animate({ "margin-left": -100 }, 1000, () => {
			$("#waifu-toggle").hide();
		});
		if ($("#waifu-toggle").attr("first-time")) {
			loadWidget(waifuPath, apiPath);
			$("#waifu-toggle").attr("first-time", false);
		} else {
			localStorage.removeItem("waifu-display");
			$("#waifu").show().animate({ bottom: 0 }, 3000);
		}
	});
	if (localStorage.getItem("waifu-display") && new Date().getTime() - localStorage.getItem("waifu-display") <= 86400000) {
		$("#waifu-toggle").attr("first-time", true).css({ "margin-left": -50 });
	} else {
		loadWidget(waifuPath, apiPath);
	}
}
