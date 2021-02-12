<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">


            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="addUser">Add New <i
                                class="fas fa-user-plus"></i></button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Registered At</th>
                                <th>Type</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{  user.id }}</td>
                                <td>{{  user.name | upText }}</td>
                                <td>{{  user.email }}</td>
                                <td>{{  user.created_at | myDate }}</td>
                                <td>{{  user.type | upText }}</td>
                                <td>
                                    <a href="#" class="blue" @click="editUser(user)">Edit
                                        <i class="fa fa-edit blue"></i>
                                    </a>
                                    /
                                    <a href="#" class="red" @click="deleteUser(user.id)">Delete
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>

                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found />
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addUser" tabindex="-1" role="dialog" aria-labelledby="addUserModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" v-show="!editMode" id="addUserModalLabel">Add New User</h5>
                        <h5 class="modal-title" v-show="editMode" id="addUserModalLabel">Update User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="editMode ? updateUser() : createUser()">
                            <div class="form-group">
                                <input v-model="form.name" type="name" name="name"
                                       placeholder="Name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.email" type="email" name="email"
                                       placeholder="Email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                            <textarea v-model="form.bio" type="bio" name="bio"
                                      placeholder="Bio"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                            <div class="form-group">
                                <select v-model="form.type" id="type" name="type"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select user type</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.password" type="password" name="password"
                                       placeholder="Password" id="password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                <button  v-show="editMode" class="btn btn-success">Update</button>
                                <button  v-show="!editMode" class="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            editMode: true,
            users: {},
            form: new Form({
                id: '',
                name: '',
                email: '',
                type: '',
                password: '',
                bio: '',
                photo: '',
            })
        }
    },
    methods: {
        getResults(page = 1) {
            axios.get('api/user?page=' + page)
                .then(response => {
                    this.users = response.data;
                });
        },
        updateUser(){
            this.$Progress.start();
            this.form.put('api/user/'+this.form.id)
            .then(()=>{
                swal.fire(
                    'Update!',
                    'Information has been updating',
                    'success'
                )
                $('#addUser').modal('hide')
                this.$Progress.finish();
                Fire.$emit('AfterCreate');
            })
            .catch(()=>{
                this.$Progress.fail();
            })
        },
        editUser(user){
            this.editMode = true
            this.form.reset()
            $('#addUser').modal('show')
            this.form.fill(user)
        },
        addUser(){
            this.editMode = false
            this.form.reset()
            $('#addUser').modal('show')
        },
        deleteUser(id) {
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                //Send request server
               if(result.value){
                   this.form.delete('api/user/'+id).then(()=>{
                       swal.fire(
                           'Deleted!',
                           'Your file has been deleted.',
                           'success'
                       )
                       Fire.$emit('AfterCreate');

                   }).catch(()=>{
                       swal.fire('Failed','request errored something wrong')
                   })
               }
            })
        },
        loadUsers() {
            if (this.$gate.isAdminOrAuthor){
                axios.get('api/user').then(({data})=>(this.users = data))
            }
        },
      createUser(){
          this.$Progress.start();
          this.form.post('api/user')
          .then(()=>{

              Fire.$emit('AfterCreate');
              $('#addUser').modal('hide')
              toast.fire({
                  icon: 'success',
                  title: 'User Created in successfully'
              })
              this.$Progress.finish();
          })
          .cache((error)=>{
              console.log(error)
          })
      }
    },
    created() {
        Fire.$on('searching',()=>{
            let query =  this.$parent.search;
            axios.get('/api/findUser?q=' + query)
            .then((data)=>{
                this.users = data.data
            })
            .catch()
        })
        this.loadUsers();
        Fire.$on('AfterCreate',() => {
            this.loadUsers()
        })
    },

}
</script>
