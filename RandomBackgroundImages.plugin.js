//META{"name":"RandomBackgroundImages","website":"https://hackmd.io/kFDZRnfKT7ueu089o97nZA?view","source":"https://github.com/NawaNae/GetScreenSharingLink/blob/master/GetScreenShareLink.plugin.js"}*//
//原始範例 : https://github.com/Metalloriff/BetterDiscordPlugins/blob/master/VoiceChatNotifications.plugin.js
class RandomBackgroundImages {	
    constructor()
    {
        this.imageList=
        [
            'http://imgur.com/ljQVAD9.png',
            'http://imgur.com/KbfvL2h.png',
            'http://imgur.com/h9Bm0EF.png'
        ];
    }
    getName() { return "RandomBackgroundImages"; }
    getDescription() { return "Randomly select background image of body from imagelist"; }
    getVersion() { return "0.0.1"; }
	getAuthor() { return "NawaNawa"; }
	getChanges() {
		return {
            "0.0.1" : 
            `
               try to make it.
            `
        };
    }
    rnd()
    {
        return Math.floor(Math.random()*this.imageList.length);
    }
    load() {
        document.body.style.backgroundImage="url('"+this.imageList[this.rnd()]+"')";
    }
    start() {
        
    }

    stop() {
	}
}