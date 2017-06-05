var __s__ = require('../../../utils/js-helpers.js'),
    __d__ = require('../../../utils/dom-utilities.js'),
    groupsFactory = require('../../../core/groups/groupsFactory'),
    configConsts = require('../../../mgmt/config.const');


const numberOrDelete = function(obj, key, toNumber = false) {
    if (obj[key]) {
        if (toNumber) { obj[key] = Number(obj[key]) }
        return;
    }
    delete obj[key];
}

const isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

export const timelineHelpers = {
    createAudioTween(dta, me) {

        return new Promise((resolve, reject) => {
            var animData = _.clone(dta);
                 
            function createAudio(src, cb) {
                let au = document.createElement("AUDIO");
                au.preload = true;
                au.loop = false;
                au.controls = false;
                au.autoplay = false;
                au.muted = false;
                au.volume = me.__globalVolume;

                __d__.addEventLnr(au, "loadeddata", function() { cb(au) });
                au.src = src;
                au.load();

                return au;
            }

            let au = createAudio(animData.src, (aud) => {
                aud.delayedTime = animData.timing;
                aud.tweenT = 0;
                me.__audios.push(aud);

                let tween = new TweenMax(aud, aud.duration, {
                        tweenT: 1,
                        onStart:() => { aud.play() },
                        onComplete:() => { aud.pause() },
                        ease: Power0.easeNone
                    });
                
                resolve({tween, animData});
            });

        });

    },

    createCameraTween(dta, me) {
        let controls = me._app3d.renderer3d.controls,
            cameraPos = me._app3d.renderer3d.camera.position,
            targetPos = controls.target;

        return new Promise((resolve, reject) => {
            let cam, tar,
                tweenCam, tweenPos, tween,
                animData = Object.assign({}, dta);

            cam = Object.assign({}, cameraPos, animData.cameraPosition);
            tar = Object.assign({}, targetPos, animData.targetPosition);

            tween = new TimelineMax({ align: "start"});

            tween.add(new TweenMax(cameraPos, animData.duration, {
                x: cam.x,
                y: cam.y,
                z: cam.z,
                ease: Power2.easeInOut,
                onStart:() => { controls.enabled = false; me.__cameraIsTravelling = true; },
                onComplete:() => { controls.enabled = true; me.__cameraIsTravelling = false; }
            }), 0);
            
            tween.add(new TweenMax(targetPos, animData.duration, {
                x: tar.x,
                y: tar.y,
                z: tar.z,
                ease: Power2.easeInOut
            }), 0);
            
            resolve({tween, animData});
        });
    },

    createStateSet(dta, me) {
        return new Promise((resolve, reject) => {

            let target = groupsFactory.GroupsFactory.get(dta.src || dta.target),
                animData = Object.assign({}, dta);

            if (!target) { reject(); }
            
            let act = dta.action, tprop;
            const props = {
                show: { proxyVisible: 1 },
                hide: { proxyVisible: 0 },
                highlight: { proxyHighlight: 1 },
                highlightOff: { proxyHighlight: 0 },
                flash: { proxyFlash: 1  },
                blink: { proxyBlink: 1  },
                blinkOff: { proxyBlink: 0  },
            };

            tprop = Object.assign({}, props[act]);

            if (act === "blink") { me.__toReset.push({target: target, action:"n-blink"}); }
            if (act === "highlight") { me.__toReset.push({target: target, action:"n-highlight"}); }
            if (act === "show" || act === "hide") { me.__toResetShowHide[dta.src] = target; }

            resolve({trgt: target, tprop, animData});
        });
    },

    stopAudio(me) {
        let j, lenJ = me.__audios.length;
        for (j = 0; j < lenJ; j += 1) {
            me.__audios[j].pause();
        }
    },

    restartAudio(me, pos) {
        let j, lenJ = me.__audios.length, 
            au, realPos;

        for (j = 0; j < lenJ; j += 1) {
            au = me.__audios[j];
            realPos = pos - au.delayedTime;
            if (realPos >= 0 && realPos <= au.duration) {
                au.currentTime = realPos;
                au.play();
            }
        }
    },

    validateArrayAnims(arr) {
        if (!arr || !Array.isArray(arr)) { return []; }

        let j, lenJ = arr.length, dta, valid = [];
        for (j = 0; j < lenJ; j += 1) {
            dta = _.clone(arr[j]);
            switch(dta.type) {
                case "audio":
                    if (!dta.src) { continue; }
                    dta.timing = Number(dta.timing || 0);
                    valid.push(dta);
                    break;
                case "3dObjectState":
                    if (!dta.src) { continue; }
                    dta.timing = Number(dta.timing || 0);
                    valid.push(dta);
                    break;
                case "3dObjectPosition":
                    if (!dta.src) { continue; }
                    dta.timing = Number(dta.timing || 0);
                    dta.duration = isNaN(dta.duration) ? 1 : Number(dta.duration);
                    dta.position.x = isNaN(dta.position.x) ? 0 : Number(dta.position.x);
                    dta.position.y = isNaN(dta.position.y) ? 0 : Number(dta.position.y);
                    dta.position.z = isNaN(dta.position.z) ? 0 : Number(dta.position.z);
                    valid.push(dta);
                    break;
                case "3dObjectRotation":
                    if (!dta.src) { continue; }
                    dta.timing = Number(dta.timing || 0);
                    dta.duration = isNaN(dta.duration) ? 1 : Number(dta.duration);
                    dta.rotation.x = isNaN(dta.rotation.x) ? 0 : Number(dta.rotation.x);
                    dta.rotation.y = isNaN(dta.rotation.y) ? 0 : Number(dta.rotation.y);
                    dta.rotation.z = isNaN(dta.rotation.z) ? 0 : Number(dta.rotation.z);
                    valid.push(dta);
                    break;
                case "camera":
                    dta.timing = Number(dta.timing || 0);
                    dta.duration = isNaN(dta.duration) ? 0 : Number(dta.duration);
                    numberOrDelete(dta.cameraPosition, "x", true);
                    numberOrDelete(dta.cameraPosition, "y", true);
                    numberOrDelete(dta.cameraPosition, "z", true);
                    numberOrDelete(dta.targetPosition, "x", true);
                    numberOrDelete(dta.targetPosition, "y", true);
                    numberOrDelete(dta.targetPosition, "z", true);

                    if ((!dta.duration) ||
                        (!dta.cameraPosition && !dta.targetPosition) ||
                        (isEmpty(dta.cameraPosition) && isEmpty(dta.targetPosition))) { continue; }

                    valid.push(dta);
                    break;
            }            
        }
        return valid;
    }
};