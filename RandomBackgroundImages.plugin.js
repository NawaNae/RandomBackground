//META{"name":"RandomBackgroundImages","website":"https://hackmd.io/tcY9eiXHTye_6PC1jaaMgg","source":"https://github.com/NawaNae/RandomBackground"}*//
//原始範例 : https://github.com/Metalloriff/BetterDiscordPlugins/blob/master/VoiceChatNotifications.plugin.js
var RandomBackgroundImages= class RandomBackgroundImages {	
    constructor()
    {

        this.imageList=this.storageData("imageList")||[
            {src:'http://imgur.com/ljQVAD9.png',"background-size":"cover"}
        ];
        this.carousel=this.storageData("carousel");
        this.transition=this.storageData("transition");
        this.index=0;
    }
    storageData(name)
    {
        return bdPluginStorage.get(this.getName(),name);
    }
    getName() { return "RandomBackgroundImages"; }
    getDescription() { return "Randomly select background image of body from imagelist"; }
    getVersion() { return "0.0.3"; }
	getAuthor() { return "NawaNawa"; }
	getChanges() {
		return {
            "0.0.1" : 
            `
               basic function.
            `,
            "0.0.2":
            `
            carousel function.
            `,
            "0.0.3":
            `
            smoothly load, change images.
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
           // this.info(key);
            if(settings[key])
                document.body.style[key]=settings[key];
        }
    }
    get imageSrc()
    {
        let img=this.img;
        switch (img.constructor.name)
        {
            case "String":
                return img;
            break;   
            case "Object":
                let src=img.src||img.img||img.image;
                if(!src)
                    this.info("random src error, object not include src/img/image property");
                return src;
                break;
            default:
            break;
        }
    }
    get imageUrl()
    {
        return this.getCssString(this.imageSrc);
    }
    async applyImage()
    {
        try
        {
            await this.preloadImage(this.imageSrc);
            document.body.style.backgroundImage=this.imageUrl;
            if(this.img.constructor.name==="Object")
                this.objectProcess();
        }
        catch(e)
        {
            ZLibrary.Modals.showAlertModal("Load image error","Can't load image from src : "+this.imageSrc+"\nPlease make sure your this url is correct and resource wasn't deleted.");
        }
       
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
    preloadImage(src)
    {
        let tmpImg=new Image();
        let p = new Promise((resolve,reject)=>
        {
            tmpImg.onload=()=>{resolve(tmpImg);};
            tmpImg.onerror=(e)=>{reject(e);};
        });
        tmpImg.src=src;
        return p;
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
    cssToJsKey(key)
    {
        let keys=key.split("-");
        let ansKey=keys[0];
        for(let i=1;i<keys.length;i++)
        {
            ansKey+=keys[i][0].toUpperCase()+keys[i].slice(1,keys[i].length);
        }
        return ansKey;
    }
    setTransition()
    {
        let t=this.transition;
        for(let key in t)
        {
            document.body.style[this.cssToJsKey(key)]=t[key];
        }
    }
    main()
    {
        this.setTransition();
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
    findVm()
    {throw "vm";}
}