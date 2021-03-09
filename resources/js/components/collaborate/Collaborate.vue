<template>
  <div>
    <div style="background-color: white;border-radius: 10px;width: 100%;padding: 10px">
      <div class="table-responsive_collaborate pb-3  mt-1">
        <div class="row">
          <div class="col-md-2">
            <custom-select1
                v-show="source== 'Google'"
                :allCheckbox="true"
                :options="entities"
                :groups="groupNames"
                label="title"
                v-model="entity"
                :translations="translations"
                :placeholder="translations.select_location"
                :loading="showLoader">
            </custom-select1>
          </div>
          <div class="col-md-3">
            <multiselect
                v-model="filterCause"
                class="multi_select_collaborate"
                :options="statusCause"
                :searchable="true"
                :close-on-select="false"
                :show-labels="false"
                :placeholder="translations.select_cause">
            </multiselect>
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 9%" v-show="loader">
        <img width="70px" :src="'/assets/images/icons/red_style.gif'" alt="">
      </div>
      <div v-show="!loader" style="background-color: white;border-radius: 10px">
        <vuetable class="table mt-3" ref="vuetable"
                  :api-url="`/collaborate/reviews?filter=${filterCause}&entity=${JSON.stringify(etitiesData)}`"
                  :append-params="{
                                      paginate: 1,
                                      fetch: fetchForAdd,
                                  }"
                  :perPage="perPage"
                  refs="vuetable"
                  :show-sort-icons="true"
                  :sort-order="[]"
                  :multi-sort="true"
                  :fields="fields"
                  :no-data-template="translations.no_data_available"
                  data-path="data"
                  pagination-path=""
                  pagination-component="VuetablePagination"
                  @vuetable:loading="tableLoadingData"
                  @vuetable:loaded="tableLoadedData"
                  @vuetable:pagination-data="onPaginationData">
          <template slot="entity" slot-scope="props">
            <span class="headers-font-size">{{ getEntityTranslates(props.rowData.review.entities) }}</span>
          </template>
          <template slot="reference" slot-scope="props">
            <span class="headers-font-size"> {{ props.rowData.review.ticket_reference }}</span>
          </template>
          <template slot="review" slot-scope="props">
            <p style="text-transform: none;" :id="'popover-target-'+props.rowData.review.id">
                            <span class="headers-font-size">
                                {{props.rowData.review.comment ? props.rowData.review.comment : translations.user_no_message }}
                            </span>
            </p>
          </template>
          <template slot="rating" slot-scope="props">
            <img
                :src="'/files/images/stars/' + props.rowData.review.rating + '-star.png'"
                :alt="props.rowData.review.rating"
                class="source-img"
            />
          </template>
          <template slot="source" slot-scope="props">
            <img
                :src="'/assets/images/' + props.rowData.review.source_name + '-logo.png'"
                :alt="props.rowData.review.source_name"
                class="source-img"
            />
          </template>
          <template slot="store" slot-scope="props">
            <div class="d-flex justify-content-center align-items-center">
              <a :href="props.rowData.page.link" :id="'popover-target-location-'+props.rowData.review.id"
                 class="headers-font-size">{{ props.rowData.review.page.name }}</a>
              <b-popover :target="'popover-target-location-'+props.rowData.review.id" triggers="hover"
                         placement="top">
                <template v-slot:title>
                  <span class="location_hover_title">{{props.rowData.review.page.name}}</span>
                </template>
                <a :href="props.rowData.review.page.link" class="location_hover_address">
                  {{props.rowData.review.page.country ? props.rowData.review.page.country : "" }} {{
                    props.rowData.review.page.city ? props.rowData.review.page.city : "" }}
                  {{props.rowData.review.category }}
                </a>
                <div>
                  <span class="location_hover_rating">{{props.rowData.review.page.overall_star_rating }} </span>
                  <img :key="index"
                       :src="'/assets/images/new-geo/'+getRatingClass(index, props.rowData.review.page.overall_star_rating)+'.png'"
                       class="img-fluid pr-2" v-for="(item, index) in 5">
                </div>
              </b-popover>
            </div>
          </template>
          <template slot="location.title" slot-scope="props">
            <div v-if="props.rowData.location" class="d-flex justify-content-center align-items-center">
              <a :href="can_click(props)" :id="'popover-target-location-'+props.rowData.review.id"
                 class="headers-font-size">{{ props.rowData.location.title }}</a>
              <b-popover :target="'popover-target-location-'+props.rowData.review.id" triggers="hover"
                         placement="top">
                <template v-slot:title>
                  <span class="location_hover_title">{{props.rowData.location.title}}</span>
                </template>
                <a :href="'/locations/' + props.rowData.location.id + '?tab=edit'"
                   class="location_hover_address">
                  {{props.rowData.location.street}} {{ props.rowData.location.city}} {{
                    props.rowData.location.state }}, {{ props.rowData.location.country }}
                </a>
                <div>
                  <span class="location_hover_rating">{{props.rowData.location.rating }}- </span>
                  <img :key="index"
                       :src="'/assets/images/new-geo/'+getRatingClass(index, props.rowData.location.rating)+'.png'"
                       class="img-fluid pr-2" v-for="(item, index) in 5">
                </div>
              </b-popover>
            </div>
          </template>
          <template slot="created_at_for_humans" slot-scope="props">
            <div class="d-flex justify-content-center align-items-center">
              <span class="headers-font-size">{{ props.rowData.review.created_at_for_humans }}</span>
            </div>
          </template>
          <template slot="actions" slot-scope="props">
            <div class="dropdown d-flex justify-content-center align-items-center">
              <i class="fa fa-bars font-22 po-t-1 dropdown-toggle" data-toggle="dropdown"
                 style="cursor: pointer"></i>
              <div style="transform: translate3d(-62px, 14px, 0px);min-width: 115px;padding: 0"
                   class="dropdown-menu dropdown-menu-left mt-0 to_left" aria-labelledby="dropdownMenu2">
                <a
                    :href="'/collaborate/messages/'+props.rowData.review.id"
                    role="button"
                    class="p-1 pointer"
                    :id="'send-message-'+props.rowData.review.id"
                    style="width: 100%;display: flex;justify-content: center"
                >
                  <p style="width: 100%">{{translations.view_chat_room}}</p>
                </a>
                <a
                    role="button"
                    class="pointer  theme-blue-color mt-2"
                    :data-target="'#deleteMessage'+props.rowData.id"
                    data-toggle="modal"
                >
                  <p>{{ translations.delete_message }}</p>
                </a>
              </div>
            </div>
            <div class="modal fade" :id="'deleteMessage'+props.rowData.id" tabindex="-1" role="dialog"
                 :aria-labelledby="'deleteMessage'+props.rowData.id" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content" style="top: 200px">
                  <div class="modal-footer">
                    <div class="modal-body">
                      <p style="color: #4a0808;text-transform: none;">{{ translations.want_delete_message }}</p>
                    </div>
                    <button @click="deleteMessage(props.rowData.review_id,props.rowData.id)"
                    type="button" class="btn btn-closed">Delete
                    </button>
                    <button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </vuetable>
        <vuetable-pagination ref="pagination"
                             @vuetable-pagination:change-page="onChangePage"
                             :css="$root.paginationStyle"></vuetable-pagination>
      </div>
    </div>
  </div>
