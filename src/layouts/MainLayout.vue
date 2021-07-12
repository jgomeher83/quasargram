<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          to="/camera"
          flat
          round
          dense
          class="large-screen-only q-mr-sm"
          size="18px"
          icon="eva-camera-outline"
        />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn
          to="/"
          flat
          round
          dense
          class="large-screen-only"
          size="18px"
          icon="eva-home-outline"
        />
      </q-toolbar>
    </q-header>
    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
      </transition>
      <div v-if="showAppInstallBanner" class="banner-container bg-primary">
        <div class="constraing">
          <q-banner inline-actions dense class="bg-primary text-white">
            <template v-slot:avatar>
              <q-avatar
                color="white"
                text-color="grey-10"
                icon="eva-camera-outline"
                font-size="22px"
              />
            </template>

            <b>Install Quasargram?</b>
            <template v-slot:action>
              <q-btn
                class="q-px-sm"
                @click="installApp"
                flat
                dense
                label="Yes"
              />
              <q-btn
                class="q-px-sm"
                @click="showAppInstallBanner = false"
                flat
                dense
                label="Later"
              />
              <q-btn
                class="q-px-sm"
                @click="neverShowAppInstallBanner"
                dense
                flat
                label="Never"
              />
            </template>
          </q-banner>
        </div>
      </div>

      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
let deferredPrompt;
export default {
  name: "MainLayout",
  data() {
    return {
      showAppInstallBanner: false,
    };
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          this.neverShowAppInstallBanner();
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );
    // Initialize deferredPrompt for use later to show browser install prompt.
    
    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        //console.log(deferredPrompt);
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
  },
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
  .q-toolbar__title
    font-size: 40px
    @media (max-width: $breakpoint-xs-max)
      text-align: center
  .q-footer
    .q-tab__icon
      font-size: 40px
</style>