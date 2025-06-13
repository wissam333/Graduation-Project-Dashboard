<template>
  <div>
    <ClientOnly>
      <div class="main-loader-overlay" :class="data.show ? 'show' : 'hide'">
        <div id="preloader" :class="data.show ? 'show' : 'hide'">
          <div id="preloaders" class="preloader">
            <img
              id="logoLoader"
              class="logoLoader"
              src="/logo/logo.png"
              alt="UnionLogo"
            />
            <img
              class="Loader"
              width="150"
              src="/loading/loadingNew.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
});
// Options & Data
const data = reactive({
  percent: 0,
  show: false,
  canSucceed: true,
});
// Local variables
let _timer = null;
let _throttle = null;
let _cut;

// Functions
const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _timer = null;
};
const start = () => {
  clear();
  data.percent = 0;
  data.canSucceed = true;

  if (props.throttle) {
    _throttle = setTimeout(startTimer, props.throttle);
  } else {
    startTimer();
  }
};
const set = (num) => {
  data.show = true;
  data.canSucceed = true;
  data.percent = Math.min(100, Math.max(0, Math.floor(num)));
};
const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};
const decrease = (num) => {
  data.percent = Math.max(0, Math.floor(data.percent - num));
};
const pause = () => clearInterval(_timer);
const resume = () => startTimer();
const finish = () => {
  // isLoaded.value = useImageLouded().value.loaded
  data.percent = 100;
  hide();
};
const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    // isLoaded.value = useImageLouded().value.loaded = false;
    setTimeout(() => {
      data.percent = 0;
    }, 400);
  }, 500);
};
const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

// Hooks
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

onBeforeUnmount(() => clear);
</script>

<style lang="scss" scoped>
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  overflow: hidden;
  background: #fff;
  transition: all 0.8s cubic-bezier(0.55, 0.09, 0.76, 0.76);
  transform: translateY(-100%);
  .Loader {
    display: none;
  }
  &.show {
    transition: all 0s;
    transform: translateY(0%);
    .Loader {
      display: block;
    }
  }
}

#preloaders {
  width: 100%;
  height: 100%;
  position: relative;
}
img.logoLoader {
  // height: 130px;
  // width: 350px;
  top: 10%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  @media (max-width: 991px) {
    width: 100%;
  }
}
img.Loader {
  top: 70%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

@-webkit-keyframes animate-preloader {
  0% {
    width: 400px;
  }
  25% {
    width: 350px;
  }
  50% {
    width: 400px;
  }
  75% {
    width: 350px;
  }
  100% {
    width: 400px;
  }
}

@keyframes animate-preloader {
  0% {
    width: 200px;
  }
  25% {
    width: 250px;
  }
  50% {
    width: 300px;
  }
  75% {
    width: 250px;
  }
  100% {
    width: 200px;
  }
}
</style>
