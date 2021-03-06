<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post._id"
            class="card-post q-mb-md"
            :class="{'bg-red-1' : post.offline}"
            flat
            bordered
          >
          <q-badge 
          v-if="post.offline"
          color="red" 
          class="badge-offline absolute-top-right">
            Stored offline
          </q-badge>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">jpgh__</q-item-label>
                <q-item-label caption>
                  {{ post.Location }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-img :src="post.productThumbnail" />

            <q-card-section>
              <div>{{ post.Details }}</div>
              <div class="text-caption text-grey">
                {{ post.date | niceDate }}
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">
            No posts yet
          </h5>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">jpgh__ </q-item-label>
            <q-item-label caption>
              Pablo Gómez
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { openDB } from 'idb';

export default {
  name: "PageHome",
  data() {
    return {
      posts: [],
      loadingPosts: false
    };
  },
  methods: {
    getOfflinePosts(){
      let db = openDB('workbox-background-sync')
      .then(db =>{
        db.getAll('requests')
        .then(failedRequests => {
          failedRequests.forEach(failedRequest => {  
            if(failedRequest.queueName == 'createPostQueue'){
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)
              request.formData()
              .then(formData =>{
                let offlinePost = {}
                offlinePost.id = formData.get('id')
                offlinePost.caption = formData.get('caption')
                offlinePost.location = formData.get('location')
                offlinePost.date = parseInt(formData.get('date'))
                offlinePost.offline = true
                let reader = new FileReader()
                reader.readAsDataURL(formData.get('file'))
                reader.onloadend = () => {
                  offlinePost.imageUrl = reader.result
                  this.posts.unshift(offlinePost)
                }
             })
            }
          })
        .catch(err=>{
          console.log('err', err);
        })
        })
      })
    },
    getPosts() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/posts`)
        .then(response => {
          console.log('res', response)
          this.posts = response.data.posts;
          console.log('posts', this.posts)
          this.loadingPosts = false;
          if(!navigator.onLine){
            this.getOfflinePosts()
          }
        })
        .catch(err => {
          this.$q.dialog({
            title: "Error",
            message: "Can't fetch posts"
          });
          this.loadingPosts = false;
        });
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    }
  },
  created() {
    this.getPosts();
  }
};
</script>

<style lang="sass">
.card-post
  .badge-offline
    border-top-left
  .q-img
    min-height: 200px
</style>