</template>
<style>
.btn-closed{
  background: #0c4fa5;
  color: white;
  border-radius: 7px;
}
.btn-primary.text-white{
  background: #0b4fa5 !important;
  border-color:#0b4fa5 !important;
}
</style>
<style scoped>
.dropdown-menu p {
  padding: 8px 3px;
  font-size: 12px;
  margin: 0;
}

.dropdown-menu a {
  width: 100% !important;
  text-align: left;
}

.dropdown-menu p:hover {
  background-color: lightgrey;
}

.table-responsive_collaborate {
  margin-top: 20px;
  padding-top: 30px;
  min-height: 100px;
}

</style>
<style>
.dropdown-toggle:empty:after{
  display: none;
}
.multi_select_collaborate {
  text-align: left;
  min-width: 150px;
  border-bottom: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 4px;

}

.multi_select_collaborate .multiselect__select::before {
  position: absolute;
  right: 15px;
  top: 20px;
}
</style>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import VuetablePaginationInfo from "vuetable-2/src/components/VuetablePaginationInfo";
import Multiselect from 'vue-multiselect';
import moment from "moment";
import HLineChart from "../charts/HLineChart";
import {GChart} from "vue-google-charts";

const Highcharts = require("highcharts");
require("highcharts/modules/exporting")(Highcharts);
import CustomSelect1 from "../CustomSelect1"

