console.log("IB script is linked");

(function () {
    Vue.component("modal", {
        template: "#modal",
        data: function () {
            return {
                title: "",
                description: "",
                username: "",
                id: "",
                date: "",
                url: "",
            };
        },
        props: ["imageid"],
        mounted: function () {
            axios.get(`/modal/${this.imageid}`).then((response) => {
                this.title = response.data[0].title;
                this.description = response.data[0].description;
                this.username = response.data[0].username;
                this.id = response.data[0].id;
                this.date = response.data[0].created_at;
                this.url = response.data[0].url;
            });
        },
        methods: {
            closeModal: function () {
                this.$emit("close");
            },
            left: function () {
                console.log("someone clicked left");
                console.log("this.imageid: ", this.imageid);
                console.log("this.location: ", window.location);
                window.location.replace("#" + (this.imageid + 1));
            },
        },
    });

    Vue.component("comments", {
        template: "#comments",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["imageid"],
        mounted: function () {
            axios.get(`/comments/${this.imageid}`).then((response) => {
                console.log("getComments response:", response.data);
                this.comments = response.data;
            });
        },
        methods: {
            clickhandler: function () {
                console.log("someone clicked post");
                axios
                    .post(`/comment/${this.imageid}`, {
                        comment: this.comment,
                        username: this.username,
                    })
                    .then((response) => {
                        console.log("response: ", response);
                        this.comments.push(response.data);
                        console.log("this.comments: ", this.comments);
                    });
            },
            closeModal: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            title: "",
            seen: true,
            images: [],
            file: null,
            description: "",
            username: "",
            id: "",
            selectedImage: location.hash.slice(1),
            lastImageId: "",
        }, //data ends
        mounted: function () {
            // mounted runs as soon as the page loads
            var self = this;

            axios.get("/images").then(function (response) {
                self.images = response.data;
                self.lastImageId = response.data[response.data.length - 1].id;
                self.images.concat(response);
            });
        },
        methods: {
            getMoreImages: function () {
                var self = this;
                axios
                    .get("/moreImages/" + this.lastImageId)
                    .then(function (response) {
                        self.images = [...self.images, ...response.data];
                        self.lastImageId =
                            self.images[self.images.length - 1].id;
                        for (var i = 0; i < response.data.length; i++) {
                            if (
                                response.data[i].id ===
                                response.data[i].lowestId
                            ) {
                                self.seen = false;
                            }
                        }
                    });
            },

            closeMe: function () {
                console.log("closeME fired");
                this.selectedImage = 0;
            },

            clickhandler: function (e) {
                e.preventDefault();
                // console.log("this: ", this);
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                // fd.reset();
                axios
                    .post("/upload", fd)
                    .then((response) => {
                        console.log("response: ", response.data);
                        this.images.unshift(response.data);
                    })
                    .catch((err) => {
                        console.log("error in axios post request: ", err);
                    });
            },
            fileSelectHandler: function (e) {
                console.log("this: ", this);
                console.log("e.target.files[0]: ", e.target.files[0]);
                this.file = e.target.files[0];
                console.log("this.file: ", this.file);
            },
            myFunction: function (e) {
                e.preventDefault();
                console.log("myFunction is running");
            },
        },
    });
})();
