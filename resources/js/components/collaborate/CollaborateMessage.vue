<template>
  <div class="row justify-content-center mb-3 top-news mx-0">
    <div  class="modal fade manage-reviews-modal" id="deleteModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <!-- Modal Header -->
          <button type="button" class="close cross-btn" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- Modal body -->
          <div style="padding: 15px" class="modal-body">
            <p style="text-align:center">{{translations.remove_image}}</p>
            <div style="display: flex;justify-content: space-between;max-width: 100px;margin: 0 auto">
              <span data-toggle="modal" data-target="#deleteModal" @click="removeImage" class="btn btn-success">{{translations.yes}}</span>
              <span data-toggle="modal" data-target="#deleteModal" class="btn btn-danger">{{translations.no}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 p-0">
      <div class="main_div">
        <div class="row" style="padding:60px 50px">
          <div class="col-md-8">
            <div class="message-box" style="background: white">
            <div style="font-weight: bold;" class="d-flex justify-content-center nowrap message-title align-items-center">
              <span  style="white-space: pre-wrap;font-size: 15px">{{translations.user_no_message}}</span>
            </div>
              <form method="POST" class="ui reply form">
                <div>
                                            <textarea id="message" name="message" :placeholder="translations.Message" class="form-control"
                                                      style="width: 100%;" rows="6" v-model="newMessage" >{{newMessage}}</textarea>
                </div>
                <br>
                <div style="display: flex">
                  <div class="img-fluid">
                  <img v-show="showLoader" :src="'/assets/images/red_style.gif'" alt="" style="height: 25px; margin-right:25px" >
                  <button v-show="!showLoader" type="button" class="btn for_sp_button"  @click="saveMessage(reviewMessage.id)">
                    {{ translations.Add_Reply }}
                  </button>
                </div>
                <div  class="upload-btn-wrapper">
                  <label for="image_input"><i style="color: grey;cursor: pointer" class="fa fa-paperclip attach" aria-hidden="true"></i></label>
                  <input id="image_input" style="opacity: 0;"  name="file"  type="file" accept="image/*"  ref="myFile" @change="uploadImage($event)">
                </div>
                </div>
                <div v-if="url" id="preview" class="">
                  <div style="position: relative;width: 200px;display: flex">
                    <img  :src="url" style="width: 200px;height: 135px;object-fit: contain"/>
                    <i data-toggle="modal" data-target="#deleteModal" style="cursor: pointer" class="fa fa-times res_img" @click="resetImage"  aria-hidden="true"></i>
                  </div>
                </div>
              </form>

            </div>
          </div>
          <div class="col-md-4">
            <div class="thumbnail">
              <div style="min-width: 172px" class="d-flex justify-content-between align-items-center nowrap">
                <div>
                  <img :src="reviewMessage.reviewer_photo_url" alt="" class="reviewer-avatar">
                  <span style="margin-right: 10px">{{ translations.By }}</span>
                </div>
                <p><span v-if="reviewMessage.reviewer_name">{{reviewMessage.reviewer_name}}</span></p>
              </div>
              <p class="ticket-info">{{ translations.ReviewID }}: <b class="pull-right">{{reviewMessage.id}}</b></p>
              <p class="ticket-info"> {{ translations.Posted_on }}: <b class="pull-right">{{reviewMessage.created_at}}</b></p>
              <p style="display: flex;justify-content: space-between" class="ticket-info"> {{ translations.Severity }}:
              <ul style="max-width: 155px;direction: rtl;padding-right: 0;margin-bottom: 0" class="row">
                <li class="col-1 ml-0" style="color: #f4a74f" v-for="n in 5">
                  <i :class="reviewMessage.rating < ratingsLeftRight[n] ? 'fa fa-star-o' : 'fa fa-star'" aria-hidden="true"></i>
                </li>
              </ul>
              </p>
              <p style="display: flex;justify-content: space-between" class="ticket-info"> {{ translations.Type }}:
                <b v-if="reviewMessage.rating>3" class="pull-right">{{translations.Positive}}</b>
                <b v-else class="pull-right">{{translations.Negative}}</b>
              </p>
              <p v-if="reviewMessage.responded" class="ticket-info"> {{ translations.Status }}: <b class="pull-right">{{translations.Responded}}</b></p>
              <p v-else class="ticket-info"> {{ translations.Status }}: <b class="pull-right">{{translations.Unresponded}}</b></p>
              <div  class="d-flex justify-content-between"> <p>Entities:</p>
                <div v-if="entities && JSON.parse(entities)!=''" style="display: inline-grid">
                  <span v-for="entiti in JSON.parse(entities)">{{entiti}}</span>
                </div>
                <div v-else>
                  <span>Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {

  data(){
    return{
      url: null,
      reviewMessage: JSON.parse(this.$props.review),
      newMessage: '',
      showRemoveImageModal:false,
      validateMessage: '',
      showLoader: false,
      form:{
        file : ""
      },
      ratingsLeftRight:{
        1:5,
        2:4,
        3:3,
        4:2,
        5:1
      },
    }
  },

  props:['review','translations','entities'],

  methods:{
    resetImage(){
      this.showRemoveImageModal = true;
    },
    removeImage(){
      this.form.file = ""
      this.url = null
    },
    uploadImage(e){
      const file = e.target.files[0];
      if(file){
        this.form.file = file ;
        this.url = URL.createObjectURL(file);
      }else{
        this.form.file = ""
        this.url = null
      }
    },
    saveMessage(id){
      this.showLoader = true;
      this.validateMessage = '';
      var form = new FormData;
      form.append("id",id);
      form.append("message",this.newMessage);
      form.append("image",this.form.file);
      this.form.file = [];
      this.url=null;
      this.newMessage = '';
      axios.post('/collaborate/messages/save',form).then((res)=>{
        if (res.data.success){
          this.showLoader = false;
          this.newMessage = '',
              this.messages.push(res.data.message);
        }else {
          this.showLoader = false;
          this.validateMessage = res.data.msg;
        }
      }).catch((err)=>{
        this.showLoader = false;
      })
    }
  },

}
</script>

<style scoped>
.message-title {
  border-radius: 20px 20px 0 0;
  padding: 25px;
  background-color: #6e0303;
  color: #fff;
}
.reply.form{
  margin-top: 35px;
}
textarea {
  border-radius: 15px;
}
.upload-btn-wrapper{
  width: 20px;
}
.for_sp_button{
  background-color: #6e0303;
  color: white;
  font-weight: bold;
  height: 35px;
}
.adminBLock .message-recontent {
  margin-right: 67px!important;
  margin-left: 0!important;
}
.adminBLock  img {
  border-radius: 50%;
  float: right!important;
}
.adminBLock .time {
  float: left!important;
  font-size: 10px;
}
.adminBLock .message-recontent > p{
  margin-top: -17px;
}
.message-content{
  height: auto;
  overflow-y: auto;
}
.color-danger{
  color:#d9534f!important
}
.message-padding {
  padding: 20px 30px 20px 30px;
}
.message img {
  border-radius: 50%;
}
.message-recontent {
  margin-left: 67px;
}
.time {
  font-size: 10px;
}
.attach{
  font-size: 27px;
  transform: rotate(45deg);
}
p {
  margin: 0 0 11px;
  color: #636b6f;
  font-weight: 500;
}
.message-content {
  border: 1px solid #ececec;
  border-top: none;
}
.thumbnail {
  padding: 20px;
  line-height: 1.6;
  background-color: #FEFEFE;
  border: 0.5px solid #F1F1F1;
  border-radius: 4px;
  transition: border .2s ease-in-out;
}
.ticket-info {
  display: block;
  font-size: 13px;
}

b, optgroup, strong {
  font-weight: 700;
}
.color-olive {
  color: #A7BD0D!important;
}
.direc
{
  direction: rtl;
}
</style>