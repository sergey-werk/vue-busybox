<template>
  <div class="container h-100 d-flex justify-content-center">
    <div class="jumbotron my-auto">
      <h1 class="display-3">Busyboard v0.1</h1>
      <form>
        <div class="form-group">
          <label for="text1">Color</label>
          <input
            type="text"
            class="form-control"
            id="text1"
            placeholder="Text input"
            v-bind:value="state['text1']"
            v-on:change="pushUpdate"
          />
        </div>
        <div class="form-group">
          <label for="range1">Range</label>
          <input
            type="range"
            class="form-control"
            id="range1"
            placeholder="Range input"
            v-bind:value="state['range1']"
            v-on:change="pushUpdate"
          />
        </div>
        <div class="form-group">
          <label for="color1">Color</label>
          <input
            type="color"
            class="form-control"
            id="color1"
            placeholder="Color input"
            v-bind:value="state['color1']"
            v-on:change="pushUpdate"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// We store the reference to the SSE object out here
// so we can access it from other methods
let msgServer;

const BACKEND_URL = "http://localhost:5000";

export default {
  name: "sse-test",
  data() {
    return {
      state: {
        color1: "#ffee00",
        range1: 100
      }
    };
  },
  mounted() {
    (async () => {
      try {
        msgServer = await this.$sse(BACKEND_URL + "/events", {
          format: "json"
        });

        // Listen for messages without a specified event
        msgServer.subscribe("", data => {
          console.warn("Received a message w/o an event.", data);
        });

        msgServer.subscribe("update", data => {
          // TODO: check state version is newer than current
          // console.log(data);
          this.state = Object.assign({}, this.state, data); // update state
        });
      } catch (err) {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error("Failed to connect to server", err);
      }
    })();
    // TODO: fetch initial state from server
    this.fetchState();
  },
  methods: {
    async fetchState() {
      fetch(BACKEND_URL + "/state")
        .then(response => response.json())
        .then(msg => {
          this.state = msg.data;
        });
    },
    async pushUpdate(evt) {
      if (evt.type == "change") {
        const target = evt.target;
        fetch(BACKEND_URL + "/update", {
          method: "POST",
          body: JSON.stringify({ [target.id]: target.value })
        });
      }
    }
  },
  beforeDestroy() {
    // prevent ghost connections.
    msgServer.close();
  }
};
</script>
