//META{"name":"RandomBackgroundImages","website":"https://hackmd.io/tcY9eiXHTye_6PC1jaaMgg","source":"https://github.com/NawaNae/RandomBackground"}*//
//原始範例 : https://github.com/Metalloriff/BetterDiscordPlugins/blob/master/VoiceChatNotifications.plugin.js
class RandomBackgroundImages {	
    constructor()
    {

        this.imageList=this.storageData("imageList")||[
            {src:'http://imgur.com/ljQVAD9.png',"background-size":"cover"}
        ];
        this.carousel=this.storageData("carousel");
        this.index=0;
    }
    storageData(name)
    {
        return bdPluginStorage.get(this.getName(),name);
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
    info(str)
    {
        ZLibrary.Logger.info(this.getName(),str);
    }
    rnd()
    {
        return Math.floor(Math.random()*this.imageList.length);
    }
    getCssString(src)
    {
        return  "url('"+src+"')";
    }

    objectProcess()
    {
        let img=this.img;
        let settings=
        {
            backgroundSize:img.backgroundSize||img['background-size'],
            backgroundRepeat:img.backgroundRepeat||img['background-repeat'],
            backgroundColor:img.backgroundRepeat||img['background-color'],
            backgroundPosition:img.backgroundPosition||img['background-position'],
            backgroundAttachment:img.backgroundAttachment||img['background-attachment']
        };
        for(let key in settings)
        {
            this.info(key);
            if(settings[key])
                document.body.style[key]=settings[key];
        }
    }
    get imageUrl()
    {
        let img=this.img;
        switch (img.constructor.name)
        {
            case "String":
                return this.getCssString(img);
            break;   
            case "Object":
                let src=img.src||img.img||img.image;
                if(!src)
                    this.info("random src error, object not include src/img/image property");
                return this.getCssString(src);
                break;
            default:
            break;
        }
    }
    applyImage()
    {
        document.body.style.backgroundImage=this.imageUrl;
        if(this.img.constructor.name==="Object")
            this.objectProcess();
    }
    nextImage()
    {
        if(this.carousel.random)
            this.index=this.rnd();
        else
        {
            this.index++;
            this.index%=this.imageList.length;
        }
        this.applyImage();
    }
    get img()
    {
        return this.imageList[this.index];
    }
    get time()
    {
        let timeS="",timeUnit="m";
        const timeUnitDict=
        {
            "s":1000,
            "m":60000,
            "h":3600000
        }
        if(this.carousel&&this.carousel.changeEvery)
            timeS=this.carousel.changeEvery;
        if(isNaN(timeS))
        {
            timeUnit=timeS[timeS.length-1];
            timeS.slice(0,timeS.length-1);
        }
        return parseInt(timeS)*timeUnitDict[timeUnit];
    }
    main()
    {
        if(!this.carousel.enable||this.carousel.random)
        {
            this.index=this.rnd();
        }
        this.applyImage();
        if(this.carousel.enable)
        {
            this.info(this.time);
            this.timeId=window.setInterval(()=>this.nextImage(),this.time);
        }
    }
    load() 
    {
        this.main();
    }
    start() {
        if (!global.ZeresPluginLibrary)
        {
            let libraryScript = document.getElementById("ZLibraryScript");
            if (!libraryScript || !window.ZLibrary) {
                if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
                libraryScript = document.createElement("script");
                libraryScript.setAttribute("type", "text/javascript");
                libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
                libraryScript.setAttribute("id", "ZLibraryScript");
                document.head.appendChild(libraryScript);
            }
            if (window.ZLibrary) this.initialize();
            else libraryScript.addEventListener("load", () => { this.initialize(); });
        }
    }
    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "LINK_TO_RAW_CODE");
    }
    stop() {
        if(this.carousel.enable)
        {
            window.clearInterval(this.timeId);
        }
	}
}