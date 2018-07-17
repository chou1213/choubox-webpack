/**
 * Created by yuanqiujuan on 2018/6/25.
 */
import LikeTool from "COMMON/assets/like/js/util/base";
import Adaptive from "COMMON/assets/like/js/util/adaptive";
import { OpenApp } from "COMMON/assets/like/js/util/open-app";
import { SocialShare } from "COMMON/assets/like/js/util/social-share";
import { Stat} from "COMMON/assets/like/js/util/stat";
import { Animation } from "COMMON/assets/like/js/util/animation";

const likeBase = new LikeTool();
const likeAdaptive = new Adaptive();
const likeOpenApp = new OpenApp();
const likeSocialShare = new SocialShare();
const likeStat = new Stat();
const likeAni = new Animation();

export {
    likeBase,
    likeAdaptive,
    likeOpenApp,
    likeSocialShare,
    likeStat,
    likeAni
}