export default {
  name: 'collaborate',
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    Multiselect,
    HLineChart,
    GChart,
    moment,
    CustomSelect1,
  },
  props: ['translations', 'ticketsTranslate'],

  data() {
    return {
      emailData: {
        text: '',
        dataId: 0,
      },
      loader: true,
      fields: [
        {
          name: '__slot:entity',
          title: this.popoverTitle(this.translations.Cause, this.translations.ticket_couse),
          dataClass: 'pt-3',
        },
        {
          name: '__slot:reference',
          title: this.popoverTitle(this.translations.Reference, this.translations.ticket_reference),
          dataClass: 'pt-3',
        },

        {
          name: "__slot:review",
          title: this.popoverTitle(this.translations.Review, this.translations.reviews_manage_reviews),
          sortField: "comment",
          dataClass: "pt-3",
        },
        {
          name: "__slot:rating",
          title: this.popoverTitle(this.translations.Rating, this.translations.reviews_manage_rating),
          sortField: "rating",
          dataClass: "pt-3"
        },
        {
          name: "__slot:source",
          title: this.popoverTitle(this.translations.source, this.translations.reviews_manage_source),
          dataClass: "pt-3"
        },
        {
          name: "__slot:location.title",
          title: this.popoverTitle(this.translations.Store, this.translations.reviews_manage_store),
          dataClass: "pt-3 sortable"
        },
        {
          name: "__slot:created_at_for_humans",
          title: this.popoverTitle(this.translations.When, this.translations.reviews_manage_created_at),
          sortField: "created_at",
          dataClass: "pt-3"
        },
        {
          name: "__slot:actions",
          title: this.translations.Action,
          dataClass: "pt-3 list_action"
        }
      ],
      perPage: 5,
      ratingsLeftRight: {
        1: 5,
        2: 4,
        3: 3,
        4: 2,
        5: 1
      },
      baseurl: window.location.origin,
      entities: [],
      showLoader: false,
      entity: [],
      groupNames: [],
      source: "Google",
      filterCause: null,
      statusCause: [],
      etitiesData: [],
      fetchForAdd: 1,
    }
  },
  methods: {
    getEntityTranslates(entity) {
      if (!entity || entity.indexOf(',') === -1) {

        if (this.translations[entity]) {
          return this.translations[entity];
        } else {
          if (!entity || 0 === entity.length || !entity.length) {
            return this.translations.Other;
          } else {
            return entity;
          }

        }
      } else {
        var str = entity.split(',');
        var newstring = [];
        for (var i in str) {
          if (this.translations[str[i]]) {
            newstring[i] = this.ticketsTranslate[str[i]];
          } else {
            newstring[i] = str[i];
          }
        }
        newstring = newstring.join(',');
        return newstring;
      }
      var str = entity.split(',');
      var newstring = [];
      for (var i in str) {
        newstring[i] = this.ticketsTranslate[str[i]];
      }
      newstring = newstring.join(',');
      return newstring;
    },
    deleteMessage(id, index) {
      $('#deleteMessage' + index).modal('hide')
      this.loader = false;
      let data = new FormData();
      data.append('id', id);
      axios.post('/collaborate/delete_messages', data,).then((response) => {
        if (response.data) {
          this.loader = true;
        } else {
          this.loader = true;
        }
        this.$refs.vuetable.refresh()
      }).catch(error => {
        console.log(error)
      });
    },
    popoverTitle(title, content) {
      return '<span data-toggle="popover" data-content="' + content + '" data-trigger="hover" data-placement="top">' + title + '</span>';
    },
    tableLoadingData() {
      this.loader = true;
    },
    tableLoadedData() {
      this.loader = false;
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    can_click(props) {
      if (this.write_is_available('manage-reviews')) {
        return '/locations/' + props.rowData.review.location.id + '?tab=edit'
      }
      return '#';
    },
    write_is_available(page_name) {
      if (this.pagesNames && this.pagesNames.length) {
        if (this.pagesNames.includes('full')) return true;
        return this.pagesNames.includes(page_name)
      }
    },
    getRatingClass(index, rating) {
      let thisIndex = rating - index,
          result;
      if (thisIndex >= 1) result = 4;
      else if (thisIndex <= 0) result = 0;
      else {
        result = Math.round(thisIndex * 4);
      }
      return 'rating-' + result;
    },
  },
  created() {
    let arr;
    axios.get('/collaborate/info').then(response => {
      response.data = response.data.map((e) => {
        if (e == null) {
          return e = this.translations.Other;
        } else {
          return e;
        }
      })
      arr = Array.from(new Set(response.data));
      this.statusCause = arr;
      this.$refs.vuetable.refresh();

    }).catch(error => {
      console.log(error)
    })
    axios.get('/api/v1/locations/all').then(response => {
      this.entities = (response.data && response.data.length) ? response.data : [];
      this.showLoader = false;

    }).catch(error => {
      this.showLoader = false;
    })

  },
  watch: {
    entity(values) {
      this.etitiesData = [];
      if (values.length > 1) {
        values.map(el => {
          this.etitiesData.push(el.id)
        })
      } else if (values.length < 1){
        this.etitiesData = values;
      }else {
        this.etitiesData = values[0].id
      }

      this.$refs.vuetable.refresh()
    },
  },


}
</script>

