var rewardReady = false;
var rewardEvent = null;
var interEvent = null;

window.googletag = window.googletag || { cmd: [] };

let rewardedSlot;
let gameManualInterstitialSlot;
let rewardPayload;

function prepairRewardAd() {
    googletag.cmd.push(() => {
        rewardedSlot = googletag.defineOutOfPageSlot(
            "/22639388115/rewarded_web_example",
            googletag.enums.OutOfPageFormat.REWARDED,
        );
        
    
        // Slot returns null if the page or device does not support rewarded ads.
        if (rewardedSlot) {
            rewardedSlot.addService(googletag.pubads());
    
            googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
                rewardReady = true;
                rewardEvent = event;
                console.log("rewardedSlotReady---------");
                rewardEvent.makeRewardedVisible();
            });
    
            googletag.pubads().addEventListener("rewardedSlotClosed", dismissRewardedAd);
    
            googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
                rewardPayload = event.payload;
                console.log("REWARD AD GRANTED---------");
            });
    
            googletag.pubads().addEventListener("slotRenderEnded", (event) => {
                if (event.slot === rewardedSlot && event.isEmpty) {
                    console.log("NO REWARD AD---------");
                }
            });
    
            googletag.enableServices();
            googletag.display(rewardedSlot);
        } else {
            console.log("Rewarded ads are not supported on this page.");
        }
    });
}

function prepairInterAd() {
    googletag.cmd.push(function () {
        defineGameManualInterstitialSlot();
        staticSlot = googletag.defineSlot(
            '/6355419/Travel/Europe', [100, 100], 'static-ad-1')
            .addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
    });
}

function defineGameManualInterstitialSlot() {
    gameManualInterstitialSlot = googletag.defineOutOfPageSlot(
        '/6355419/Travel/Europe/France/Paris',
        googletag.enums.OutOfPageFormat.GAME_MANUAL_INTERSTITIAL);
    // Slot returns null if the page or device does not support interstitials.
    if (gameManualInterstitialSlot) {
        gameManualInterstitialSlot.addService(googletag.pubads());
        console.log("Waiting for interstitial to be ready...");
        googletag.pubads().addEventListener('gameManualInterstitialSlotReady',
            (slotReadyEvent) => {
                if (gameManualInterstitialSlot === slotReadyEvent.slot) {
                    console.log("Interstitial is ready.");
                    // const button = document.getElementById('watchAdInterButton');
                    // button.style.display = 'block';
                    // button.addEventListener('click', () => {
                    //     slotReadyEvent.makeGameManualInterstitialVisible();
                    //     printStatus('Interstitial is active.');
                    // }, { once: true });
                    interEvent = slotReadyEvent;
                }
            });

        googletag.pubads().addEventListener('gameManualInterstitialSlotClosed', resumeGame);
    }
}

function resumeGame() {
    interEvent = null;
    //document.getElementById('watchAdInterButton').style.display = 'none';
    // Game manual interstitial ad slots are one-time use, so destroy the old slot and create a new one.
    googletag.destroySlots([gameManualInterstitialSlot]);
    defineGameManualInterstitialSlot();
    googletag.display(gameManualInterstitialSlot);
}

function dismissRewardedAd() {
    if (rewardPayload) {
        console.log(`You have been rewarded ${rewardPayload.amount} ${rewardPayload.type}!`);
        rewardPayload = null;
        // Call function ingame
        receivedRewardedAd();
    } else {
        console.log("User closed the ad without getting a reward.");
    }

    console.log("Rewarded ad has been closed.");
    if (rewardedSlot) {
        googletag.destroySlots([rewardedSlot]);
    }
}

function displayRewardedAd() {
    console.log("displayRewardedAd");
    prepairRewardAd();
}

prepairInterAd();
function displayInterAd() {
    console.log("displayInterAd");
    if (interEvent) {
        interEvent.makeGameManualInterstitialVisible();
        console.log("makeGameManualInterstitialVisible.");
    }
}